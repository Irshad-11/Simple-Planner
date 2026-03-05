# auth.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity,
    get_jwt,
)
from functools import wraps
from models import db, User
import bcrypt

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")

def admin_required(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        try:
            claims = get_jwt()
            print("JWT DEBUG - Claims received:", claims)  # ← shows what Flask actually sees
            if claims.get("role") != "admin":
                print("JWT DEBUG - Role missing or not admin")
                return jsonify({"error": "Admin access required"}), 403
            return fn(*args, **kwargs)
        except Exception as e:
            print("JWT DEBUG - Validation failed:", str(e))  # ← this will show why 422
            return jsonify({"error": f"JWT validation failed: {str(e)}"}), 422
    return wrapper


@auth_bp.route("/check-username", methods=["GET"])
def check_username():
    username = request.args.get("username")
    if not username:
        return jsonify({"error": "Username required"}), 400

    exists = User.query.filter_by(username=username).first() is not None
    return jsonify({"available": not exists}), 200


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    required = ["first_name", "last_name", "username", "email", "password"]
    if not all(k in data for k in required):
        return jsonify({"error": "Missing required fields"}), 400

    if User.query.filter_by(username=data["username"]).first():
        return jsonify({"error": "Username already taken"}), 409

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "Email already registered"}), 409

    if len(data["password"]) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400

    user = User(
        first_name=data["first_name"],
        last_name=data["last_name"],
        username=data["username"],
        email=data["email"],
        role="user",
    )
    user.set_password(data["password"])

    db.session.add(user)
    db.session.commit()

    token = create_access_token(
        identity=str(user.id),  # ← FIXED HERE
        additional_claims={"role": user.role}
    )

    return jsonify({
        "message": "Registration successful",
        "token": token,
        "role": user.role,
        "user_id": user.id,
        "first_name": user.first_name,
        "last_name": user.last_name
    }), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data.get("username") or not data.get("password"):
        return jsonify({"error": "Username and password required"}), 400

    user = User.query.filter_by(username=data["username"]).first()
    if not user or not user.check_password(data["password"]):
        return jsonify({"error": "Invalid username or password"}), 401

    token = create_access_token(
        identity=str(user.id),  # ← FIXED HERE
        additional_claims={"role": user.role}
    )

    return jsonify({
        "token": token,
        "role": user.role,
        "user_id": user.id,
        "first_name": user.first_name,
        "last_name": user.last_name
    }), 200




# ── Admin only ───────────────────────────────────────────────────────

@auth_bp.route("/users", methods=["GET"])
@admin_required
def get_users():
    users = User.query.all()
    return jsonify([{
        "id": u.id,
        "first_name": u.first_name,
        "last_name": u.last_name,
        "username": u.username,
        "email": u.email,
        "role": u.role,
        "created_at": u.created_at.isoformat()
    } for u in users]), 200


@auth_bp.route("/users/<int:user_id>", methods=["GET"])
@admin_required
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify({
        "id": user.id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "username": user.username,
        "email": user.email,
        "role": user.role
    }), 200


@auth_bp.route("/users/<int:user_id>", methods=["PUT"])
@admin_required
def update_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json()

    allowed_fields = ["first_name", "last_name", "email", "role", "password"]
    for key in data:
        if key not in allowed_fields:
            return jsonify({"error": f"Cannot update field: {key}"}), 400

    if "password" in data and data["password"]:
        if len(data["password"]) < 6:
            return jsonify({"error": "Password must be at least 6 characters"}), 400
        user.set_password(data["password"])

    for key in ["first_name", "last_name", "email", "role"]:
        if key in data:
            setattr(user, key, data[key])

    db.session.commit()
    return jsonify({"message": "User updated successfully"}), 200


@auth_bp.route("/users/<int:user_id>", methods=["DELETE"])
@admin_required
def delete_user(user_id):
    current_user_id = get_jwt_identity()
    if user_id == current_user_id:
        return jsonify({"error": "You cannot delete your own account"}), 403

    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted successfully"}), 200