from flask import Flask
from .config import Config
from .extensions import db, jwt, bcrypt
from flask_cors import CORS

# Import Blueprints
from .routes.auth_routes import auth
from .routes.resume_routes import resume_bp
from .routes.education_routes import education_bp
from .routes.experience_routes import experience_bp
from .routes.skills_routes import skill_bp
from .routes.project_routes import project_bp
from .routes.certification_routes import certification_bp
from .routes.ai_routes import ai_bp


def create_app():
    app = Flask(__name__)

    # Load Configuration
    app.config.from_object(Config)

    # Enable CORS for frontend (React running on port 5173 or 3000)
    CORS(
    app,
    resources={r"/api/*": {"origins": "http://localhost:5173"}},
    supports_credentials=True
    )

    # Initialize Extensions
    db.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)

    # Register Blueprints with prefix (VERY IMPORTANT)
    app.register_blueprint(auth, url_prefix="/api/auth")
    app.register_blueprint(resume_bp, url_prefix="/api/resume")
    app.register_blueprint(education_bp, url_prefix="/api/education")
    app.register_blueprint(experience_bp, url_prefix="/api/experience")
    app.register_blueprint(skill_bp, url_prefix="/api/skills")
    app.register_blueprint(project_bp, url_prefix="/api/projects")
    app.register_blueprint(certification_bp, url_prefix="/api/certifications")
    app.register_blueprint(ai_bp, url_prefix="/api/ai")

    return app
