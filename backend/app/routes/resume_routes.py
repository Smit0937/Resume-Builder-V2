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
    """
    Create a new resume with template_name and template_style.
    
    Expected JSON body:
    {
        "title": "My Resume",
        "template_name": "simple" | "modern" | "creative",
        "template_style": "classic" | "harvard" | "atlantic_blue" | etc.
    }
    """
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        # Validate template name and map old names to new ones
        VALID_TEMPLATES = {'simple', 'modern', 'creative'}
        TEMPLATE_MAP = {
            # Old template names → new category names
            'obsidian': 'creative',
            'finance': 'simple',
            'corporate': 'simple',
            'annafield': 'simple',
            'harvard': 'simple',
            'atlantic': 'modern',
            'classic': 'simple',
            'sidebar': 'modern',
            'minimal': 'simple',
            'meghana': 'modern',
            'simplyblue': 'simple',
        }
        
        # Get template name from request, default to 'simple'
        template_name = data.get('template_name', 'simple')
        
        # Map old template names to new valid ones
        if template_name not in VALID_TEMPLATES:
            template_name = TEMPLATE_MAP.get(template_name, 'simple')
        
        # Get template style (specific variation like 'atlantic_blue', 'sidebar', etc.)
        template_style = data.get('template_style', None)
        
        print(f"✅ Creating resume with template_name: {template_name}, template_style: {template_style}")

        # Create new resume
        new_resume = Resume(
            user_id=int(user_id),
            title=data.get("title", "Untitled Resume"),
            summary=data.get("summary"),
            template_name=template_name,
            template_style=template_style  # ✅ Save the specific style
        )

        db.session.add(new_resume)
        db.session.commit()

        return jsonify({
            "message": "Resume created successfully",
            "resume_id": new_resume.id,
            "template_name": template_name,
            "template_style": template_style
        }), 201

    except Exception as e:
        db.session.rollback()
        print(f"❌ Error creating resume: {str(e)}")
        return jsonify({
            "error": "Failed to create resume",
            "details": str(e)
        }), 500


@resume_bp.route("/", methods=["GET"])
@resume_bp.route("/all", methods=["GET"])
@jwt_required()
def get_resumes():
    """
    Get all resumes for the current user.
    
    Returns:
    [
        {
            "id": 1,
            "title": "My Resume",
            "summary": "...",
            "template_name": "creative",
            "template_style": "atlantic_blue",
            "created_at": "2024-02-27T10:00:00",
            "updated_at": "2024-02-27T10:00:00"
        },
        ...
    ]
    """
    try:
        user_id = get_jwt_identity()
        resumes = Resume.query.filter_by(user_id=int(user_id)).all()

        return jsonify([
            {
                "id": r.id,
                "title": r.title,
                "summary": r.summary,
                "template_name": r.template_name,
                "template_style": r.template_style,  # ✅ Include template_style
                "created_at": r.created_at.isoformat() if r.created_at else None,
                "updated_at": r.updated_at.isoformat() if r.updated_at else None
            } for r in resumes
        ]), 200

    except Exception as e:
        print(f"❌ Error fetching resumes: {str(e)}")
        return jsonify({"error": str(e)}), 500


@resume_bp.route("/<int:resume_id>", methods=["GET"])
@jwt_required()
def get_resume(resume_id):
    """
    Get a specific resume by ID.
    
    Returns:
    {
        "id": 1,
        "title": "My Resume",
        "summary": "...",
        "full_name": "John Doe",
        "professional_title": "Software Engineer",
        "email": "john@example.com",
        "phone": "+1234567890",
        "location": "New York, NY",
        "linkedin": "linkedin.com/in/johndoe",
        "website": "johndoe.com",
        "nationality": "American",
        "date_of_birth": "1990-01-01",
        "template_name": "creative",
        "template_style": "atlantic_blue",
        "created_at": "2024-02-27T10:00:00",
        "updated_at": "2024-02-27T10:00:00"
    }
    """
    try:
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
            "template_name": resume.template_name,
            "template_style": resume.template_style,  # ✅ Include template_style
            "created_at": resume.created_at.isoformat() if resume.created_at else None,
            "updated_at": resume.updated_at.isoformat() if resume.updated_at else None
        }), 200

    except Exception as e:
        print(f"❌ Error fetching resume: {str(e)}")
        return jsonify({"error": str(e)}), 500


@resume_bp.route("/<int:resume_id>", methods=["PUT"])
@jwt_required()
def update_resume(resume_id):
    """
    Update a resume's details.
    
    Expected JSON body (all fields optional):
    {
        "title": "Updated Resume Title",
        "summary": "Updated summary...",
        "full_name": "John Doe",
        "professional_title": "Senior Software Engineer",
        "email": "john@example.com",
        "phone": "+1234567890",
        "location": "San Francisco, CA",
        "linkedin": "linkedin.com/in/johndoe",
        "website": "johndoe.com",
        "nationality": "American",
        "date_of_birth": "1990-01-01",
        "template_name": "modern",
        "template_style": "sidebar"
    }
    """
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()

        resume = Resume.query.filter_by(
            id=resume_id,
            user_id=user_id
        ).first()

        if not resume:
            return jsonify({"error": "Resume not found"}), 404

        # Update all fields if provided
        resume.title = data.get("title", resume.title)
        resume.summary = data.get("summary", resume.summary)
        resume.full_name = data.get("full_name", resume.full_name)
        resume.professional_title = data.get("professional_title", resume.professional_title)
        resume.email = data.get("email", resume.email)
        resume.phone = data.get("phone", resume.phone)
        resume.location = data.get("location", resume.location)
        resume.linkedin = data.get("linkedin", resume.linkedin)
        resume.website = data.get("website", resume.website)
        resume.nationality = data.get("nationality", resume.nationality)
        resume.date_of_birth = data.get("date_of_birth", resume.date_of_birth)
        resume.template_name = data.get("template_name", resume.template_name)
        resume.template_style = data.get("template_style", resume.template_style)  # ✅ Update template_style

        db.session.commit()

        return jsonify({
            "message": "Resume updated successfully",
            "resume": {
                "id": resume.id,
                "title": resume.title,
                "template_name": resume.template_name,
                "template_style": resume.template_style
            }
        }), 200

    except Exception as e:
        db.session.rollback()
        print(f"❌ Error updating resume: {str(e)}")
        return jsonify({"error": str(e)}), 500


@resume_bp.route("/<int:resume_id>", methods=["DELETE"])
@jwt_required()
def delete_resume(resume_id):
    """
    Delete a resume and all its associated data (experiences, education, skills, projects, certifications).
    """
    try:
        user_id = get_jwt_identity()

        resume = Resume.query.filter_by(
            id=resume_id,
            user_id=int(user_id)
        ).first()

        if not resume:
            return jsonify({"error": "Resume not found"}), 404

        # Delete associated data (if you have foreign key cascades set up, this might not be necessary)
        Experience.query.filter_by(resume_id=resume_id).delete()
        Education.query.filter_by(resume_id=resume_id).delete()
        Skill.query.filter_by(resume_id=resume_id).delete()
        Project.query.filter_by(resume_id=resume_id).delete()
        Certification.query.filter_by(resume_id=resume_id).delete()

        # Delete the resume
        db.session.delete(resume)
        db.session.commit()

        return jsonify({"message": "Resume deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        print(f"❌ Error deleting resume: {str(e)}")
        return jsonify({"error": str(e)}), 500


@resume_bp.route("/download/<int:resume_id>", methods=["GET"])
@jwt_required()
def download_resume(resume_id):
    """
    Download resume as PDF.
    
    The PDF will be generated using the template_name and template_style stored in the database.
    """
    try:
        user_id = get_jwt_identity()

        resume = Resume.query.filter_by(
            id=resume_id,
            user_id=int(user_id)
        ).first()

        if not resume:
            return jsonify({"error": "Resume not found"}), 404

        print(f"📄 Generating PDF for resume {resume_id} with template: {resume.template_name}, style: {resume.template_style}")

        # Generate PDF using the stored template_name
        pdf = generate_resume_pdf(resume_id)

        # Use resume title for filename, or default to "resume"
        filename = f"{resume.title.replace(' ', '_')}.pdf" if resume.title else "resume.pdf"

        return send_file(
            pdf,
            as_attachment=True,
            download_name=filename,
            mimetype="application/pdf"
        )

    except Exception as e:
        print(f"❌ Error generating PDF: {str(e)}")
        return jsonify({"error": f"Failed to generate PDF: {str(e)}"}), 500