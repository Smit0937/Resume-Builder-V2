# tests/nuke_test.py
import pytest
import uuid
from app.models.user import User
from app.models.resume import Resume
from app.models.project import Project

# =========================================================
# TARGET 1: Model Reprs (Lines missing in models)
# =========================================================
def test_model_reprs_nuke():
    p = Project(project_title="Test Project")
    r = Resume(title="Test Resume")
    assert repr(p) is not None
    assert repr(r) is not None

# =========================================================
# TARGET 2: Sister Routes GET 403 (Lines 53-55 in edu/skills)
# =========================================================
def test_sister_get_403_nuke(client):
    hacker = f"hacker_nuke_{uuid.uuid4()}@test.com"
    client.post("/api/auth/register", json={"name": "H", "email": hacker, "password": "p"})
    client.post("/api/auth/login", json={"email": hacker, "password": "p"})
    
    assert client.get("/api/education/99999").status_code == 403
    assert client.get("/api/skills/99999").status_code == 403
    assert client.get("/api/certifications/99999").status_code == 403