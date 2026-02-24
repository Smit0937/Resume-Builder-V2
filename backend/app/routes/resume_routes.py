from flask import Blueprint, request, jsonify, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.resume import Resume
from app.models.education import Education
from app.models.experience import Experience
from app.models.skills import Skill
from app.models.project import Project
from app.models.certification import Certification
from app.services.pdf_service import generate_resume_pdf

resume_bp = Blueprint("resume", __name__)

@resume_bp.route("/", methods=["POST"])
@jwt_required()
def create_resume():
    user_id = get_jwt_identity()
    data = request.get_json()

    if not data.get("title"):
        return jsonify({"error": "Title is required"}), 400

    new_resume = Resume(
        user_id=user_id,
        title=data.get("title"),
        summary=data.get("summary"),
        template_name=data.get("template_name", "corporate")
    )

    db.session.add(new_resume)
    db.session.commit()

    return jsonify({
        "message": "Resume created successfully",
        "resume_id": new_resume.id
    }), 201


@resume_bp.route("/all", methods=["GET"])
@jwt_required()
def get_resumes():
    user_id = get_jwt_identity()
    resumes = Resume.query.filter_by(user_id=int(user_id)).all()

    return jsonify([
        {
            "id": r.id,
            "title": r.title,
            "summary": r.summary,
            "created_at": r.created_at
        } for r in resumes
    ]), 200


@resume_bp.route("/<int:resume_id>", methods=["GET"])
@jwt_required()
def get_resume(resume_id):
    user_id = get_jwt_identity()

    resume = Resume.query.filter_by(
        id=resume_id,
        user_id=int(user_id)
    ).first()

    if not resume:
        return jsonify({"error": "Resume not found"}), 404

    return jsonify({
    "id": resume.id,
    "title": resume.title,
    "summary": resume.summary,
    "full_name": resume.full_name,
    "professional_title": resume.professional_title,
    "email": resume.email,
    "phone": resume.phone,
    "location": resume.location,
    "linkedin": resume.linkedin,
    "website": resume.website,
    "nationality": resume.nationality,
    "date_of_birth": resume.date_of_birth,
    "created_at": resume.created_at,
    "updated_at": resume.updated_at
}), 200


@resume_bp.route("/<int:resume_id>", methods=["PUT"])
@jwt_required()
def update_resume(resume_id):
    user_id = get_jwt_identity()

    resume = Resume.query.filter_by(
        id=resume_id,
        user_id=int(user_id)
    ).first()

    if not resume:
        return jsonify({"error": "Resume not found"}), 404

    data = request.get_json()

    resume.full_name = data.get("full_name", resume.full_name)
    resume.professional_title = data.get("professional_title", resume.professional_title)
    resume.email = data.get("email", resume.email)
    resume.phone = data.get("phone", resume.phone)
    resume.location = data.get("location", resume.location)
    resume.linkedin = data.get("linkedin", resume.linkedin)
    resume.website = data.get("website", resume.website)
    resume.nationality = data.get("nationality", resume.nationality)
    resume.date_of_birth = data.get("date_of_birth", resume.date_of_birth)

    db.session.commit()

    return jsonify({"message": "Resume updated successfully"}), 200


@resume_bp.route("/<int:resume_id>", methods=["DELETE"])
@jwt_required()
def delete_resume(resume_id):
    user_id = get_jwt_identity()

    resume = Resume.query.filter_by(
        id=resume_id,
        user_id=int(user_id)
    ).first()

    if not resume:
        return jsonify({"error": "Resume not found"}), 404

    db.session.delete(resume)
    db.session.commit()

    return jsonify({"message": "Resume deleted successfully"}), 200


@resume_bp.route("/download/<int:resume_id>", methods=["GET"])
@jwt_required()
def download_resume(resume_id):
    user_id = get_jwt_identity()

    resume = Resume.query.filter_by(
        id=resume_id,
        user_id=int(user_id)
    ).first()

    if not resume:
        return jsonify({"error": "Resume not found"}), 404

    pdf = generate_resume_pdf(resume_id)

    return send_file(
        pdf,
        as_attachment=True,
        download_name="resume.pdf",
        mimetype="application/pdf"
    )