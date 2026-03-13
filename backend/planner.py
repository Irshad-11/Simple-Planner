from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from models import db, Task, Todo

planner_bp = Blueprint("planner", __name__, url_prefix="/planner")


@planner_bp.route("/month", methods=["GET"])
@jwt_required()
def get_month_events():
    user_id = int(get_jwt_identity())
    year = int(request.args.get("year"))
    month = int(request.args.get("month"))

    start_date = datetime(year, month, 1).date()
    if month == 12:
        end_date = datetime(year + 1, 1, 1).date()
    else:
        end_date = datetime(year, month + 1, 1).date()

    tasks = Task.query.filter(
        Task.user_id == user_id,
        Task.due_date >= start_date,
        Task.due_date < end_date
    ).all()

    todos = Todo.query.filter(
        Todo.user_id == user_id,
        Todo.due_date >= start_date,
        Todo.due_date < end_date
    ).all()

    event_dates = set()

    for t in tasks:
        if t.due_date:
            event_dates.add(t.due_date.isoformat())

    for t in todos:
        if t.due_date:                      # ← explicit check (safer)
            event_dates.add(t.due_date.isoformat())

    return jsonify(list(event_dates)), 200


@planner_bp.route("/day/<string:date_str>", methods=["GET"])
@jwt_required()
def get_day_details(date_str):
    user_id = int(get_jwt_identity())
    try:
        target_date = datetime.fromisoformat(date_str).date()
    except ValueError:
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400

    tasks = Task.query.filter_by(user_id=user_id, due_date=target_date)\
                      .order_by(Task.priority).all()

    todos = Todo.query.filter_by(user_id=user_id, due_date=target_date)\
                      .order_by(Todo.position).all()

    return jsonify({
        "date": date_str,
        "tasks": [t.to_dict() for t in tasks],
        "todos": [t.to_dict() for t in todos]
    }), 200