# InterviewerIQ — Build & Deployment Prompt

## Goal
Build and deploy **InterviewerIQ**, an AI-powered interview assistant with a static frontend and a Python/FastAPI backend.

## Project structure

```text
InterviewerIQ/
├── backend/
│   ├── agents/
│   │   └── gemini_agent.py
│   ├── api/
│   │   ├── index.py
│   │   └── vercel.json
│   ├── .env
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── index.html
│   ├── script.js
│   ├── style.css
│   └── start.bat
├── docs/
├── .gitignore
└── README.md
```

## Master prompt

You are an expert full-stack developer. Build and configure **InterviewerIQ**, an AI-powered interview assistant.

### Frontend

Create a responsive UI with:
- Title: **InterviewerIQ**
- Subtitle: **AI-Powered Interview Assistant**
- Interview question input
- **Ask AI** button
- AI Response section
- User Answer section
- Answer evaluation feature
- Loading and error messages

Keep all frontend files inside `frontend/`.

Use plain:
- HTML
- CSS
- JavaScript

### Backend

Use **Python + FastAPI**.

Provide:

```http
POST /ask
POST /evaluate
```

`/ask` should accept an interview question and return an AI-generated answer.

`/evaluate` should accept the interview question and the user's answer and return an evaluation.

Keep the FastAPI application in:

```text
backend/main.py
```

Use the existing Gemini/AI agent where appropriate.

## Local API calls

During local development:

```javascript
fetch("http://127.0.0.1:8000/ask", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({question: question})
});
```

For evaluation:

```javascript
fetch("http://127.0.0.1:8000/evaluate", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
        question: question,
        answer: answer
    })
});
```

For production, replace the localhost URL with the deployed backend URL. Never make the live Netlify site depend on `127.0.0.1` or `localhost`.

## Vercel backend entry point

Use:

```text
backend/api/index.py
```

The entry point can add the backend directory to Python's import path and expose the FastAPI app:

```python
import sys
from pathlib import Path

backend_path = Path(__file__).resolve().parent.parent / "backend"

if str(backend_path) not in sys.path:
    sys.path.insert(0, str(backend_path))

from main import app
```

Make the Vercel configuration compatible with a Python/FastAPI deployment.

## Environment variables

Keep API keys and secrets in `.env`.

Never expose secrets in frontend JavaScript and never commit `.env` to GitHub.

Add `.env` to `.gitignore`.

Configure required production environment variables in the hosting provider.

## GitHub

After changes:

```bash
git add .
git commit -m "Update InterviewerIQ"
git push -u origin main
```

Keep both `frontend/` and `backend/` in the repository.

Do not commit the Python virtual environment.

## Netlify frontend deployment

Deploy the frontend from the GitHub repository.

For a plain HTML/CSS/JS frontend:

**Base directory:**
```text
frontend
```

**Build command:**
```text
leave empty
```

**Publish directory:**
```text
.
```

Alternatively, if Base directory is left empty, use:

```text
frontend
```

as the publish directory.

After a successful deployment, Netlify provides a URL similar to:

```text
https://your-project.netlify.app
```

That is the **frontend live URL**.

In Netlify, open the latest successful deployment and click **Open production deploy** to get/copy the live frontend URL.

## Backend deployment

The backend must be deployed separately from the static Netlify frontend, for example using a Python/FastAPI-compatible hosting service.

The backend gets its own live API URL, for example:

```text
https://your-backend.example.com
```

Then update the production frontend JavaScript so `/ask` and `/evaluate` requests use that live backend URL.

## CORS

Because Netlify and the backend are different domains, enable CORS in FastAPI.

Example:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

For production, preferably replace `["*"]` with the actual Netlify domain.

## Deployment architecture

```text
User
  ↓
Netlify frontend
  ↓
HTML / CSS / JavaScript
  ↓
Live FastAPI backend
  ↓
AI / Gemini service
```

The Netlify URL is the frontend URL. The backend has a separate API URL.

## Troubleshooting

### Netlify 404
Check:
1. `frontend/index.html` exists.
2. Publish directory is correct.
3. Latest deployment is successful.
4. Use **Open production deploy**.
5. Make sure the deployed site contains `index.html`.

### Frontend opens but AI does not work
Check the browser console and Network tab.

If requests still point to:

```text
http://127.0.0.1:8000
```

or:

```text
https://interviweriq.onrender.com
```

replace them with the live backend URL.

### Backend 404
Verify that these routes exist:

```text
POST /ask
POST /evaluate
```

and that the deployment entry point correctly exposes:

```python
from main import app
```

### Backend works locally but not online
Check:
- `requirements.txt`
- environment variables
- FastAPI entry point
- hosting configuration
- Python runtime
- CORS
- deployment logs

## Final checklist

- [ ] Frontend opens from the Netlify production URL.
- [ ] Question input works.
- [ ] Ask AI works.
- [ ] AI response appears.
- [ ] User can enter an answer.
- [ ] Evaluation works.
- [ ] Backend is deployed.
- [ ] Frontend uses the live backend URL.
- [ ] CORS is configured.
- [ ] API keys are not exposed.
- [ ] `.env` is not committed.
- [ ] Latest code is pushed to GitHub.
- [ ] Netlify deployment is complete.

## Important rule for future changes

Keep frontend and backend separate. Do not move frontend files into `backend/` or backend files into `frontend/`. Test locally, push changes to GitHub, verify the Netlify deployment, verify the backend API, and ensure production API requests never use localhost.
