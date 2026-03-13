# models.py
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

from sqlalchemy import Enum

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default="user", nullable=False)  # user or admin
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def set_password(self, password):
        from bcrypt import hashpw, gensalt
        self.password_hash = hashpw(password.encode('utf-8'), gensalt()).decode('utf-8')

    def check_password(self, password):
        from bcrypt import checkpw
        return checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))
    

# Then your TaskStatus / TaskPriority / Task models


class Task(db.Model):
    __tablename__ = "tasks"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    title = db.Column(db.String(200), nullable=False)
    due_date = db.Column(db.Date, nullable=False)
    priority = db.Column(
        Enum(
            "High", "Medium", "Low",
            name="task_priority"
        ),
        nullable=False,
        default="Medium"
    )

    status = db.Column(
        Enum(
            "Pending", "Done", "Postponed", "Canceled",
            name="task_status"
        ),
        nullable=False,
        default="Pending"
    )
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = db.relationship("User", backref=db.backref("tasks", lazy="dynamic", cascade="all, delete-orphan"))

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "due_date": self.due_date.isoformat() if self.due_date else None,
            "priority": self.priority,   # already a string like "High"
            "status": self.status,       # already "Pending"
            "created_at": self.created_at.isoformat(),
        }


# models.py - append at the end

# models.py — replace or add this class at the end

class Todo(db.Model):
    __tablename__ = "todos"

    id           = db.Column(db.Integer, primary_key=True)
    user_id      = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    title        = db.Column(db.String(300), nullable=False)
    is_completed = db.Column(db.Boolean, default=False, nullable=False)
    due_date     = db.Column(db.Date, nullable=True)
    position     = db.Column(db.Integer, default=0, nullable=False)
    created_at   = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at   = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "is_completed": self.is_completed,
            "due_date": self.due_date.isoformat() if self.due_date else None,
            "position": self.position,
            "created_at": self.created_at.isoformat(),
        }


class Note(db.Model):
    __tablename__ = "notes"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, default="", nullable=False)          # markdown source
    folder_id = db.Column(db.Integer, db.ForeignKey("folders.id"), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = db.relationship("User", backref="notes")
    folder = db.relationship("Folder", backref="notes", lazy="select")

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "content": self.content,
            "folder_id": self.folder_id,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }


class Folder(db.Model):
    __tablename__ = "folders"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    name = db.Column(db.String(100), nullable=False)
    parent_id = db.Column(db.Integer, db.ForeignKey("folders.id"), nullable=True)  # for nested folders
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", backref="folders")
    parent = db.relationship("Folder", remote_side=[id], backref="children")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "parent_id": self.parent_id,
            "created_at": self.created_at.isoformat(),
        }