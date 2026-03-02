from flask import Flask, jsonify
from flask_cors import CORS
import psycopg2
import requests
import os

app = Flask(__name__)
CORS(app)

# -----------------------------
# DATABASE CONFIG
# -----------------------------
DB_CONFIG = {
    "host": "localhost",
    "database": "simpleplanner",
    "user": "planneruser",
    "password": "plannerpass",
    "port": 5432
}

SPRING_BOOT_URL = "http://localhost:8080/api/data"


# -----------------------------
# PostgreSQL Check
# -----------------------------
def check_postgres():
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        cur.execute("SELECT 1;")
        result = cur.fetchone()
        cur.close()
        conn.close()

        return {
            "status": "working",
            "response": result[0]
        }

    except Exception as e:
        return {
            "status": "error",
            "error": str(e)
        }


# -----------------------------
# Spring Boot Check
# -----------------------------
def check_spring():
    try:
        response = requests.get(SPRING_BOOT_URL, timeout=3)
        return {
            "status": "working",
            "response": response.json()
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e)
        }


# -----------------------------
# Full System Health Endpoint
# -----------------------------
@app.route("/flask/system-status")
def system_status():

    postgres_status = check_postgres()
    spring_status = check_spring()

    overall_status = (
        postgres_status["status"] == "working" and
        spring_status["status"] == "working"
    )

    return jsonify({
        "react": "working",
        "flask": "working",
        "postgresql": postgres_status,
        "spring_boot": spring_status,
        "overall": "healthy" if overall_status else "partial_failure"
    })


if __name__ == "__main__":
    app.run(debug=True)