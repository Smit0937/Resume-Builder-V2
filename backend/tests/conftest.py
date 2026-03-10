import pytest
from app import create_app
from app.extensions import db

@pytest.fixture
def client():
    # 1. Get the app ready
    app = create_app()
    
    # 2. Tell the app it is in "Test Mode" and give it a fake memory database!
    app.config.update({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:" ,
        "JWT_SECRET_KEY": "this-is-a-super-long-fake-secret-key-just-for-testing-purposes-12345"  # This means "save it in RAM, not on the hard drive!"
    })

    # 3. Build the Sandbox
    with app.app_context():
        db.create_all() # Create the fake tables
        
        # Hand the Crash Test Dummy (client) to the test
        yield app.test_client() 
        
        # 4. Destroy the Sandbox when the test is done
        db.session.remove()
        db.drop_all()