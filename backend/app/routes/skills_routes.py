from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.skills import Skill
from app.models.resume import Resume

skill_bp = Blueprint("skill", __name__)

@skill_bp.route("/", methods=["POST"])
@jwt_required()
def add_skill():
    user_id = get_jwt_identity()
    data = request.get_json()

    resume_id = data.get("resume_id")

    if not resume_id or not data.get("skill_name"):
        return jsonify({"error": "resume_id and skill_name are required"}), 400

    resume = Resume.query.filter_by(
        id=resume_id,
        user_id=int(user_id)
    ).first()

    if not resume:
        return jsonify({"error": "Invalid resume"}), 403

    skill = Skill(
        resume_id=resume_id,
        skill_name=data.get("skill_name")
    )

    db.session.add(skill)
    db.session.commit()

    return jsonify({"message": "Skill added successfully"}), 201


@skill_bp.route("/<int:resume_id>", methods=["GET"])
@jwt_required()
def get_skills(resume_id):
    user_id = get_jwt_identity()

    resume = Resume.query.filter_by(
        id=resume_id,
        user_id=int(user_id)
    ).first()

    if not resume:
        return jsonify({"error": "Invalid resume"}), 403

    skills = Skill.query.filter_by(resume_id=resume_id).all()

    return jsonify([
        {
            "id": skill.id,
            "skill_name": skill.skill_name
        } for skill in skills
    ]), 200