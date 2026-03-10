import os
import pymysql
pymysql.install_as_MySQLdb()

from flask import Flask
from werkzeug.middleware.proxy_fix import ProxyFix
from .config import Config
from .extensions import db, jwt, bcrypt, mail
from flask_cors import CORS
from datetime import timedelta

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
    app.config['CORS_HEADERS'] = 'Content-Type'

    # Load configuration from Config class (includes JWT, DB, Mail settings)
    app.config.from_object(Config)

    # JWT Cookie Configuration
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "jwtsecret")
    app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
    app.config["JWT_COOKIE_CSRF_PROTECT"] = False
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=7)
    app.config["JWT_ACCESS_COOKIE_NAME"] = "access_token_cookie"

    # Production (HTTPS) vs Development (HTTP) cookie settings
    is_prod = os.getenv("FLASK_ENV") == "production" or os.getenv("RENDER")
    app.config["JWT_COOKIE_SECURE"] = is_prod
    app.config["JWT_COOKIE_SAMESITE"] = "None" if is_prod else "Lax"

    app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

    if test_config:
        app.config.update(test_config)

    # CORS: allow frontend origins with credentials
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
    CORS(
        app,
        supports_credentials=True,
        origins=[
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:5175",
            "http://127.0.0.1:5173",
            frontend_url,
        ]
    )
    # Initialize extensions
    jwt.init_app(app)
    db.init_app(app)
    bcrypt.init_app(app)
    mail.init_app(app)

    # Register Blueprints
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