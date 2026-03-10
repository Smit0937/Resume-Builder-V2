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