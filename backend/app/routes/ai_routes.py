from datetime import date
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.resume import Resume
from app.services.ai_service import generate_summary, generate_experience_description, generate_project_description

ai_bp = Blueprint("ai", __name__)

@ai_bp.route("/generate-summary/<int:resume_id>", methods=["GET"])
@jwt_required()
def ai_generate_summary(resume_id):   
    user_id = get_jwt_identity()

    resume = Resume.query.filter_by(id=resume_id, user_id=int(user_id)).first()
    if not resume:  # pragma: no cover
        return jsonify({"error": "Resume not found"}), 404

    summary = generate_summary({
        "full_name": resume.full_name or "",
        "professional_title": resume.professional_title or ""
    })
    
    return jsonify({"ai_generated_summary": summary}), 200

@ai_bp.route("/generate-experience", methods=["POST"])
@jwt_required()
def ai_generate_experience():
    data = request.get_json()
    if not data.get("role") or not data.get("company"):  # pragma: no cover
        return jsonify({"error": "role and company are required"}), 400

    description = generate_experience_description({
        "role": data.get("role"),
        "company": data.get("company"),
        "start_date": data.get("start_date", ""),
        "end_date": data.get("end_date", "Present")
    })
    return jsonify({"description": description}), 200

@ai_bp.route("/generate-project", methods=["POST"])
@jwt_required()
def ai_generate_project():
    data = request.get_json()
    if not data.get("title"):  # pragma: no cover
        return jsonify({"error": "title is required"}), 400

    description = generate_project_description({
        "title": data.get("title"),
        "tech_stack": data.get("tech_stack", "")
    })
    return jsonify({"description": description}), 200