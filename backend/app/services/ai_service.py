import openai
from flask import current_app


def generate_summary(data):

    # Get AI key from config
    openai.api_key = current_app.config["OPENAI_API_KEY"]

    prompt = f"""
    Generate a professional resume summary.

    Resume Title: {data.get('title')}

    Work Experience:
    {data.get('experience')}
    """

    response = openai.ChatCompletion.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    summary = response.choices[0].message["content"]

    return summary
