from app.extensions import db
from datetime import datetime


class Experience(db.Model):
    __tablename__ = "experience"

    id = db.Column(db.Integer, primary_key=True)

    resume_id = db.Column(
        db.Integer,
        db.ForeignKey("resumes.id"),
        nullable=False
    )

    company = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)

    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=True)

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )
