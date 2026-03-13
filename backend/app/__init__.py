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


def _is_production_env():
    return any([
        os.getenv("FLASK_ENV") == "production",
        os.getenv("RENDER"),
        os.getenv("RAILWAY_ENVIRONMENT"),
        os.getenv("RAILWAY_PUBLIC_DOMAIN"),
        os.getenv("RAILWAY_PROJECT_ID"),
    ])


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
    is_prod = _is_production_env()
    app.config["JWT_COOKIE_SECURE"] = is_prod  # ✅ Already correct
    app.config["JWT_COOKIE_SAMESITE"] = "None" if is_prod else "Lax"  # ✅ Already correct
    
    if test_config:
        app.config.update(test_config)

    # CORS: allow frontend origins with credentials
    frontend_url = os.getenv("FRONTEND_URL", "").rstrip("/")

    allowed_origins = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "https://resume-psi-drab-27.vercel.app",  # ✅ ADDED: Your Vercel URL
    ]

    if frontend_url:
        allowed_origins.append(frontend_url)

    CORS(
        app,
        resources={r"/api/*": {"origins": allowed_origins}},
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        expose_headers=["Set-Cookie"],  # ✅ ADDED: Allow Set-Cookie header
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

if __name__ == "__main__":  # pragma: no cover
    app = create_app()  # ✅ FIXED: Must call create_app() first
    app.run(debug=True)