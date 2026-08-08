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


class EvaluationRequest(BaseModel):
    question: str
    answer: str


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

    answer = ask_gemini(prompt.question)

    return {
        "question": prompt.question,
        "answer": answer
    }


# --------------------------------------------------
# Evaluate Interview Answer
# --------------------------------------------------

@app.post("/evaluate")
def evaluate_answer(request: EvaluationRequest):

    evaluation_prompt = f"""
You are an expert technical interview evaluator.

Evaluate the candidate's answer to the interview question.

Interview Question:
{request.question}

Candidate Answer:
{request.answer}

Give the evaluation in this exact format:

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
Give a short, interview-ready improved answer.

Rules:
- Be fair and realistic.
- Do not give a high score just because the answer is long.
- Focus on correctness.
- Focus on technical understanding.
- Focus on clarity.
- Use simple English.
- Keep the evaluation concise.
"""

    evaluation = ask_gemini(evaluation_prompt)

    return {
        "question": request.question,
        "answer": request.answer,
        "evaluation": evaluation
    }