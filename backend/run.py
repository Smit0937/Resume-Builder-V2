from app import create_app
from flask import jsonify
from app.extensions import db
from sqlalchemy import text


app = create_app()   # FIRST create app

@app.route("/")
def home():
    return jsonify({"message": "Backend is working"})

@app.route("/test-db")
def test_db():
    try:
        db.session.execute(text("SELECT 1"))
        return {"message": "Database connected successfully"}
    except Exception as e:
        return {"error": str(e)}

print(app.url_map)

if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)
