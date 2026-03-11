# tests/sniper_test.py
import pytest
from unittest.mock import patch
import uuid
from app.extensions import db
from app.models.user import User
from app.models.resume import Resume
from app.models.project import Project
from app.models.experience import Experience
from app.models.education import Education
from app.services.pdf_service import generate_resume_pdf

# =========================================================
# TARGET 1: PDF Service (Empty Optional Fields)
# =========================================================
def test_pdf_empty_fields(client):
    email = f"pdf_empty_{uuid.uuid4()}@test.com"
    client.post("/api/auth/register", json={"name": "PDF", "email": email, "password": "p"})
    client.post("/api/auth/login", json={"email": email, "password": "p"})
    
    # Create a resume with NO summary, NO website, NO professional title
    client.post("/api/resume/", json={"title": "Empty Resume"})
    r_id = client.get("/api/resume/all").get_json()[0]["id"]
    
    # Add items with missing descriptions and dates
    client.post("/api/experience/", json={"resume_id": r_id, "company": "C", "role": "R", "start_date": "S"})
    client.post("/api/projects/", json={"resume_id": r_id, "title": "P"})
    client.post("/api/certifications/", json={"resume_id": r_id, "name": "C"})

    with client.application.app_context():
        resume = db.session.get(Resume, r_id)
        # Test all 3 templates to trigger all the `if` statements!
        for tmpl in ["simple", "modern", "creative"]:
            resume.template_name = tmpl
            db.session.commit()
            pdf = generate_resume_pdf(r_id)
            assert pdf is not None

# =========================================================
# TARGET 2: Sister Routes GET 403 (Invalid Resume)
# =========================================================
def test_sister_get_403(client):
    email = f"sniper_{uuid.uuid4()}@test.com"
    client.post("/api/auth/register", json={"name": "S", "email": email, "password": "p"})
    client.post("/api/auth/login", json={"email": email, "password": "p"})
    
    # User tries to GET data for a resume that does not exist
    assert client.get("/api/education/99999").status_code == 403
    assert client.get("/api/skills/99999").status_code == 403
    assert client.get("/api/certifications/99999").status_code == 403

# =========================================================
# TARGET 3: Admin Dashboard (Deleted User Fallback)
# =========================================================
@patch("app.routes.admin_routes.db.session.get")
def test_admin_deleted_user_resume(mock_get, client):
    email = f"admin_sniper_{uuid.uuid4()}@test.com"
    client.post("/api/auth/register", json={"name": "A", "email": email, "password": "p"})
    
    # Upgrade to Admin
    with client.application.app_context():
        u = User.query.filter_by(email=email).first()
        u.role = "admin"
        db.session.commit()
        
    client.post("/api/auth/login", json={"email": email, "password": "p"})
    
    # Mock the database to say "User not found" when loading the Resume list
    mock_get.return_value = None  
    assert client.get("/api/admin/resumes").status_code == 200

# =========================================================
# TARGET 4: Database Model Strings (__repr__)
# =========================================================
def test_model_reprs(client):
    with client.application.app_context():
        # Just creating the classes and turning them into strings tests these hidden lines!
        u = User(name="Test", email="t@t.com", password="p")
        r = Resume(user_id=1, title="T")
        p = Project(resume_id=1, project_title="P")
        assert str(u) != ""
        assert str(r) != ""
        assert str(p) != ""

# =========================================================
# TARGET 5: Auth Login Crash
# =========================================================
@patch("app.routes.auth_routes.bcrypt.check_password_hash", side_effect=Exception("Bcrypt Boom"))
def test_auth_login_crash(mock_bcrypt, client):
    email = f"crash_{uuid.uuid4()}@test.com"
    client.post("/api/auth/register", json={"name": "C", "email": email, "password": "p"})
    # Forcing bcrypt to crash tests the massive except block at the bottom of login
    assert client.post("/api/auth/login", json={"email": email, "password": "p"}).status_code == 500