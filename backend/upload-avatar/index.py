"""
Загрузка аватара пользователя в S3.
Принимает base64-изображение, сохраняет в S3, обновляет avatar_url в БД.
"""
import json
import os
import base64
import uuid
import psycopg2
import boto3

SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "public")
CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Token",
}

def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def ok(data: dict):
    return {"statusCode": 200, "headers": {**CORS, "Content-Type": "application/json"}, "body": json.dumps(data, ensure_ascii=False)}

def err(msg: str, status: int = 400):
    return {"statusCode": status, "headers": {**CORS, "Content-Type": "application/json"}, "body": json.dumps({"error": msg}, ensure_ascii=False)}

def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    token = event.get("headers", {}).get("X-Session-Token", "")
    if not token:
        return err("Требуется авторизация", 401)

    body = json.loads(event.get("body") or "{}")
    image_data = body.get("image", "")
    content_type = body.get("content_type", "image/jpeg")

    if not image_data:
        return err("Нет изображения")

    # Декодируем base64
    if "," in image_data:
        image_data = image_data.split(",", 1)[1]
    image_bytes = base64.b64decode(image_data)

    if len(image_bytes) > 5 * 1024 * 1024:
        return err("Файл слишком большой (максимум 5 МБ)")

    ext = "jpg" if "jpeg" in content_type else content_type.split("/")[-1]
    file_key = f"avatars/{uuid.uuid4()}.{ext}"

    # Загружаем в S3
    s3 = boto3.client(
        "s3",
        endpoint_url="https://bucket.poehali.dev",
        aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
        aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"],
    )
    s3.put_object(
        Bucket="files",
        Key=file_key,
        Body=image_bytes,
        ContentType=content_type,
    )

    cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{file_key}"

    # Обновляем в БД
    safe_token = token.replace("'", "''")
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(f"""
        UPDATE {SCHEMA}.users SET avatar_url = '{cdn_url}', updated_at = NOW()
        WHERE session_token = '{safe_token}'
        RETURNING id
    """)
    row = cur.fetchone()
    conn.commit()
    conn.close()

    if not row:
        return err("Пользователь не найден", 401)

    return ok({"avatar_url": cdn_url})
