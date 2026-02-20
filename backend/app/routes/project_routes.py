from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.project import Project
from app.models.resume import Resume

project_bp = Blueprint("project", __name__)

@project_bp.route("/", methods=["POST"])
@jwt_required()
def add_project():
    user_id = get_jwt_identity()
    data = request.get_json()

    resume_id = data.get("resume_id")

    if not resume_id or not data.get("project_title"):
        return jsonify({"error": "resume_id and project_title are required"}), 400

    resume = Resume.query.filter_by(
        id=resume_id,
        user_id=int(user_id)
    ).first()

    if not resume:
        return jsonify({"error": "Invalid resume"}), 403

    project = Project(
        resume_id=resume_id,
        project_title=data.get("project_title"),
        description=data.get("description")
    )

    db.session.add(project)
    db.session.commit()

    return jsonify({"message": "Project added successfully"}), 201


@project_bp.route("/<int:resume_id>", methods=["GET"])
@jwt_required()
def get_projects(resume_id):
    user_id = get_jwt_identity()

    resume = Resume.query.filter_by(
        id=resume_id,
        user_id=int(user_id)
    ).first()

    if not resume:
        return jsonify({"error": "Invalid resume"}), 403

    projects = Project.query.filter_by(resume_id=resume_id).all()

    return jsonify([
        {
            "id": p.id,
            "project_title": p.project_title,
            "description": p.description
        } for p in projects
    ]), 200


@project_bp.route("/<int:project_id>", methods=["PUT"])
@jwt_required()
def update_project(project_id):
    user_id = get_jwt_identity()
    data = request.get_json()

    project = Project.query.get(project_id)

    if not project:
        return jsonify({"error": "Project not found"}), 404

    resume = Resume.query.filter_by(
        id=project.resume_id,
        user_id=int(user_id)
    ).first()

    if not resume:
        return jsonify({"error": "Unauthorized"}), 403

    project.project_title = data.get("project_title", project.project_title)
    project.description = data.get("description", project.description)

    db.session.commit()

    return jsonify({"message": "Project updated successfully"}), 200


@project_bp.route("/<int:project_id>", methods=["DELETE"])
@jwt_required()
def delete_project(project_id):
    user_id = get_jwt_identity()

    project = Project.query.get(project_id)

    if not project:
        return jsonify({"error": "Project not found"}), 404

    resume = Resume.query.filter_by(
        id=project.resume_id,
        user_id=int(user_id)
    ).first()

    if not resume:
        return jsonify({"error": "Unauthorized"}), 403

    db.session.delete(project)
    db.session.commit()

    return jsonify({"message": "Project deleted successfully"}), 200