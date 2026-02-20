from flask import Blueprint, request, jsonify
from app.extensions import db, bcrypt
from app.models.user import User
from flask_jwt_extended import create_access_token
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt


auth = Blueprint("auth", __name__)

@auth.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    # Validate input
    if not name or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    # Check if email already exists
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 400

    # Hash password
    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

    # Create user
    new_user = User(
        name=name,
        email=email,
        password=hashed_password
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201

@auth.route("/login", methods=["POST"])
def login():
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

    access_token = create_access_token(
    identity=str(user.id),   # MUST be string
    additional_claims={
        "email": user.email,
        "role": user.role
        }
    )

    return jsonify({
        "message": "Login successful",
        "access_token": access_token,
        "role": user.role
    }), 200

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
