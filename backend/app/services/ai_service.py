from groq import Groq
from flask import current_app


def generate_summary(data):

    # Get Groq API key from config
    client = Groq(
        api_key=current_app.config["GROQ_API_KEY"]
    )

    # Format experience properly
    experience_text = ""
    for exp in data.get("experience", []):
        experience_text += f"- {exp.get('role')} at {exp.get('company')}\n"

    prompt = f"""
    Generate a professional resume summary.

    Resume Title: {data.get('title')}

    Work Experience:
    {experience_text}

    Write a strong, concise 3-4 line professional summary.
    """

    response = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[
            {"role": "system", "content": "You are a professional resume writer."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_tokens=300,
    )

    summary = response.choices[0].message.content

    return summary