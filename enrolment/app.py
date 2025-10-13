from flask import Flask, jsonify, request
from flask_cors import CORS
import psycopg2
import os
import time
import json

app = Flask(__name__)
CORS(app)

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://student:password@student-db:5432/students"
)

# Wait for DB
for i in range(10):
    try:
        conn = psycopg2.connect(DATABASE_URL)
        conn.close()
        print("Connected to database.")
        break
    except psycopg2.OperationalError:
        print(f"DB not ready ({i+1}/10), retrying...")
        time.sleep(2)
else:
    raise Exception("Could not connect to DB after retries.")

def get_conn():
    return psycopg2.connect(DATABASE_URL)

@app.route("/")
def home():
    return "✅ Enrolment Service is running and connected to Postgres."

# --- GET all enrolments ---
@app.route("/enrolments", methods=["GET"])
def get_enrolments():
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("SELECT id, student_name, course_code FROM enrolments ORDER BY id ASC;")
    rows = cur.fetchall()
    cur.close()
    conn.close()

    enrolments = [{"id": r[0], "student_name": r[1], "course_code": r[2]} for r in rows]
    return jsonify(enrolments), 200

# --- POST new enrolment ---
@app.route("/enrolments", methods=["POST"])
def add_enrolment():
    data = request.get_json() or {}
    if not all(k in data for k in ("student_name", "course_code")):
        return jsonify({"error": "student_name and course_code are required"}), 400

    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO enrolments (student_name, course_code) VALUES (%s, %s) RETURNING id;",
        (data["student_name"], data["course_code"])
    )
    new_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({
        "id": new_id,
        "student_name": data["student_name"],
        "course_code": data["course_code"]
    }), 201

# --- DELETE enrolment ---
@app.route("/enrolments/<int:enrol_id>", methods=["DELETE"])
def delete_enrolment(enrol_id):
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("DELETE FROM enrolments WHERE id=%s RETURNING id;", (enrol_id,))
    deleted = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()

    if not deleted:
        return jsonify({"error": "Enrolment not found"}), 404
    return jsonify({"message": "Deleted"}), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5004, debug=True)
