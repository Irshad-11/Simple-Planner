# notes.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Note, Folder
from datetime import datetime

notes_bp = Blueprint("notes", __name__, url_prefix="/notes")


# ────────────── Notes ──────────────

@notes_bp.route("", methods=["GET"])
@jwt_required()
def get_notes():
    user_id = int(get_jwt_identity())
    folder_id = request.args.get("folder_id", type=int)
    
    query = Note.query.filter_by(user_id=user_id)
    if folder_id is not None:
        query = query.filter_by(folder_id=folder_id)
    else:
        query = query.filter(Note.folder_id.is_(None))  # root notes by default
    
    notes = query.order_by(Note.updated_at.desc()).all()
    return jsonify([n.to_dict() for n in notes]), 200


@notes_bp.route("", methods=["POST"])
@jwt_required()
def create_note():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    
    title = (data.get("title") or "").strip()
    content = data.get("content", "")
    folder_id = data.get("folder_id")
    
    if not title:
        return jsonify({"error": "Title is required"}), 400
    
    note = Note(
        user_id=user_id,
        title=title,
        content=content,
        folder_id=folder_id if folder_id else None
    )
    db.session.add(note)
    db.session.commit()
    
    return jsonify(note.to_dict()), 201


@notes_bp.route("/<int:note_id>", methods=["GET"])
@jwt_required()
def get_single_note(note_id):
    user_id = int(get_jwt_identity())
    note = Note.query.filter_by(id=note_id, user_id=user_id).first()
    if not note:
        return jsonify({"error": "Note not found"}), 404
    return jsonify(note.to_dict()), 200


@notes_bp.route("/<int:note_id>", methods=["PUT"])
@jwt_required()
def update_note(note_id):
    user_id = int(get_jwt_identity())
    note = Note.query.filter_by(id=note_id, user_id=user_id).first()
    if not note:
        return jsonify({"error": "Note not found"}), 404
    
    data = request.get_json()
    
    if "title" in data:
        note.title = (data["title"] or "").strip()
    if "content" in data:
        note.content = data["content"]
    if "folder_id" in data:
        note.folder_id = data["folder_id"] if data["folder_id"] else None
    
    note.updated_at = datetime.utcnow()
    db.session.commit()
    
    return jsonify(note.to_dict()), 200


@notes_bp.route("/<int:note_id>", methods=["DELETE"])
@jwt_required()
def delete_note(note_id):
    user_id = int(get_jwt_identity())
    note = Note.query.filter_by(id=note_id, user_id=user_id).first()
    if not note:
        return jsonify({"error": "Note not found"}), 404
    
    db.session.delete(note)
    db.session.commit()
    return jsonify({"message": "Note deleted"}), 200


# ────────────── Folders ──────────────

@notes_bp.route("/folders", methods=["GET"])
@jwt_required()
def get_folders():
    user_id = int(get_jwt_identity())
    folders = Folder.query.filter_by(user_id=user_id)\
                         .order_by(Folder.name.asc()).all()
    return jsonify([f.to_dict() for f in folders]), 200


@notes_bp.route("/folders", methods=["POST"])
@jwt_required()
def create_folder():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    
    name = (data.get("name") or "").strip()
    parent_id = data.get("parent_id")
    
    if not name:
        return jsonify({"error": "Folder name is required"}), 400
    
    folder = Folder(
        user_id=user_id,
        name=name,
        parent_id=parent_id if parent_id else None
    )
    db.session.add(folder)
    db.session.commit()
    
    return jsonify(folder.to_dict()), 201


@notes_bp.route("/folders/<int:folder_id>", methods=["PUT"])
@jwt_required()
def update_folder(folder_id):
    user_id = int(get_jwt_identity())
    folder = Folder.query.filter_by(id=folder_id, user_id=user_id).first()
    if not folder:
        return jsonify({"error": "Folder not found"}), 404
    
    data = request.get_json()
    if "name" in data:
        folder.name = (data["name"] or "").strip()
    if "parent_id" in data:
        folder.parent_id = data["parent_id"] if data["parent_id"] else None
    
    db.session.commit()
    return jsonify(folder.to_dict()), 200


@notes_bp.route("/folders/<int:folder_id>", methods=["DELETE"])
@jwt_required()
def delete_folder(folder_id):
    user_id = int(get_jwt_identity())
    folder = Folder.query.filter_by(id=folder_id, user_id=user_id).first()
    if not folder:
        return jsonify({"error": "Folder not found"}), 404
    
    # Optional: move notes to root or delete cascade (depending on your needs)
    # Here we just delete folder – notes become root notes
    Note.query.filter_by(folder_id=folder_id).update({"folder_id": None})
    
    db.session.delete(folder)
    db.session.commit()
    return jsonify({"message": "Folder deleted"}), 200