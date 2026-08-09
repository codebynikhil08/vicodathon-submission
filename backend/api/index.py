import sys
from pathlib import Path

# Add backend folder to Python path
backend_path = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(backend_path))

# Import FastAPI app
from main import app