from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from agents.gemini_agent import ask_gemini


# --------------------------------------------------
# FastAPI App
# --------------------------------------------------

app = FastAPI(
    title="InterviewerIQ AI",
    description="AI-powered interview assistant",
    version="1.0.0"
)


# --------------------------------------------------
# CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# Request Models
# --------------------------------------------------

class Prompt(BaseModel):
    question: str
    mode: str = "technical"


class EvaluationRequest(BaseModel):
    question: str
    answer: str
    mode: str = "technical"


# --------------------------------------------------
# Home Route
# --------------------------------------------------

@app.get("/")
def home():

    return {
        "message": "InterviewerIQ Backend is Running!",
        "status": "success"
    }


# --------------------------------------------------
# Ask AI
# --------------------------------------------------

@app.post("/ask")
def ask(prompt: Prompt):

    mode_instructions = {

        "technical": """
Focus on technical correctness, concepts,
definitions, algorithms, tools and practical examples.
""",

        "hr": """
Focus on communication, personality, motivation,
career goals, teamwork and professionalism.
""",

        "behavioral": """
Focus on problem solving, decision making,
teamwork, leadership and real-world situations.
"""
    }

    instruction = mode_instructions.get(
        prompt.mode,
        mode_instructions["technical"]
    )

    interview_prompt = f"""
You are an expert {prompt.mode} interview assistant.

Interview Mode:
{prompt.mode}

{instruction}

Answer the following interview question.

Question:
{prompt.question}

Rules:
- Keep the answer concise.
- Use simple English.
- Make the answer suitable for a college student.
- Give a practical example when useful.
- Avoid unnecessary long explanations.
"""

    answer = ask_gemini(interview_prompt)

    return {
        "question": prompt.question,
        "mode": prompt.mode,
        "answer": answer
    }


# --------------------------------------------------
# Evaluate Interview Answer
# --------------------------------------------------

@app.post("/evaluate")
def evaluate_answer(request: EvaluationRequest):

    mode_instructions = {

        "technical": """
Evaluate technical correctness, concepts,
accuracy and technical understanding.
""",

        "hr": """
Evaluate communication, confidence,
professionalism, motivation and clarity.
""",

        "behavioral": """
Evaluate problem solving, decision making,
teamwork, leadership and handling of situations.
"""
    }

    instruction = mode_instructions.get(
        request.mode,
        mode_instructions["technical"]
    )

    evaluation_prompt = f"""
You are an expert interview evaluator.

Interview Type:
{request.mode}

{instruction}

Interview Question:
{request.question}

Candidate Answer:
{request.answer}

Evaluate the candidate fairly.

Give the evaluation in this format:

Score: X/10
Accuracy: X/10
Clarity: X/10
Technical Knowledge: X/10

Strengths:
- Point 1
- Point 2

Improvements:
- Point 1
- Point 2

Feedback:
Give concise and practical feedback.

Better Answer:
Give a short interview-ready improved answer.

Rules:
- Do not give a high score just because the answer is long.
- Focus on the selected interview mode.
- Use simple English.
"""

    evaluation = ask_gemini(evaluation_prompt)

    return {
        "question": request.question,
        "answer": request.answer,
        "mode": request.mode,
        "evaluation": evaluation
    }