from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.certification import Certification
from app.models.resume import Resume

certification_bp = Blueprint("certification", __name__)

@certification_bp.route("/", methods=["POST"])
@jwt_required()
def add_certification():
    user_id = get_jwt_identity()
    data = request.get_json()

    resume_id = data.get("resume_id")

    if not resume_id or not data.get("title"):
        return jsonify({"error": "resume_id and title are required"}), 400

    resume = Resume.query.filter_by(id=resume_id, user_id=int(user_id)).first()

    if not resume:
        return jsonify({"error": "Invalid resume"}), 403

    certification = Certification(
        resume_id=resume_id,
        title=data.get("title"),
        organization=data.get("organization"),
        issue_year=data.get("issue_year")
    )

    db.session.add(certification)
    db.session.commit()

    return jsonify({"message": "Certification added successfully"}), 201


@certification_bp.route("/<int:resume_id>", methods=["GET"])
@jwt_required()
def get_certifications(resume_id):
    user_id = get_jwt_identity()

    resume = Resume.query.filter_by(id=resume_id, user_id=int(user_id)).first()

    if not resume:
        return jsonify({"error": "Invalid resume"}), 403

    certifications = Certification.query.filter_by(resume_id=resume_id).all()

    return jsonify([
        {
            "id": c.id,
            "title": c.title,
            "organization": c.organization,
            "issue_year": c.issue_year
        } for c in certifications
    ]), 200


@certification_bp.route("/<int:cert_id>", methods=["PUT"])
@jwt_required()
def update_certification(cert_id):
    user_id = get_jwt_identity()
    data = request.get_json()

    cert = Certification.query.get(cert_id)

    if not cert:
        return jsonify({"error": "Certification not found"}), 404

    resume = Resume.query.filter_by(
        id=cert.resume_id,
        user_id=int(user_id)
    ).first()

    if not resume:
        return jsonify({"error": "Unauthorized"}), 403

    cert.title = data.get("title", cert.title)
    cert.organization = data.get("organization", cert.organization)
    cert.issue_year = data.get("issue_year", cert.issue_year)

    db.session.commit()

    return jsonify({"message": "Certification updated successfully"}), 200


@certification_bp.route("/<int:cert_id>", methods=["DELETE"])
@jwt_required()
def delete_certification(cert_id):
    user_id = get_jwt_identity()

    cert = Certification.query.get(cert_id)

    if not cert:
        return jsonify({"error": "Certification not found"}), 404

    resume = Resume.query.filter_by(
        id=cert.resume_id,
        user_id=int(user_id)
    ).first()

    if not resume:
        return jsonify({"error": "Unauthorized"}), 403

    db.session.delete(cert)
    db.session.commit()

    return jsonify({"message": "Certification deleted successfully"}), 200