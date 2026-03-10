# tests/auth_test.py
# Notice we don't need to import the app or db here anymore! 
# Pytest magically brings 'client' in from conftest.py.

# =========================================================
# 1. REGISTRATION TESTS
# =========================================================
def test_register_success(client):
    response = client.post("/api/auth/register", json={
        "name": "Test Robot", "email": "robot@example.com", "password": "pass"
    })
    assert response.status_code == 201

def test_register_missing_email(client):
    response = client.post("/api/auth/register", json={
        "name": "Test Robot", "password": "pass"
    })
    assert response.status_code == 400
    assert "All fields are required" in response.get_json()["error"]

def test_register_duplicate_email(client):
    client.post("/api/auth/register", json={
        "name": "Robot 1", "email": "clone@example.com", "password": "pass"
    })
    response = client.post("/api/auth/register", json={
        "name": "Robot 2", "email": "clone@example.com", "password": "pass"
    })
    assert response.status_code == 400
    assert "Email already exists" in response.get_json()["error"]


# =========================================================
# 2. LOGIN TESTS
# =========================================================
def test_login_success(client):
    client.post("/api/auth/register", json={
        "name": "Test Robot", "email": "robot@example.com", "password": "pass"
    })
    response = client.post("/api/auth/login", json={
        "email": "robot@example.com", "password": "pass"
    })
    assert response.status_code == 200
    assert "access_token_cookie" in response.headers.get("Set-Cookie", "")

def test_login_missing_password(client):
    response = client.post("/api/auth/login", json={"email": "robot@example.com"})
    assert response.status_code == 400

def test_login_wrong_password(client):
    client.post("/api/auth/register", json={
        "name": "Test", "email": "robot@example.com", "password": "pass"
    })
    response = client.post("/api/auth/login", json={
        "email": "robot@example.com", "password": "WRONG_PASSWORD!"
    })
    assert response.status_code == 401

def test_login_nonexistent_user(client):
    response = client.post("/api/auth/login", json={
        "email": "ghost@example.com", "password": "pass"
    })
    assert response.status_code == 401


# =========================================================
# 3. LOGOUT & PROTECTION TESTS
# =========================================================
def test_logout(client):
    client.post("/api/auth/register", json={
        "name": "Test", "email": "test@example.com", "password": "pass"
    })
    client.post("/api/auth/login", json={
        "email": "test@example.com", "password": "pass"
    })
    response = client.post("/api/auth/logout")
    assert response.status_code == 200
    # Check if the cookie was destroyed (Flask sets expiry to 1970)
    assert "Max-Age=0" in response.headers.get("Set-Cookie", "")

def test_profile_needs_token(client):
    response = client.get("/api/auth/profile")
    assert response.status_code == 401