"""
Аутентификация: регистрация, вход, профиль текущего пользователя.
action передаётся в теле запроса: register | login | me | logout | update_profile
"""
import json
import os
import hashlib
import secrets
import psycopg2

SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "public")
CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Token",
}

def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def ok(data: dict, status: int = 200):
    return {"statusCode": status, "headers": {**CORS, "Content-Type": "application/json"}, "body": json.dumps(data, ensure_ascii=False)}

def err(msg: str, status: int = 400):
    return {"statusCode": status, "headers": {**CORS, "Content-Type": "application/json"}, "body": json.dumps({"error": msg}, ensure_ascii=False)}

def user_to_dict(row) -> dict:
    return {
        "id": row[0],
        "email": row[1],
        "name": row[2],
        "age": row[3],
        "city": row[4],
        "bio": row[5],
        "interests": list(row[6]) if row[6] else [],
        "avatar": row[7] or "",
        "verified": row[8],
        "premium": row[9],
        "online": row[10],
        "rating": row[11],
    }

def safe(s: str) -> str:
    return str(s).replace("'", "''")

def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    body = {}
    if event.get("body"):
        body = json.loads(event["body"])

    action = body.get("action", "")
    token = event.get("headers", {}).get("X-Session-Token", "")

    # REGISTER
    if action == "register":
        email = safe(body.get("email", "").strip().lower())
        password = body.get("password", "").strip()
        name = safe(body.get("name", "").strip())
        age = body.get("age")
        city = safe(body.get("city", "Москва").strip())
        bio = safe(body.get("bio", "").strip())
        interests = body.get("interests", [])

        if not email or not password or not name:
            return err("Заполните email, пароль и имя")
        if len(password) < 6:
            return err("Пароль должен быть не менее 6 символов")

        pw_hash = hash_password(password)
        session = secrets.token_hex(32)
        interests_pg = "{" + ",".join(f'"{safe(i)}"' for i in interests) + "}"
        age_val = int(age) if age else "NULL"

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"SELECT id FROM {SCHEMA}.users WHERE email = '{email}'")
        if cur.fetchone():
            conn.close()
            return err("Пользователь с таким email уже существует")

        cur.execute(f"""
            INSERT INTO {SCHEMA}.users (email, password_hash, name, age, city, bio, interests, session_token, online)
            VALUES ('{email}', '{pw_hash}', '{name}', {age_val}, '{city}', '{bio}', '{interests_pg}', '{session}', TRUE)
            RETURNING id, email, name, age, city, bio, interests, avatar_url, verified, premium, online, rating
        """)
        row = cur.fetchone()
        conn.commit()
        conn.close()
        return ok({"user": user_to_dict(row), "token": session}, 201)

    # LOGIN
    if action == "login":
        email = safe(body.get("email", "").strip().lower())
        password = body.get("password", "").strip()

        if not email or not password:
            return err("Введите email и пароль")

        pw_hash = hash_password(password)
        session = secrets.token_hex(32)

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"""
            UPDATE {SCHEMA}.users SET session_token = '{session}', online = TRUE, updated_at = NOW()
            WHERE email = '{email}' AND password_hash = '{pw_hash}'
            RETURNING id, email, name, age, city, bio, interests, avatar_url, verified, premium, online, rating
        """)
        row = cur.fetchone()
        conn.commit()
        conn.close()

        if not row:
            return err("Неверный email или пароль", 401)

        return ok({"user": user_to_dict(row), "token": session})

    # ME — получить профиль по токену
    if action == "me":
        if not token:
            return err("Требуется авторизация", 401)
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"""
            SELECT id, email, name, age, city, bio, interests, avatar_url, verified, premium, online, rating
            FROM {SCHEMA}.users WHERE session_token = '{safe(token)}'
        """)
        row = cur.fetchone()
        conn.close()
        if not row:
            return err("Сессия не найдена", 401)
        return ok({"user": user_to_dict(row)})

    # LOGOUT
    if action == "logout":
        if token:
            conn = get_conn()
            cur = conn.cursor()
            cur.execute(f"UPDATE {SCHEMA}.users SET session_token = NULL, online = FALSE WHERE session_token = '{safe(token)}'")
            conn.commit()
            conn.close()
        return ok({"ok": True})

    # UPDATE PROFILE
    if action == "update_profile":
        if not token:
            return err("Требуется авторизация", 401)
        name = safe(body.get("name", ""))
        age = body.get("age")
        city = safe(body.get("city", ""))
        bio = safe(body.get("bio", ""))
        interests = body.get("interests", [])
        interests_pg = "{" + ",".join(f'"{safe(i)}"' for i in interests) + "}"
        age_val = int(age) if age else "NULL"

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"""
            UPDATE {SCHEMA}.users
            SET name = '{name}', age = {age_val}, city = '{city}',
                bio = '{bio}', interests = '{interests_pg}', updated_at = NOW()
            WHERE session_token = '{safe(token)}'
            RETURNING id, email, name, age, city, bio, interests, avatar_url, verified, premium, online, rating
        """)
        row = cur.fetchone()
        conn.commit()
        conn.close()
        if not row:
            return err("Пользователь не найден", 404)
        return ok({"user": user_to_dict(row)})

    return err("Неизвестный action", 400)
