# tests/experience_test.py

def setup_dummy_with_resume(client):
    client.post("/api/auth/register", json={"name": "Exp", "email": "exp@example.com", "password": "pass"})
    client.post("/api/auth/login", json={"email": "exp@example.com", "password": "pass"})
    client.post("/api/resume/", json={"title": "My Resume", "target_job": "Dev"})
    return client.get("/api/resume/all").get_json()[0]["id"]

# =========================================================
# 1. CREATE EXPERIENCE (POST /)
# =========================================================
def test_add_experience(client):
    resume_id = setup_dummy_with_resume(client)
    
    response = client.post("/api/experience/", json={
        "resume_id": resume_id,
        "company": "Tech Innovations Inc.",
        "role": "Backend Developer", 
        "description": "Built scalable APIs using Flask.",
        "start_date": "Jan 2021",
        "end_date": "Present"
    })
    assert response.status_code == 201

# =========================================================
# 2. READ EXPERIENCE (GET /<resume_id>)
# =========================================================
def test_get_experience(client):
    resume_id = setup_dummy_with_resume(client)
    
    # First, add the experience
    client.post("/api/experience/", json={
        "resume_id": resume_id,
        "company": "Tech Innovations Inc.",
        "role": "Backend Developer",
        "start_date": "Jan 2021",
        "end_date": "Present"
    })
    
    # ACT: Fetch all experience for this resume
    response = client.get(f"/api/experience/{resume_id}")
    assert response.status_code == 200
    assert len(response.get_json()) == 1
    assert response.get_json()[0]["company"] == "Tech Innovations Inc."

# =========================================================
# 3. UPDATE EXPERIENCE (PUT /<experience_id>)
# =========================================================
def test_update_experience(client):
    resume_id = setup_dummy_with_resume(client)
    
    # Add an experience
    client.post("/api/experience/", json={
        "resume_id": resume_id,
        "company": "Old Company",
        "role": "Junior Dev",
        "start_date": "2020",
        "end_date": "2021"
    })
    
    # Fetch the list to find the Experience ID
    exp_list = client.get(f"/api/experience/{resume_id}").get_json()
    exp_id = exp_list[0]["id"]
    
    # ACT: Update that specific experience ID
    response = client.put(f"/api/experience/{exp_id}", json={
        "company": "New Awesome Startup",
        "role": "Senior Developer"
    })
    assert response.status_code == 200

# =========================================================
# 4. DELETE EXPERIENCE (DELETE /<experience_id>)
# =========================================================
def test_delete_experience(client):
    resume_id = setup_dummy_with_resume(client)
    
    # Add an experience
    client.post("/api/experience/", json={
        "resume_id": resume_id,
        "company": "Company To Delete",
        "role": "Intern",
        "start_date": "2020",
        "end_date": "2021"
    })
    
    # Fetch the list to find the Experience ID
    exp_list = client.get(f"/api/experience/{resume_id}").get_json()
    exp_id = exp_list[0]["id"]
    
    # ACT: Delete it!
    response = client.delete(f"/api/experience/{exp_id}")
    assert response.status_code == 200