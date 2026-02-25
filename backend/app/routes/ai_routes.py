from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.resume import Resume
from app.services.ai_service import generate_summary
from flask import current_app
ai_bp = Blueprint("ai", __name__)

@ai_bp.route("/generate-summary/<int:resume_id>", methods=["GET"])
@jwt_required()
def ai_generate_summary(resume_id):   
    user_id = get_jwt_identity()

    resume = Resume.query.filter_by(id=resume_id, user_id=int(user_id)).first()
    if not resume:
        return jsonify({"error": "Resume not found"}), 404

    summary = generate_summary({
        "full_name": resume.full_name or "",
        "professional_title": resume.professional_title or ""
    })
    print("GROQ KEY:", current_app.config.get("GROQ_API_KEY"))
    return jsonify({"ai_generated_summary": summary}), 200