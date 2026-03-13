# run.py flask --app run run
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
import os
from dotenv import load_dotenv

from config import Config
from models import db, Task
from auth import auth_bp
from tasks import tasks_bp
from todos import todos_bp
from planner import planner_bp
from notes import notes_bp
from dashboard import dashboard_bp

load_dotenv()

app = Flask(__name__)
app.config.from_object(Config)

# ── JWT configuration ───────────────────────────────────────────────
# These ensure JWT looks for "Authorization: Bearer <token>" in headers
app.config['JWT_TOKEN_LOCATION'] = ['headers']          # default, but good to be explicit
app.config['JWT_HEADER_NAME'] = 'Authorization'         # default
app.config['JWT_HEADER_TYPE'] = 'Bearer'                # default
# app.config['JWT_SECRET_KEY'] is already loaded from .env via Config

CORS(app,
     resources={
         r"/*": {  # ← apply to ALL routes (safest for dev)
             "origins": ["http://localhost:5173"],  # ← your exact Vite/React port
             "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"],
             "allow_headers": ["Content-Type", "Authorization", "Accept"],
             "expose_headers": ["Authorization"],
             "supports_credentials": True,
             "max_age": 600  # cache preflight for 10 min
         }
     })

db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

# Register blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(tasks_bp)
app.register_blueprint(todos_bp)
app.register_blueprint(planner_bp)
app.register_blueprint(notes_bp)
app.register_blueprint(dashboard_bp)

# ── Health check (your original one kept + simplified) ───────────────
@app.route("/flask/system-status")
def system_status():
    try:
        db.session.execute("SELECT 1;")
        postgres_ok = True
    except:
        postgres_ok = False

    return jsonify({
        "flask": "working",
        "postgresql": "working" if postgres_ok else "error",
        "overall": "healthy" if postgres_ok else "partial_failure"
    })


if __name__ == "__main__":
    with app.app_context():
        db.create_all()           # creates tables if not exist (development only)
    app.run(debug=True, port=5000)