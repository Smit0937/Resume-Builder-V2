# tests/resume_test.py

def test_create_multiple_resumes_and_delete(client):
    # 1. ARRANGE: Register and Log In
    client.post("/api/auth/register", json={
        "name": "Resume Builder", "email": "builder@example.com", "password": "pass"
    })
    client.post("/api/auth/login", json={
        "email": "builder@example.com", "password": "pass"
    })
    
    # 2. ACT: Create Resume #1 (ADDED SLASH)
    res1 = client.post("/api/resume/", json={
        "title": "Software Engineer Resume",
        "target_job": "Frontend Developer"
    })
    assert res1.status_code == 201
    
    # 3. ACT: Create Resume #2 (ADDED SLASH)
    res2 = client.post("/api/resume/", json={
        "title": "Data Scientist Resume",
        "target_job": "Data Analyst"
    })
    assert res2.status_code == 201

    # 4. ASSERT: Fetch all resumes 
    all_resumes = client.get("/api/resume/all")
    assert all_resumes.status_code == 200
    
    resumes_list = all_resumes.get_json()
    assert len(resumes_list) == 2

    # ---------------------------------------------------------
    # 5. ACT: Delete Resume #1 (THIS IS THE FIXED PART)
    # ---------------------------------------------------------
    # Instead of looking at the 'res1' receipt, we grab the ID directly 
    # from the first resume in the list we just downloaded!
    res1_id = resumes_list[0]["id"] 
    
    delete_response = client.delete(f"/api/resume/{res1_id}")
    assert delete_response.status_code == 200

    # 6. ASSERT: Fetch all resumes again 
    final_resumes = client.get("/api/resume/all")
    assert len(final_resumes.get_json()) == 1


def test_resume_routes_protected(client):
    # Dummy tries to view resumes WITHOUT logging in first (ADDED /all)
    response = client.get("/api/resume/all")
    
    # Bouncer should kick them out!
    assert response.status_code == 401

# ---------------------------------------------------------
# 7. READ ONE: Fetch a single specific resume
# ---------------------------------------------------------
def test_get_single_resume(client):
    # 1. ARRANGE: Register, Login, and Create a resume
    client.post("/api/auth/register", json={"name": "Reader", "email": "read@example.com", "password": "pass"})
    client.post("/api/auth/login", json={"email": "read@example.com", "password": "pass"})
    client.post("/api/resume/", json={"title": "My Only Resume", "target_job": "Developer"})

    # 2. ACT: Get the ID from the list
    all_resumes = client.get("/api/resume/all").get_json()
    resume_id = all_resumes[0]["id"]

    # 3. ACT: Ask Flask for ONLY that specific resume
    # (Assuming your backend route looks like @resume_bp.route("/<int:id>", methods=["GET"]))
    response = client.get(f"/api/resume/{resume_id}")

    # 4. ASSERT: Did we get a 200 OK, and does the title match?
    assert response.status_code == 200
    assert response.get_json()["title"] == "My Only Resume"


# ---------------------------------------------------------
# 8. UPDATE: Change a resume after it is created
# ---------------------------------------------------------
def test_update_resume(client):
    # 1. ARRANGE: Register, Login, and Create a resume with an OLD title
    client.post("/api/auth/register", json={"name": "Updater", "email": "update@example.com", "password": "pass"})
    client.post("/api/auth/login", json={"email": "update@example.com", "password": "pass"})
    client.post("/api/resume/", json={"title": "Old Boring Title", "target_job": "Junior"})

    # 2. ACT: Get the ID
    all_resumes = client.get("/api/resume/all").get_json()
    resume_id = all_resumes[0]["id"]

    # 3. ACT: Tell Flask to UPDATE the resume with a NEW title
    # (Assuming your backend route uses PUT. If it uses PATCH, change client.put to client.patch)
    update_response = client.put(f"/api/resume/{resume_id}", json={
        "title": "Super Awesome New Title",
        "target_job": "Senior Developer"
    })

    # 4. ASSERT: Flask should say 200 OK
    assert update_response.status_code == 200

    # 5. ASSERT: If we fetch it again, the title should be changed!
    check_response = client.get(f"/api/resume/{resume_id}")
    assert check_response.get_json()["title"] == "Super Awesome New Title"    