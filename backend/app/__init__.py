from flask import Flask
from .config import Config
from .extensions import db, jwt, bcrypt, mail
from flask_cors import CORS
from datetime import timedelta
import os

# Import Blueprints
from .routes.auth_routes import auth
from .routes.resume_routes import resume_bp
from .routes.education_routes import education_bp
from .routes.experience_routes import experience_bp
from .routes.skills_routes import skill_bp
from .routes.project_routes import project_bp
from .routes.certification_routes import certification_bp
from .routes.ai_routes import ai_bp
from .routes.admin_routes import admin_bp


def create_app(test_config=None):
    app = Flask(__name__)

    # Load Configuration
    app.config.from_object(Config)
    
    # JWT Cookie Configuration
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "jwtsecret")
    app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
    app.config["JWT_COOKIE_CSRF_PROTECT"] = False
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=7)
    app.config["JWT_ACCESS_COOKIE_NAME"] = "access_token_cookie"

    # Production (HTTPS) vs Development (HTTP) cookie settings
    is_prod = os.getenv("FLASK_ENV") == "production" or os.getenv("RENDER")
    app.config["JWT_COOKIE_SECURE"] = is_prod       # True for HTTPS, False for HTTP
    app.config["JWT_COOKIE_SAMESITE"] = "None" if is_prod else "Lax"
    
    if test_config:
        app.config.update(test_config)

    # CORS: allow frontend origins with credentials
    frontend_url = os.getenv("FRONTEND_URL", "")
    allowed_origins = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
    ]
    if frontend_url:
        allowed_origins.append(frontend_url)

    CORS(
        app,
        resources={r"/api/*": {"origins": allowed_origins}},
        supports_credentials=True
    )

    # Initialize Extensions
    jwt.init_app(app)
    db.init_app(app)
    bcrypt.init_app(app)
    mail.init_app(app)

    # Register Blueprints with prefix
    app.register_blueprint(auth, url_prefix="/api/auth")
    app.register_blueprint(resume_bp, url_prefix="/api/resume")
    app.register_blueprint(education_bp, url_prefix="/api/education")
    app.register_blueprint(experience_bp, url_prefix="/api/experience")
    app.register_blueprint(skill_bp, url_prefix="/api/skills")
    app.register_blueprint(project_bp, url_prefix="/api/projects")
    app.register_blueprint(certification_bp, url_prefix="/api/certifications")
    app.register_blueprint(ai_bp, url_prefix="/api/ai")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")

    return app