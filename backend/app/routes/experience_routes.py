from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.experience import Experience
from app.models.resume import Resume
from datetime import datetime

experience_bp = Blueprint("experience", __name__)

@experience_bp.route("/", methods=["POST"])
@jwt_required()
def add_experience():
    user_id = get_jwt_identity()
    data = request.get_json()

    resume_id = data.get("resume_id")

    if not resume_id:
        return jsonify({"error": "resume_id is required"}), 400

    resume = Resume.query.filter_by(
        id=resume_id,
        user_id=int(user_id)
    ).first()

    if not resume:
        return jsonify({"error": "Invalid resume"}), 403

    if not data.get("company") or not data.get("role") or not data.get("start_date"):
        return jsonify({"error": "company, role and start_date are required"}), 400

    try:
        start_date = datetime.strptime(
            data.get("start_date"), "%Y-%m-%d"
        ).date()
    except Exception:
        return jsonify({"error": "Invalid start_date format. Use YYYY-MM-DD"}), 400

    end_date = None
    if data.get("end_date"):
        try:
            end_date = datetime.strptime(
                data.get("end_date"), "%Y-%m-%d"
            ).date()
        except Exception:
            return jsonify({"error": "Invalid end_date format. Use YYYY-MM-DD"}), 400

    experience = Experience(
        resume_id=resume_id,
        company=data.get("company"),
        role=data.get("role"),
        description=data.get("description"),
        start_date=start_date,
        end_date=end_date
    )

    db.session.add(experience)
    db.session.commit()

    return jsonify({"message": "Experience added successfully"}), 201


@experience_bp.route("/<int:resume_id>", methods=["GET"])
@jwt_required()
def get_experience(resume_id):
    user_id = get_jwt_identity()

    resume = Resume.query.filter_by(
        id=resume_id,
        user_id=int(user_id)
    ).first()

    if not resume:
        return jsonify({"error": "Invalid resume"}), 403

    experience_list = Experience.query.filter_by(resume_id=resume_id).all()

    return jsonify([
        {
            "id": exp.id,
            "company": exp.company,
            "role": exp.role,
            "description": exp.description,
            "start_date": exp.start_date,
            "end_date": exp.end_date
        } for exp in experience_list
    ]), 200