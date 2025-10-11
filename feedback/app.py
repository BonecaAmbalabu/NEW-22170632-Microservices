from flask import Flask, jsonify, request
from flask_cors import CORS
import psycopg2
import os
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
    return "Feedback Service is running!"

@app.route("/feedback", methods=["GET"])
def get_feedback():
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("SELECT id, student_name, course_code, comment FROM feedback ORDER BY id ASC;")
    rows = cur.fetchall()
    cur.close()
    conn.close()

    feedback = [
        {"id": r[0], "student_name": r[1], "course_code": r[2], "comment": r[3]}
        for r in rows
    ]
    return jsonify(feedback), 200

@app.route("/feedback", methods=["POST"])
def add_feedback():
    data = request.get_json() or {}
    if not all(k in data for k in ("student_name", "course_code", "comment")):
        return jsonify({"error": "student_name, course_code, and comment are required"}), 400

    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO feedback (student_name, course_code, comment) VALUES (%s, %s, %s) RETURNING id;",
        (data["student_name"], data["course_code"], data["comment"])
    )
    new_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"id": new_id, **data}), 201

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5003, debug=True)
