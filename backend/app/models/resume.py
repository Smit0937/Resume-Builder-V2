from app.extensions import db
from datetime import datetime


class Resume(db.Model):
    __tablename__ = "resumes"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    title = db.Column(db.String(255), nullable=False)
    summary = db.Column(db.Text, nullable=True)

    # 🔥 ADD THESE
    full_name = db.Column(db.String(255))
    professional_title = db.Column(db.String(255))
    email = db.Column(db.String(255))
    phone = db.Column(db.String(50))
    location = db.Column(db.String(255))
    linkedin = db.Column(db.String(255))
    website = db.Column(db.String(255))
    nationality = db.Column(db.String(100))
    date_of_birth = db.Column(db.String(50))

    template_name = db.Column(db.String(50), default="corporate")

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)