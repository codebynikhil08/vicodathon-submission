import os
import time

from dotenv import load_dotenv
from google import genai
from google.genai import errors


# Load environment variables
load_dotenv()


# Get API key
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY not found in .env file")


# Create Gemini client
client = genai.Client(api_key=api_key)


# Gemini model
MODEL_NAME = "gemini-3.6-flash"


def ask_gemini(prompt):

    interview_prompt = f"""
You are an expert technical interviewer assistant.

Answer the following interview question.

Rules:
- Give a clear and concise answer.
- Keep the answer suitable for a college student interview.
- Start with a simple definition.
- Give 1 practical example.
- Mention key points only.
- Avoid unnecessary long explanations.
- Use simple English.

Question:
{prompt}
"""

    for attempt in range(3):

        try:
            response = client.models.generate_content(
                model=MODEL_NAME,
                contents=interview_prompt
            )

            return response.text

        except errors.ServerError:

            if attempt < 2:
                time.sleep(3)

            else:
                return "Gemini is temporarily busy. Please try again."