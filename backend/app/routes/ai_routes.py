from datetime import date
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.resume import Resume
from app.services.ai_service import generate_summary, generate_experience_description, generate_project_description
import os
import json

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

###################AI ANALYZE RESUME#####################
@ai_bp.route("/analyze-resume", methods=["POST"])
@jwt_required()
def analyze_resume():
    try:
        data = request.get_json(silent=True)
        resume_text = data.get("resume_text", "").strip()
        if not resume_text:
            return jsonify({"error": "resume_text is required"}), 400

        prompt = f"""You are an expert ATS resume consultant. Analyze this resume and provide 5 specific, actionable improvements to increase the ATS score. Be concise and practical.

Resume:
{resume_text}

Respond ONLY in this exact JSON format with no extra text:
{{
  "improvements": [
    {{"title": "short title", "detail": "specific action to take", "impact": "high"}},
    {{"title": "short title", "detail": "specific action to take", "impact": "medium"}},
    {{"title": "short title", "detail": "specific action to take", "impact": "high"}},
    {{"title": "short title", "detail": "specific action to take", "impact": "low"}},
    {{"title": "short title", "detail": "specific action to take", "impact": "medium"}}
  ],
  "summary": "2-sentence overall assessment of this resume."
}}"""

        from groq import Groq
        client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=800,
            temperature=0.3,
        )
        text = completion.choices[0].message.content.strip()
        # Clean and parse JSON
        clean = text.replace("```json", "").replace("```", "").strip()
        result = json.loads(clean)
        return jsonify(result), 200

    except json.JSONDecodeError:
        return jsonify({
            "improvements": [{"title": "Analysis Complete", "detail": text, "impact": "medium"}],
            "summary": "AI analysis completed."
        }), 200
    except Exception as e:
        return jsonify({"error": f"AI analysis failed: {str(e)}"}), 500    