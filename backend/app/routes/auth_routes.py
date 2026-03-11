from flask import Blueprint, request, jsonify, make_response
from app.extensions import db, bcrypt, mail
from app.models.user import User
from flask_mail import Message
import secrets
import os
from datetime import datetime, timedelta
from flask_jwt_extended import (
    create_access_token, 
    jwt_required, 
    get_jwt_identity, 
    get_jwt,
    unset_jwt_cookies
)

auth = Blueprint("auth", __name__)

# Dynamic cookie settings based on environment
_is_prod = bool(os.getenv("FLASK_ENV") == "production" or os.getenv("RENDER"))
COOKIE_SECURE = _is_prod
COOKIE_SAMESITE = "Lax"


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
        return jsonify({"error": "All fields are required"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

    new_user = User(
        name=name,
        email=email,
        password=hashed_password
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201


# -------------------------------
# Login
# -------------------------------
@auth.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        user = User.query.filter_by(email=email).first()

        if not user:
            return jsonify({"error": "Invalid credentials"}), 401

        if not bcrypt.check_password_hash(user.password, password):
            return jsonify({"error": "Invalid credentials"}), 401

        # Create JWT token
        access_token = create_access_token(
            identity=str(user.id),
            additional_claims={
                "email": user.email,
                "role": user.role
            },
            expires_delta=timedelta(days=7)
        )

        # ✅ IMPORTANT: Use make_response to create response object
        response = make_response(jsonify({
            "message": "Login successful",
            "email": user.email,
            "role": user.role,
            "user_id": user.id
        }), 200)

        # Set the cookie
        response.set_cookie(
            'access_token_cookie',
            value=access_token,
            max_age=7*24*60*60,
            httponly=True,
            secure=COOKIE_SECURE,
            samesite=COOKIE_SAMESITE,
            path='/'
        )

        print(f"✅ Login successful for {email}")
        
        return response

    except Exception as e:
        print(f"❌ Login error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": "Login failed"}), 500
    
#########################Logout Route#########################
@auth.route("/logout", methods=["POST"])
def logout():
    """
    Logout user by clearing the JWT cookie
    """
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
        
        print("✅ User logged out, cookie cleared")
        return response

    except Exception as e:
        print(f"❌ Logout error: {str(e)}")
        return jsonify({"error": "Logout failed"}), 500    


################### Check Auth ####################
@auth.route("/check-auth", methods=["GET"])
@jwt_required()  # 🔒 This checks the cookie automatically!
def check_auth():
    """
    Am I logged in? YES or NO
    Like security guard checking your wristband
    """
    try:
        user_id = get_jwt_identity()  # Read the wristband
        
        # If we got here, wristband is valid!
        return jsonify({
            "authenticated": True,  # ✅ YES, you're allowed!
            "message": "You are logged in"
        }), 200
        
    except:
        # No wristband or expired wristband
        return jsonify({
            "authenticated": False  # ❌ NO, get a ticket!
        }), 401

################Get Current User Info#####################
@auth.route("/me", methods=["GET"])
@jwt_required()
def get_current_user():
    try:
        user_id = get_jwt_identity()
        print(f"✅ /me route - user_id from JWT: {user_id}")
        
        user = db.session.get(User, int(user_id))
        
        if not user:
            print(f"❌ User {user_id} not found in database")
            return jsonify({"error": "User not found"}), 404
        
        print(f"✅ Returning user: {user.email}")
        
        # ✅ FIXED: Only return fields that exist in your User model
        return jsonify({
            "id": user.id,
            "email": user.email,
            "role": user.role
            # ❌ REMOVED: "full_name" - doesn't exist in your model
        }), 200
        
    except Exception as e:
        print(f"❌ /me error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": "Not logged in"}), 401      



# -------------------------------
# Profile
# -------------------------------
@auth.route("/profile", methods=["GET"])
@jwt_required()
def profile():
    user_id = get_jwt_identity()
    claims = get_jwt()

    return jsonify({
        "id": user_id,
        "email": claims["email"],
        "role": claims["role"]
    })


# -------------------------------
# Admin Test
# -------------------------------
@auth.route("/admin-test", methods=["GET"])
@jwt_required()
def admin_test():
    claims = get_jwt()

    if claims["role"] != "admin":
        return jsonify({"error": "Admin access required"}), 403

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

    reset_link = f"http://localhost:5173/reset-password/{token}"

    msg = Message(
        subject="Reset Your ResumeAI Password",
        recipients=[email],
        body=f"""
Click the link below to reset your password:

{reset_link}

This link will expire in 15 minutes.
"""
    )

    try:
        mail.send(msg)
        print("EMAIL SENT SUCCESSFULLY")

    except Exception as e:
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

    hashed_password = bcrypt.generate_password_hash(new_password).decode("utf-8")

    user.password = hashed_password
    user.reset_token = None
    user.reset_token_expiry = None

    db.session.commit()

    return jsonify({"message": "Password reset successful"}), 200