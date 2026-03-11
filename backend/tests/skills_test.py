# tests/skills_test.py

def setup_dummy_with_resume(client):
    client.post("/api/auth/register", json={"name": "Skill", "email": "skill@example.com", "password": "pass"})
    client.post("/api/auth/login", json={"email": "skill@example.com", "password": "pass"})
    client.post("/api/resume/", json={"title": "My Resume", "target_job": "Dev"})
    return client.get("/api/resume/all").get_json()[0]["id"]

# 1. CREATE
def test_add_skill(client):
    resume_id = setup_dummy_with_resume(client)
    
    # FIXED: Send "name" exactly like the frontend does!
    response = client.post("/api/skills/", json={
        "resume_id": resume_id,
        "name": "Python Programming", 
        "level": "Expert" 
    })
    assert response.status_code == 201

# 2. READ
def test_get_skills(client):
    resume_id = setup_dummy_with_resume(client)
    
    client.post("/api/skills/", json={
        "resume_id": resume_id, 
        "name": "Python Programming", 
        "level": "Expert"
    })
    
    response = client.get(f"/api/skills/{resume_id}")
    assert response.status_code == 200
    assert len(response.get_json()) == 1

# 3. UPDATE
def test_update_skill(client):
    resume_id = setup_dummy_with_resume(client)
    
    client.post("/api/skills/", json={
        "resume_id": resume_id, 
        "name": "Old Skill", 
        "level": "Beginner"
    })
    
    skill_id = client.get(f"/api/skills/{resume_id}").get_json()[0]["id"]
    
    response = client.put(f"/api/skills/{skill_id}", json={
        "name": "New Awesome Skill",
        "level": "Expert"
    })
    assert response.status_code == 200

# 4. DELETE
def test_delete_skill(client):
    resume_id = setup_dummy_with_resume(client)
    
    client.post("/api/skills/", json={
        "resume_id": resume_id, 
        "name": "Python Programming", 
        "level": "Expert"
    })
    
    skill_id = client.get(f"/api/skills/{resume_id}").get_json()[0]["id"]
    
    response = client.delete(f"/api/skills/{skill_id}")
    assert response.status_code == 200