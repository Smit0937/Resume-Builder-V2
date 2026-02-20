from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.resume import Resume
from app.models.experience import Experience
from app.services.ai_service import generate_summary

ai_bp = Blueprint("ai", __name__)

@ai_bp.route("/generate-summary/<int:resume_id>", methods=["GET"])
@jwt_required()
def ai_generate_summary(resume_id):

    user_id = get_jwt_identity()

    resume = Resume.query.filter_by(
        id=resume_id,
        user_id=int(user_id)
    ).first()

    if not resume:
        return jsonify({"error": "Resume not found"}), 404

    experience = Experience.query.filter_by(resume_id=resume_id).all()

    exp_data = [
        {
            "role": e.role,
            "company": e.company
        } for e in experience
    ]

    summary = generate_summary({
        "title": resume.title,
        "experience": exp_data
    })

    return jsonify({
        "ai_generated_summary": summary
    }), 200