# tests/admin_test.py
import uuid
from app.extensions import db
from app.models.user import User

# =========================================================
# HELPER: The VIP Backdoor Setup
# =========================================================
def setup_admin_and_user(client):
    # Use random emails so tests never crash into each other
    admin_email = f"admin_{uuid.uuid4()}@test.com"
    normal_email = f"normal_{uuid.uuid4()}@test.com"
    
    # 1. Register both users
    client.post("/api/auth/register", json={"name": "Admin", "email": "admin@test.com", "password": "pass"})
    client.post("/api/auth/register", json={"name": "Normal", "email": "normal@test.com", "password": "pass"})
    
    # 2. BACKDOOR: Force the first user to become an admin in the database
    with client.application.app_context():
        admin_user = User.query.filter_by(email="admin@test.com").first()
        admin_user.role = "admin"
        db.session.commit()
        
        admin_id = admin_user.id
        normal_id = User.query.filter_by(email="normal@test.com").first().id
        
    # 3. Login as the Admin to get the VIP Cookie
    client.post("/api/auth/login", json={"email": "admin@test.com", "password": "pass"})
    
    return admin_id, normal_id

# =========================================================
# 1. TEST STATS
# =========================================================
def test_admin_stats(client):
    setup_admin_and_user(client)
    response = client.get("/api/admin/stats")
    assert response.status_code == 200
    assert "total_users" in response.get_json()

# =========================================================
# 2. TEST LIST USERS & USER DETAIL
# =========================================================
def test_admin_users(client):
    _, normal_id = setup_admin_and_user(client)
    
    # Test List
    list_response = client.get("/api/admin/users")
    assert list_response.status_code == 200
    assert len(list_response.get_json()) >= 2
    
    # Test Detail
    detail_response = client.get(f"/api/admin/users/{normal_id}")
    assert detail_response.status_code == 200
    assert detail_response.get_json()["email"] == "normal@test.com"

# =========================================================
# 3. TEST CHANGE ROLE
# =========================================================
def test_admin_change_role(client):
    admin_id, normal_id = setup_admin_and_user(client)
    
    # Change normal user to admin
    response = client.put(f"/api/admin/users/{normal_id}/role", json={"role": "admin"})
    assert response.status_code == 200
    
    # Try changing own role (The Bouncer should block this with 400!)
    response_self = client.put(f"/api/admin/users/{admin_id}/role", json={"role": "user"})
    assert response_self.status_code == 400

# =========================================================
# 4. TEST DELETE USER
# =========================================================
def test_admin_delete_user(client):
    admin_id, normal_id = setup_admin_and_user(client)
    
    # Delete normal user
    response = client.delete(f"/api/admin/users/{normal_id}")
    assert response.status_code == 200
    
    # Try deleting self (The Bouncer should block this with 400!)
    response_self = client.delete(f"/api/admin/users/{admin_id}")
    assert response_self.status_code == 400

# =========================================================
# 5. TEST LIST & DELETE RESUMES
# =========================================================
def test_admin_resumes(client):
    admin_id, normal_id = setup_admin_and_user(client)
    
    # Login as normal user and create a resume
    client.post("/api/auth/login", json={"email": "normal@test.com", "password": "pass"})
    client.post("/api/resume/", json={"title": "Target Resume", "target_job": "Dev"})
    resumes = client.get("/api/resume/all").get_json()
    resume_id = resumes[0]["id"]
    
    # Login back as ADMIN
    client.post("/api/auth/login", json={"email": "admin@test.com", "password": "pass"})
    
    # Test List Resumes
    list_resp = client.get("/api/admin/resumes")
    assert list_resp.status_code == 200
    
    # Test Delete Resume
    del_resp = client.delete(f"/api/admin/resumes/{resume_id}")
    assert del_resp.status_code == 200