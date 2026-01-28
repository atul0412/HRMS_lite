"""HRMS Lite - FastAPI backend (MongoDB)."""
from contextlib import asynccontextmanager
from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from database import init_db
from routers import employees, attendance

# Load environment variables from .env file
load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        # Call init_db() without arguments — it reads MONGODB_URI internally
        init_db()
    except Exception as e:
        print("Failed to initialize DB:", e)
        raise e
    yield

# Create FastAPI app with lifespan
app = FastAPI(
    title="HRMS Lite API",
    description="Lightweight HR Management System API",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(employees.router)
app.include_router(attendance.router)

# Root endpoint
@app.get("/")
def root():
    return {"message": "HRMS Lite API", "docs": "/docs"}

# HEAD endpoint for platform health checks
@app.head("/")
def head_root():
    return Response(status_code=200)

# Health check endpoint
@app.get("/health")
def health():
    return {"status": "ok"}

# Run locally
if __name__ == "__main__":
    import uvicorn
    PORT = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=PORT)
