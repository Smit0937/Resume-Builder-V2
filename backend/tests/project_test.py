# tests/project_test.py

def setup_dummy_with_resume(client):
    client.post("/api/auth/register", json={"name": "Proj", "email": "proj@example.com", "password": "pass"})
    client.post("/api/auth/login", json={"email": "proj@example.com", "password": "pass"})
    client.post("/api/resume/", json={"title": "My Resume", "target_job": "Dev"})
    return client.get("/api/resume/all").get_json()[0]["id"]

# =========================================================
# 1. CREATE PROJECT
# =========================================================
def test_add_project(client):
    resume_id = setup_dummy_with_resume(client)
    
    # ACT: Using "title" just like your frontend does!
    response = client.post("/api/projects/", json={
        "resume_id": resume_id,
        "title": "AI Chatbot", 
        "description": "Built a chatbot using Python and Django.",
        "tech_stack": "Python, Django, React",
        "link": "https://github.com/my-project"
    })
    
    assert response.status_code == 201

# =========================================================
# 2. READ PROJECT
# =========================================================
def test_get_projects(client):
    resume_id = setup_dummy_with_resume(client)
    
    client.post("/api/projects/", json={
        "resume_id": resume_id,
        "title": "AI Chatbot",
        "description": "Built a chatbot using Python and Django.",
        "tech_stack": "Python",
        "link": "github.com"
    })
    
    response = client.get(f"/api/projects/{resume_id}")
    assert response.status_code == 200
    assert len(response.get_json()) == 1
    
    # FIXED: Look for "title" because your GET route translates it!
    assert response.get_json()[0]["title"] == "AI Chatbot"

# =========================================================
# 3. UPDATE PROJECT
# =========================================================
def test_update_project(client):
    resume_id = setup_dummy_with_resume(client)
    
    client.post("/api/projects/", json={
        "resume_id": resume_id,
        "title": "Old Project",
        "description": "Old description",
        "tech_stack": "HTML",
        "link": "oldlink.com"
    })
    
    # Get the project ID
    proj_id = client.get(f"/api/projects/{resume_id}").get_json()[0]["id"]
    
    # ACT: Update it
    response = client.put(f"/api/projects/{proj_id}", json={
        "title": "New Awesome Project",
        "tech_stack": "React, Node.js"
    })
    assert response.status_code == 200

# =========================================================
# 4. DELETE PROJECT
# =========================================================
def test_delete_project(client):
    resume_id = setup_dummy_with_resume(client)
    
    client.post("/api/projects/", json={
        "resume_id": resume_id,
        "title": "Project to Delete",
        "description": "Delete me",
        "tech_stack": "None",
        "link": "none"
    })
    
    # Get the project ID
    proj_id = client.get(f"/api/projects/{resume_id}").get_json()[0]["id"]
    
    # ACT: Delete it
    response = client.delete(f"/api/projects/{proj_id}")
    assert response.status_code == 200