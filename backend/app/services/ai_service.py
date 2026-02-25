import os
from groq import Groq

def generate_summary(data):

    api_key = os.getenv("GROQ_API_KEY")

    if not api_key:
        raise ValueError("GROQ_API_KEY is not set")

    client = Groq(api_key=api_key)

    prompt = f"""
    Generate a professional resume summary for:
    Name: {data.get('full_name', '')}
    Professional Title: {data.get('professional_title', '')}

    Write a strong, concise 3-4 line professional summary in first person.
    Only return the summary text, no extra explanation or labels.
    """

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": "You are a professional resume writer."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_tokens=300,
    )

    return response.choices[0].message.content.strip()