# tasks.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from sqlalchemy.exc import IntegrityError
from functools import wraps
from models import db, Task
from auth import admin_required   # optional – if you want admin to see all

tasks_bp = Blueprint("tasks", __name__, url_prefix="/tasks")


def ownership_required(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        current_user_id = int(get_jwt_identity())
        task_id = kwargs.get("task_id")

        if task_id is not None:  # only check for routes that have task_id
            task = Task.query.get(task_id)
            if not task:
                return jsonify({"error": "Task not found"}), 404
            if task.user_id != current_user_id:
                return jsonify({"error": "You do not own this task"}), 403
            kwargs["task"] = task  # attach to kwargs

        return fn(*args, **kwargs)

    return wrapper


@tasks_bp.route("", methods=["GET"])
@jwt_required()
def get_tasks():
    current_user_id = int(get_jwt_identity())
    tasks = Task.query.filter_by(user_id=current_user_id).order_by(Task.due_date.asc()).all()
    return jsonify([t.to_dict() for t in tasks]), 200


@tasks_bp.route("", methods=["POST"])
@jwt_required()
def create_task():
    current_user_id = int(get_jwt_identity())
    data = request.get_json()

    required = ["title", "due_date"]
    if not all(k in data for k in required):
        return jsonify({"error": "Missing required fields: title, due_date"}), 400

    try:
        due_date = datetime.fromisoformat(data["due_date"]).date()
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid due_date format. Use YYYY-MM-DD"}), 400

    priority = data.get("priority", "Medium")
    if priority not in ["High", "Medium", "Low"]:
        return jsonify({"error": "Invalid priority. Allowed: High, Medium, Low"}), 400

    status = data.get("status", "Pending")
    if status not in ["Pending", "Done", "Postponed", "Canceled"]:
        return jsonify({"error": "Invalid status. Allowed: Pending, Done, Postponed, Canceled"}), 4000

    task = Task(
        user_id=current_user_id,
        title=data["title"].strip(),
        due_date=due_date,
        priority=priority,   # ← just the string
        status=status,       # ← just the string
    )

    db.session.add(task)
    db.session.commit()

    return jsonify(task.to_dict()), 201


@tasks_bp.route("/<int:task_id>", methods=["GET"])
@ownership_required
def get_task(task_id, task):
    return jsonify(task.to_dict()), 200


@tasks_bp.route("/<int:task_id>", methods=["PUT"])
@ownership_required
def update_task(task_id, task):
    data = request.get_json()

    if "title" in data:
        task.title = data["title"].strip()

    if "due_date" in data:
        try:
            task.due_date = datetime.fromisoformat(data["due_date"]).date()
        except (ValueError, TypeError):
            return jsonify({"error": "Invalid due_date format. Use YYYY-MM-DD"}), 400

    if "priority" in data:
        if data["priority"] not in ["High", "Medium", "Low"]:
            return jsonify({"error": "Invalid priority"}), 400
        task.priority = data["priority"]

    if "status" in data:
        if data["status"] not in ["Pending", "Done", "Postponed", "Canceled"]:
            return jsonify({"error": "Invalid status"}), 400
        task.status = data["status"]

    db.session.commit()                           # ← moved out
    return jsonify(task.to_dict()), 200           # ← moved out


@tasks_bp.route("/<int:task_id>", methods=["DELETE"])
@ownership_required
def delete_task(task_id, task):
    db.session.delete(task)
    db.session.commit()
    return jsonify({"message": "Task deleted successfully"}), 200