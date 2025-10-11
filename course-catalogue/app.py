from flask import Flask, jsonify, request
from flask_cors import CORS
import psycopg2
import os
import json
import time

app = Flask(__name__)
CORS(app)

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://student:password@student-db:5432/students")

# Wait for DB
for i in range(10):
    try:
        conn = psycopg2.connect(DATABASE_URL)
        conn.close()
        print("Connected to DB!")
        break
    except psycopg2.OperationalError:
        print(f"DB not ready, retrying ({i+1}/10)...")
        time.sleep(2)

def get_conn():
    return psycopg2.connect(DATABASE_URL)

@app.route("/")
def home():
    return "Course Catalogue Service is running!"

@app.route("/courses", methods=["GET"])
def get_courses():
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("SELECT id, code, title, description FROM courses ORDER BY id ASC;")
    rows = cur.fetchall()
    cur.close()
    conn.close()

    courses = [
        {"id": r[0], "code": r[1], "title": r[2], "description": r[3]}
        for r in rows
    ]
    return jsonify(courses), 200

@app.route("/courses", methods=["POST"])
def add_course():
    data = request.get_json() or {}
    if not all(k in data for k in ("code", "title", "description")):
        return jsonify({"error": "code, title, and description required"}), 400

    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO courses (code, title, description) VALUES (%s, %s, %s) RETURNING id;",
        (data["code"], data["title"], data["description"])
    )
    new_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"id": new_id, **data}), 201

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002, debug=True)
