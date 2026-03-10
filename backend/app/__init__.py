from flask import Flask
from .config import Config
from .extensions import db, jwt, bcrypt, mail
from flask_cors import CORS
from datetime import timedelta  # ✅ ADDED: For token expiry

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
    

    # ✅ ADDED: JWT Cookie Configuration (5 lines)
    app.config["JWT_SECRET_KEY"] = "jwtsecret"  
    app.config["JWT_TOKEN_LOCATION"] = ["cookies"]           # Look for JWT in cookies
    app.config["JWT_COOKIE_SECURE"] = False                  # Set True in production with HTTPS
    app.config["JWT_COOKIE_CSRF_PROTECT"] = False            # Disable CSRF for now (can enable later)
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=7)  # Token expires in 7 days
    app.config["JWT_COOKIE_SAMESITE"] = "Lax"   
    app.config["JWT_ACCESS_COOKIE_NAME"] = "access_token_cookie"            # CSRF protection
    
    if test_config:
        app.config.update(test_config)
    # Enable CORS for frontend (React running on port 5173 or 3000)
    # ✅ KEEP supports_credentials=True (already correct!)
    CORS(
        app,
        resources={r"/api/*": {"origins": "*"}},
        supports_credentials=True  # ✅ This allows cookies to be sent/received
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