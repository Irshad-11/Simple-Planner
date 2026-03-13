# dashboard.py
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Task, Todo
from datetime import datetime, timedelta

dashboard_bp = Blueprint("dashboard", __name__, url_prefix="/api")

SPRING_BOOT_URL = "http://localhost:8080/api/internal/process-stats"

@dashboard_bp.route("/dashboard-stats", methods=["GET"])
@jwt_required()
def get_dashboard_stats():
    user_id = get_jwt_identity()

    try:
        # 1. Fetch real data
        tasks = Task.query.filter_by(user_id=user_id).all()
        todos = Todo.query.filter_by(user_id=user_id).all()

        total_tasks = len(tasks)
        completed_tasks = sum(1 for t in tasks if getattr(t, 'status', None) == 'Done')
        pending_tasks = total_tasks - completed_tasks

        total_todos = len(todos)
        completed_todos = sum(1 for t in todos if getattr(t, 'is_completed', False))

        # 2. Real weekly activity (current week Mon–Sun)
        today = datetime.today().date()
        start_of_week = today - timedelta(days=today.weekday())  # Monday
        end_of_week = start_of_week + timedelta(days=6)          # Sunday

        daily_total_activity = [0] * 7
        daily_completed_activity = [0] * 7

        # Tasks
        for task in tasks:
            if hasattr(task, 'due_date') and task.due_date:
                due = task.due_date
                if start_of_week <= due <= end_of_week:
                    weekday = due.weekday()
                    daily_total_activity[weekday] += 1
                    if getattr(task, 'status', None) == 'Done':
                        daily_completed_activity[weekday] += 1

        # Todos
        for todo in todos:
            if hasattr(todo, 'due_date') and todo.due_date:
                due = todo.due_date
                if start_of_week <= due <= end_of_week:
                    weekday = due.weekday()
                    daily_total_activity[weekday] += 1
                    if getattr(todo, 'is_completed', False):
                        daily_completed_activity[weekday] += 1

        # 3. Optional Spring Boot call (fallback to raw if fails)
        payload = {
            "totalTasks": total_tasks,
            "completedTasks": completed_tasks,
            "pendingTasks": pending_tasks,
            "totalTodos": total_todos,
            "completedTodos": completed_todos,
            "dailyActivity": daily_total_activity,
            "dailyCompletedActivity": daily_completed_activity
        }

        try:
            resp = requests.post(SPRING_BOOT_URL, json=payload, timeout=8)
            resp.raise_for_status()
            processed = resp.json()
        except Exception as e:
            print("Spring Boot failed:", str(e))
            processed = payload  # use Flask's calculated values

        # 4. Final clean response (always real data)
        data = {
            "totalTasks": processed.get("totalTasks", total_tasks),
            "completedTasks": processed.get("completedTasks", completed_tasks),
            "pendingTasks": processed.get("pendingTasks", pending_tasks),
            "totalTodos": processed.get("totalTodos", total_todos),
            "completedTodos": processed.get("completedTodos", completed_todos),
            "completionRate": f"{round((completed_tasks / total_tasks * 100) if total_tasks > 0 else 0, 1)}%",
            "weeklyTrend": {
                "labels": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                "total": processed.get("dailyActivity", daily_total_activity),
                "completed": processed.get("dailyCompletedActivity", daily_completed_activity)
            }
        }

        return jsonify(data), 200

    except Exception as e:
        print("DASHBOARD ERROR:", str(e))
        return jsonify({"error": "Failed to generate stats", "details": str(e)}), 500