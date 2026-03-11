# tests/certification_test.py

def setup_dummy_with_resume(client):
    client.post("/api/auth/register", json={"name": "Cert", "email": "cert@example.com", "password": "pass"})
    client.post("/api/auth/login", json={"email": "cert@example.com", "password": "pass"})
    client.post("/api/resume/", json={"title": "My Resume", "target_job": "Dev"})
    return client.get("/api/resume/all").get_json()[0]["id"]

# =========================================================
# 1. CREATE CERTIFICATION
# =========================================================
def test_add_certification(client):
    resume_id = setup_dummy_with_resume(client)
    
    # ACT: Using frontend terms (name, issuer, issue_date)
    response = client.post("/api/certifications/", json={
        "resume_id": resume_id,
        "name": "AWS Certified Solutions Architect", 
        "issuer": "Amazon Web Services",
        "issue_date": "2023"
    })
    
    assert response.status_code == 201

# =========================================================
# 2. READ CERTIFICATION
# =========================================================
def test_get_certifications(client):
    resume_id = setup_dummy_with_resume(client)
    
    client.post("/api/certifications/", json={
        "resume_id": resume_id,
        "name": "AWS Certified Solutions Architect", 
        "issuer": "Amazon Web Services",
        "issue_date": "2023"
    })
    
    response = client.get(f"/api/certifications/{resume_id}")
    assert response.status_code == 200
    assert len(response.get_json()) == 1
    
    # The GET route returns "name"
    assert response.get_json()[0]["name"] == "AWS Certified Solutions Architect"

# =========================================================
# 3. UPDATE CERTIFICATION
# =========================================================
def test_update_certification(client):
    resume_id = setup_dummy_with_resume(client)
    
    client.post("/api/certifications/", json={
        "resume_id": resume_id,
        "name": "Old Cert",
        "issuer": "Old Issuer",
        "issue_date": "2020"
    })
    
    # Get the cert ID
    cert_id = client.get(f"/api/certifications/{resume_id}").get_json()[0]["id"]
    
    # ACT: Update it
    response = client.put(f"/api/certifications/{cert_id}", json={
        "name": "New Awesome Cert",
        "issuer": "New Issuer"
    })
    assert response.status_code == 200

# =========================================================
# 4. DELETE CERTIFICATION
# =========================================================
def test_delete_certification(client):
    resume_id = setup_dummy_with_resume(client)
    
    client.post("/api/certifications/", json={
        "resume_id": resume_id,
        "name": "Delete Me",
        "issuer": "Nobody",
        "issue_date": "2020"
    })
    
    # Get the cert ID
    cert_id = client.get(f"/api/certifications/{resume_id}").get_json()[0]["id"]
    
    # ACT: Delete it
    response = client.delete(f"/api/certifications/{cert_id}")
    assert response.status_code == 200