"""
Поиск пользователей и свайп-действия (лайк, дизлайк, суперлайк).
GET / — список анкет для поиска (исключает уже просмотренных)
POST / action=swipe — записывает лайк/дизлайк, проверяет матч
"""
import json
import os
import psycopg2

SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "public")
CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Token",
}

def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def ok(data: dict):
    return {"statusCode": 200, "headers": {**CORS, "Content-Type": "application/json"}, "body": json.dumps(data, ensure_ascii=False, default=str)}

def err(msg: str, status: int = 400):
    return {"statusCode": status, "headers": {**CORS, "Content-Type": "application/json"}, "body": json.dumps({"error": msg}, ensure_ascii=False)}

def get_current_user_id(cur, token: str):
    safe_token = token.replace("'", "''")
    cur.execute(f"SELECT id FROM {SCHEMA}.users WHERE session_token = '{safe_token}'")
    row = cur.fetchone()
    return row[0] if row else None

def user_row_to_dict(row) -> dict:
    avatar = row[6] or ""
    fallback = f"https://api.dicebear.com/7.x/avataaars/svg?seed={row[0]}"
    return {
        "id": row[0],
        "name": row[1],
        "age": row[2],
        "city": row[3],
        "bio": row[4],
        "interests": list(row[5]) if row[5] else [],
        "avatar": avatar or fallback,
        "photos": [avatar or fallback],
        "verified": row[7],
        "premium": row[8],
        "online": row[9],
        "rating": row[10],
        "matchScore": 75 + (row[0] % 20),
    }

def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    token = event.get("headers", {}).get("X-Session-Token", "")
    method = event.get("httpMethod", "GET")

    conn = get_conn()
    cur = conn.cursor()
    current_id = get_current_user_id(cur, token)

    if not current_id:
        conn.close()
        return err("Требуется авторизация", 401)

    # GET — список анкет для поиска
    if method == "GET":
        # Пользователи которых ещё не свайпали + не сам пользователь
        cur.execute(f"""
            SELECT u.id, u.name, u.age, u.city, u.bio, u.interests,
                   u.avatar_url, u.verified, u.premium, u.online, u.rating
            FROM {SCHEMA}.users u
            WHERE u.id != {current_id}
              AND u.id NOT IN (
                SELECT to_user_id FROM {SCHEMA}.likes WHERE from_user_id = {current_id}
              )
            ORDER BY u.online DESC, u.updated_at DESC
            LIMIT 20
        """)
        rows = cur.fetchall()
        conn.close()
        return ok({"users": [user_row_to_dict(r) for r in rows]})

    # POST — свайп
    if method == "POST":
        body = json.loads(event.get("body") or "{}")
        action = body.get("action", "")

        if action == "swipe":
            to_id = body.get("to_user_id")
            swipe_type = body.get("type", "like")  # like | dislike | super_like

            if not to_id:
                conn.close()
                return err("Не указан пользователь")

            # Записываем действие
            cur.execute(f"""
                INSERT INTO {SCHEMA}.likes (from_user_id, to_user_id, type)
                VALUES ({current_id}, {int(to_id)}, '{swipe_type}')
                ON CONFLICT (from_user_id, to_user_id) DO UPDATE SET type = '{swipe_type}'
            """)

            is_match = False
            match_user = None

            # Проверяем взаимный лайк (матч)
            if swipe_type in ("like", "super_like"):
                cur.execute(f"""
                    SELECT l.from_user_id,
                           u.id, u.name, u.age, u.city, u.bio, u.interests,
                           u.avatar_url, u.verified, u.premium, u.online, u.rating
                    FROM {SCHEMA}.likes l
                    JOIN {SCHEMA}.users u ON u.id = l.from_user_id
                    WHERE l.from_user_id = {int(to_id)}
                      AND l.to_user_id = {current_id}
                      AND l.type IN ('like', 'super_like')
                """)
                mutual = cur.fetchone()

                if mutual:
                    is_match = True
                    # Создаём матч (меньший id первый)
                    u1, u2 = min(current_id, int(to_id)), max(current_id, int(to_id))
                    cur.execute(f"""
                        INSERT INTO {SCHEMA}.matches (user1_id, user2_id)
                        VALUES ({u1}, {u2})
                        ON CONFLICT DO NOTHING
                    """)
                    match_user = {
                        "id": mutual[1],
                        "name": mutual[2],
                        "age": mutual[3],
                        "avatar": mutual[7] or f"https://api.dicebear.com/7.x/avataaars/svg?seed={mutual[1]}",
                    }

            conn.commit()
            conn.close()
            return ok({"ok": True, "match": is_match, "match_user": match_user})

    conn.close()
    return err("Не найдено", 404)
