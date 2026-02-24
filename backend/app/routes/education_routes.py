from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.education import Education
from app.models.resume import Resume

education_bp = Blueprint("education", __name__)

@education_bp.route("/", methods=["POST"])
@jwt_required()
def add_education():
    user_id = get_jwt_identity()
    data = request.get_json()

    resume_id = data.get("resume_id")

    resume = Resume.query.filter_by(
        id=resume_id,
        user_id=int(user_id)
    ).first()

    if not resume:
        return jsonify({"error": "Invalid resume"}), 403

    education = Education(
        resume_id=resume_id,
        degree=data.get("degree"),
        institution=data.get("institution"),
        start_year=data.get("start_year"),
        end_year=data.get("end_year")
    )

    db.session.add(education)
    db.session.commit()

    return jsonify({"message": "Education added","id": education.id}), 201


@education_bp.route("/<int:resume_id>", methods=["GET"])
@jwt_required()
def get_education(resume_id):
    user_id = get_jwt_identity()

    resume = Resume.query.filter_by(
        id=resume_id,
        user_id=int(user_id)
    ).first()

    if not resume:
        return jsonify({"error": "Invalid resume"}), 403

    education_list = Education.query.filter_by(resume_id=resume_id).all()

    return jsonify([
        {
            "id": edu.id,
            "degree": edu.degree,
            "institution": edu.institution,
            "start_year": edu.start_year,
            "end_year": edu.end_year
        } for edu in education_list
    ]), 200