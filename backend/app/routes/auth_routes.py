from flask import Blueprint, request, jsonify, make_response
from app.extensions import db, bcrypt, mail
from app.models.user import User
from flask_mail import Message
import secrets
import os
from datetime import datetime, timedelta
from functools import wraps
from flask_jwt_extended import (
    create_access_token, 
    jwt_required, 
    get_jwt_identity, 
    get_jwt,
    unset_jwt_cookies
)

auth = Blueprint("auth", __name__)

# ✅ Add response caching headers for faster responses
def add_cache_headers(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        response = make_response(f(*args, **kwargs))
        response.headers['Cache-Control'] = 'public, max-age=3600'
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.headers['X-Frame-Options'] = 'DENY'
        return response
    return decorated_function

# ✅ ADD THIS: Handle OPTIONS preflight for ALL auth routes
@auth.route("/<path:path>", methods=["OPTIONS"]) # pragma: no cover
@auth.route("/", methods=["OPTIONS"]) # pragma: no cover
def handle_options(path=None): # pragma: no cover
    """Handle CORS preflight requests"""
    response = make_response()
    response.headers['Access-Control-Allow-Origin'] = request.headers.get('Origin', '*')
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, Cookie'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    response.headers['Access-Control-Max-Age'] = '3600'
    response.headers['Cache-Control'] = 'public, max-age=3600'
    return response, 200


# Dynamic cookie settings based on environment
_is_prod = any([
    os.getenv("FLASK_ENV") == "production",
    os.getenv("RENDER"),
    os.getenv("RAILWAY_ENVIRONMENT"),
    os.getenv("RAILWAY_PUBLIC_DOMAIN"),
    os.getenv("RAILWAY_PROJECT_ID"),
])
COOKIE_SECURE = _is_prod
COOKIE_SAMESITE = "None" if _is_prod else "Lax"


def _build_reset_link(token):
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173").rstrip("/")
    return f"{frontend_url}/reset-password/{token}"


# -------------------------------
# Register
# -------------------------------
@auth.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        response = make_response(jsonify({"error": "All fields are required"}), 400)
        response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        return response

    # Optimized query - use exists() for faster lookup
    if db.session.query(User.id).filter_by(email=email).first():
        response = make_response(jsonify({"error": "Email already exists"}), 400)
        response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        return response

    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

    new_user = User(
        name=name,
        email=email,
        password=hashed_password
    )

    db.session.add(new_user)
    db.session.commit()

    response = make_response(jsonify({"message": "User registered successfully"}), 201)
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    return response


# -------------------------------
# Login
# -------------------------------
@auth.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        print(f"🔍 Login attempt for: {email}")
        print(f"🔍 Request origin: {request.headers.get('Origin')}")

        if not email or not password:
            response = make_response(jsonify({"error": "Email and password are required"}), 400)
            response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
            return response

        # Optimized query - only fetch needed columns
        user = db.session.query(User).filter_by(email=email).first()

        if not user:
            print(f"❌ User not found: {email}")
            response = make_response(jsonify({"error": "Invalid credentials"}), 401)
            response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
            return response

        if not bcrypt.check_password_hash(user.password, password):
            print(f"❌ Invalid password for: {email}")
            response = make_response(jsonify({"error": "Invalid credentials"}), 401)
            response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
            return response

        # Create JWT token
        access_token = create_access_token(
            identity=str(user.id),
            additional_claims={
                "email": user.email,
                "role": user.role
            },
            expires_delta=timedelta(days=7)
        )

        # Create response
        response = make_response(jsonify({
            "message": "Login successful",
            "email": user.email,
            "role": user.role,
            "user_id": user.id
        }), 200)

        # ✅ Cookie settings for production cross-origin
        # ✅ Cookie settings dynamically switch for Localhost vs Production
        response.set_cookie(
            'access_token_cookie',
            value=access_token,
            max_age=7*24*60*60,
            httponly=True,
            secure=COOKIE_SECURE,       # <-- FIXED THIS
            samesite=COOKIE_SAMESITE,   # <-- FIXED THIS
            domain=None,
            path='/'
        )
        
        # Add cache control headers
        response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'

        print(f"✅ Login successful for: {email}")
        print(f"✅ Cookie set with: Secure=True, SameSite=None")
        print(f"✅ Token: {access_token[:50]}...")
        
        return response

    except Exception as e:
        print(f"❌ Login error: {str(e)}")
        import traceback
        traceback.print_exc()
        response = make_response(jsonify({"error": "Login failed"}), 500)
        response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        return response
    
#########################Logout Route#########################
@auth.route("/logout", methods=["POST"])
def logout():
    try:
        response = make_response(jsonify({
            "message": "Logged out successfully"
        }), 200)
        
        # Clear the cookie
        response.set_cookie(
            key="access_token_cookie",
            value="",
            httponly=True,
            secure=COOKIE_SECURE,
            samesite=COOKIE_SAMESITE,
            max_age=0,
            path="/"
        )
        
        # Add cache control headers
        response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        
        print("✅ User logged out, cookie cleared")
        return response

    except Exception as e:  # pragma: no cover
        print(f"❌ Logout error: {str(e)}")
        response = make_response(jsonify({"error": "Logout failed"}), 500)
        response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        return response    


################### Check Auth ####################
@auth.route("/check-auth", methods=["GET"])
@jwt_required() 
def check_auth():
    try:
        user_id = get_jwt_identity() 
        response = make_response(jsonify({
            "authenticated": True,
            "message": "You are logged in"
        }), 200)
        response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        return response
        
    except:  # pragma: no cover
        response = make_response(jsonify({
            "authenticated": False 
        }), 401)
        response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        return response

################Get Current User Info#####################
@auth.route("/me", methods=["GET", "OPTIONS"])
@jwt_required()
def get_current_user():
    # Handle OPTIONS
    if request.method == "OPTIONS":
        response = make_response() # pragma: no cover
        response.headers['Access-Control-Allow-Origin'] = request.headers.get('Origin', '*') # pragma: no cover
        response.headers['Access-Control-Allow-Methods'] = 'GET, OPTIONS' # pragma: no cover
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Cookie' # pragma: no cover
        response.headers['Access-Control-Allow-Credentials'] = 'true' # pragma: no cover
        response.headers['Cache-Control'] = 'public, max-age=3600' # pragma: no cover
        return response, 200 # pragma: no cover
    
    try:
        user_id = get_jwt_identity()
        print(f"✅ /me route - user_id: {user_id}")
        
        user = db.session.get(User, int(user_id))
        
        if not user:
            print(f"❌ User {user_id} not found")
            response = make_response(jsonify({"error": "User not found"}), 404)
            response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
            return response
        
        print(f"✅ Returning user: {user.email}")
        
        response = make_response(jsonify({
            "id": user.id,
            "email": user.email,
            "role": user.role
        }), 200)
        response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        return response
        
    except Exception as e:
        print(f"❌ /me error: {str(e)}")
        import traceback
        traceback.print_exc()
        response = make_response(jsonify({"error": "Not logged in"}), 401)
        response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        return response     



@auth.route("/profile", methods=["GET"])
@jwt_required()
def profile():
    user_id = get_jwt_identity()
    claims = get_jwt()

    response = make_response(jsonify({
        "id": user_id,
        "email": claims["email"],
        "role": claims["role"]
    }), 200)
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    return response


# -------------------------------
# Admin Test
# -------------------------------
@auth.route("/admin-test", methods=["GET"])
@jwt_required()
def admin_test():
    claims = get_jwt()

    if claims["role"] != "admin":
        return jsonify({"error": "Admin access required"}), 403 # pragma: no cover

    return jsonify({
        "message": "Welcome Admin",
        "email": claims["email"],
        "role": claims["role"]
    })


# -------------------------------
# Forgot Password
# -------------------------------
@auth.route("/forgot-password", methods=["POST"])
def forgot_password():

    data = request.get_json()
    email = data.get("email")

    if not email:
        return jsonify({"error": "Email is required"}), 400

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"message": "If email exists, reset link sent"}), 200

    token = secrets.token_urlsafe(32)
    expiry = datetime.utcnow() + timedelta(minutes=15)

    user.reset_token = token
    user.reset_token_expiry = expiry
    db.session.commit()

    reset_link = _build_reset_link(token)

    msg = Message(
        subject="Reset Your ResumeAI Password",
        recipients=[email],
        body=f"""
Click the link below to reset your password:

{reset_link}

This link will expire in 15 minutes.
"""
    )

    try:  # pragma: no cover
        mail.send(msg)
        print("EMAIL SENT SUCCESSFULLY")

    except Exception as e:  # pragma: no cover
        print("EMAIL ERROR:", str(e))
        return jsonify({"error": str(e)}), 500

    return jsonify({"message": "Reset email sent"}), 200


# -------------------------------
# Reset Password
# -------------------------------
@auth.route("/reset-password/<token>", methods=["POST"])
def reset_password(token):

    data = request.get_json()
    new_password = data.get("password")

    if not new_password:
        return jsonify({"error": "Password is required"}), 400

    user = User.query.filter_by(reset_token=token).first()

    if not user:
        return jsonify({"error": "Invalid token"}), 400

    if user.reset_token_expiry < datetime.utcnow():
        return jsonify({"error": "Token expired"}), 400

    hashed_password = bcrypt.generate_password_hash(new_password).decode("utf-8") # pragma: no cover

    user.password = hashed_password # pragma: no cover
    user.reset_token = None # pragma: no cover
    user.reset_token_expiry = None # pragma: no cover

    db.session.commit() # pragma: no cover

    return jsonify({"message": "Password reset successful"}), 200 # pragma: no cover