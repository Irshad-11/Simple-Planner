from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from functools import wraps
from datetime import datetime
from models import db, Todo

todos_bp = Blueprint("todos", __name__, url_prefix="/todos")


def todo_ownership_required(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        current_user_id = int(get_jwt_identity())
        todo_id = kwargs.get("todo_id")
        if todo_id:
            todo = Todo.query.get(todo_id)
            if not todo:
                return jsonify({"error": "To-do not found"}), 404
            if todo.user_id != current_user_id:
                return jsonify({"error": "Unauthorized"}), 403
            kwargs["todo"] = todo
        return fn(*args, **kwargs)
    return wrapper


@todos_bp.route("", methods=["GET"])
@jwt_required()
def get_todos():
    user_id = int(get_jwt_identity())
    todos = Todo.query.filter_by(user_id=user_id).order_by(
        Todo.is_completed.asc(),
        Todo.position.asc(),
        Todo.created_at.asc()
    ).all()
    return jsonify([t.to_dict() for t in todos]), 200


@todos_bp.route("", methods=["POST"])
@jwt_required()
def create_todo():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    title = data.get("title", "").strip()

    if not title:
        return jsonify({"error": "Title is required"}), 400

    due_date = None
    due_date_str = data.get("due_date")
    if due_date_str:
        try:
            due_date = datetime.fromisoformat(due_date_str).date()
        except (ValueError, TypeError):
            pass  # invalid → keep None

    max_pos = db.session.query(db.func.max(Todo.position)).filter_by(user_id=user_id).scalar() or 0

    todo = Todo(
        user_id=user_id,
        title=title,
        is_completed=False,
        due_date=due_date,           # ← FIXED: actually saved now
        position=max_pos + 1
    )
    db.session.add(todo)
    db.session.commit()
    return jsonify(todo.to_dict()), 201


@todos_bp.route("/<int:todo_id>", methods=["PUT"])
@todo_ownership_required
def update_todo(todo_id, todo):
    data = request.get_json()

    if "title" in data:
        todo.title = data["title"].strip()

    if "is_completed" in data:
        todo.is_completed = bool(data["is_completed"])

    if "due_date" in data:
        due_date_str = data["due_date"]
        if due_date_str:
            try:
                todo.due_date = datetime.fromisoformat(due_date_str).date()
            except (ValueError, TypeError):
                todo.due_date = None
        else:
            todo.due_date = None

    if "position" in data:
        todo.position = int(data["position"])

    db.session.commit()
    return jsonify(todo.to_dict()), 200


@todos_bp.route("/<int:todo_id>", methods=["DELETE"])
@todo_ownership_required
def delete_todo(todo_id, todo):
    db.session.delete(todo)
    db.session.commit()
    return jsonify({"message": "Deleted"}), 200