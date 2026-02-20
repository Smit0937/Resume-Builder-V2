from app.extensions import db


class Project(db.Model):
    __tablename__ = "projects"

    id = db.Column(db.Integer, primary_key=True)

    resume_id = db.Column(
        db.Integer,
        db.ForeignKey("resumes.id"),
        nullable=False
    )

    project_title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
