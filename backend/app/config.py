import os
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()

is_prod = bool(os.getenv("FLASK_ENV") == "production" or os.getenv("RENDER"))

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "supersecret")
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "jwtsecret")
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")

    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)
    JWT_COOKIE_SAMESITE = "Lax"
    JWT_TOKEN_LOCATION = ["cookies"]
    JWT_ACCESS_COOKIE_NAME = "access_token_cookie"
    JWT_COOKIE_SECURE = is_prod
    JWT_COOKIE_CSRF_PROTECT = False
      

    # Mail configuration
    MAIL_SERVER = os.getenv("MAIL_SERVER")
    MAIL_PORT = int(os.getenv("MAIL_PORT", 587))
    MAIL_USE_TLS = os.getenv("MAIL_USE_TLS", "True") == "True"
    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
    MAIL_DEFAULT_SENDER = os.getenv("MAIL_DEFAULT_SENDER")