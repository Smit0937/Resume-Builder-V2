# tests/education_test.py

# =========================================================
# HELPER: The Chain Reaction Setup
# =========================================================
def setup_dummy_with_resume(client):
    client.post("/api/auth/register", json={"name": "Edu", "email": "edu@example.com", "password": "pass"})
    client.post("/api/auth/login", json={"email": "edu@example.com", "password": "pass"})
    client.post("/api/resume/", json={"title": "My Resume", "target_job": "Dev"})
    
    resumes = client.get("/api/resume/all").get_json()
    return resumes[0]["id"]


# =========================================================
# 1. CREATE EDUCATION (POST /)
# =========================================================
def test_add_education(client):
    resume_id = setup_dummy_with_resume(client)

    # ACT: Use your EXACT database columns!
    response = client.post("/api/education/", json={
        "resume_id": resume_id,
        "education_level": "Graduate",
        "degree": "B.Tech Computer Science",
        "institution": "Tech Institute",
        "board_university": "Gujarat University",
        "percentage": 85.5,
        "start_year": 2020,
        "end_year": 2024,
        "score": "8.5 CGPA"
    })

    assert response.status_code == 201


# =========================================================
# 2. READ EDUCATION (GET /<resume_id>)
# =========================================================
def test_get_education(client):
    resume_id = setup_dummy_with_resume(client)

    # First, add the education
    client.post("/api/education/", json={
        "resume_id": resume_id,
        "education_level": "Graduate",
        "degree": "B.Tech Computer Science",
        "institution": "Tech Institute",
        "start_year": 2020,
        "end_year": 2024
    })

    # ACT: Fetch all education for this resume
    response = client.get(f"/api/education/{resume_id}")

    assert response.status_code == 200
    edu_list = response.get_json()
    assert len(edu_list) == 1
    # Check if our institution saved correctly
    assert edu_list[0]["institution"] == "Tech Institute"


# =========================================================
# 3. UPDATE EDUCATION (PUT /<edu_id>)
# =========================================================
def test_update_education(client):
    resume_id = setup_dummy_with_resume(client)

    # Add education (FIXED: Added the missing required fields!)
    client.post("/api/education/", json={
        "resume_id": resume_id,
        "education_level": "Graduate",
        "degree": "Old Degree",
        "institution": "Old Institution",
        "start_year": 2018,
        "percentage": 70.0
    })

    # Fetch the list to find the Education ID
    edu_list = client.get(f"/api/education/{resume_id}").get_json()
    edu_id = edu_list[0]["id"]

    # ACT: Update that specific education ID
    response = client.put(f"/api/education/{edu_id}", json={
        "institution": "New Awesome University",
        "percentage": 92.0
    })

    assert response.status_code == 200
    
    check_list = client.get(f"/api/education/{resume_id}").get_json()
    assert check_list[0]["institution"] == "New Awesome University"


# =========================================================
# 4. DELETE EDUCATION (DELETE /<edu_id>)
# =========================================================
def test_delete_education(client):
    resume_id = setup_dummy_with_resume(client)

    # Add education (FIXED: Added the missing required fields!)
    client.post("/api/education/", json={
        "resume_id": resume_id, 
        "education_level": "Graduate", 
        "degree": "Tech Degree",
        "institution": "Tech University",
        "start_year": 2020,
        "percentage": 85.0
    })

    # Fetch the list to find the Education ID
    edu_list = client.get(f"/api/education/{resume_id}").get_json()
    edu_id = edu_list[0]["id"]

    # ACT: Delete it!
    response = client.delete(f"/api/education/{edu_id}")

    assert response.status_code == 200

    # Verify the list is now completely empty
    final_list = client.get(f"/api/education/{resume_id}").get_json()
    assert len(final_list) == 0