# tests/auth_test.py
from unittest.mock import patch
from app.extensions import db
from app.models.user import User
from datetime import datetime, timedelta
import secrets

# =========================================================
# 1. BASIC AUTH (Register, Login, Logout)
# =========================================================
def test_register_and_login(client):
    # Test Register
    reg_res = client.post("/api/auth/register", json={
        "name": "Test User", "email": "test@test.com", "password": "pass"
    })
    assert reg_res.status_code == 201
    
    # Test Duplicate Email (Coverage line 36)
    reg_dup = client.post("/api/auth/register", json={
        "name": "Test User", "email": "test@test.com", "password": "pass"
    })
    assert reg_dup.status_code == 400
    
    # Test Login
    log_res = client.post("/api/auth/login", json={"email": "test@test.com", "password": "pass"})
    assert log_res.status_code == 200
    
    # Test Logout
    out_res = client.post("/api/auth/logout")
    assert out_res.status_code == 200

# =========================================================
# 2. CHECK-AUTH, ME, AND PROFILE
# =========================================================
def test_user_info_routes(client):
    # Create user & login
    client.post("/api/auth/register", json={"name": "Info User", "email": "info@test.com", "password": "pass"})
    client.post("/api/auth/login", json={"email": "info@test.com", "password": "pass"})
    
    # Check Auth (Coverage line 125)
    auth_res = client.get("/api/auth/check-auth")
    assert auth_res.status_code == 200
    
    # Get Me (Coverage line 140)
    me_res = client.get("/api/auth/me")
    assert me_res.status_code == 200
    assert me_res.get_json()["email"] == "info@test.com"
    
    # Get Profile (Coverage line 165)
    prof_res = client.get("/api/auth/profile")
    assert prof_res.status_code == 200

def test_unauthenticated_routes(client):
    # Test routes WITHOUT logging in (Coverage lines 137, 161)
    assert client.get("/api/auth/check-auth").status_code == 401
    assert client.get("/api/auth/me").status_code == 401

# =========================================================
# 3. ADMIN TEST ROUTE
# =========================================================
def test_admin_test_route(client):
    # Login as normal user
    client.post("/api/auth/register", json={"name": "Norm", "email": "norm@test.com", "password": "pass"})
    client.post("/api/auth/login", json={"email": "norm@test.com", "password": "pass"})
    
    # Try to access admin route (Coverage line 185)
    admin_res = client.get("/api/auth/admin-test")
    assert admin_res.status_code == 403  # Forbidden!

# =========================================================
# 4. FORGOT & RESET PASSWORD
# =========================================================
@patch("app.routes.auth_routes.mail.send")
def test_forgot_password(mock_mail_send, client):
    # Mock the email sender so it doesn't crash!
    mock_mail_send.return_value = True 
    
    client.post("/api/auth/register", json={"name": "Forgot", "email": "forgot@test.com", "password": "pass"})
    
    # Request reset link
    res = client.post("/api/auth/forgot-password", json={"email": "forgot@test.com"})
    assert res.status_code == 200

def test_reset_password(client):
    # 1. Register a user
    client.post("/api/auth/register", json={"name": "Reset", "email": "reset@test.com", "password": "pass"})
    
    # 2. Backdoor into the DB to manually create a fake reset token
    fake_token = "super_secret_fake_token"
    with client.application.app_context():
        user = User.query.filter_by(email="reset@test.com").first()
        user.reset_token = fake_token
        user.reset_token_expiry = datetime.utcnow() + timedelta(minutes=15)
        db.session.commit()
        
    # 3. Try to reset the password using the fake token!
    res = client.post(f"/api/auth/reset-password/{fake_token}", json={"password": "new_password"})
    assert res.status_code == 200
    
    # 4. Verify we can login with the NEW password!
    log_res = client.post("/api/auth/login", json={"email": "reset@test.com", "password": "new_password"})
    assert log_res.status_code == 200