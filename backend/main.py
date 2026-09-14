"""
main.py  –  FastAPI application entry point
--------------------------------------------
Starts the AI Tutor backend service.
Runs the RAG knowledge base population on startup.

To run:
    cd backend
    uvicorn main:app --reload --port 8000

API Docs available at:
    http://localhost:8000/docs   (Swagger UI)
    http://localhost:8000/redoc  (ReDoc)
"""

import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import ai_tutor, gamification, auth, progress
from services.rag_service import rag_service


# ── Lifespan: Startup / Shutdown ──────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    kb_path = os.path.join(os.path.dirname(__file__), "data", "knowledge_base.json")
    rag_service.populate_knowledge_base(kb_path)
    print("[Startup] AI backend is ready.")
    yield
    # Shutdown
    print("[Shutdown] AI backend stopped.")


# ── App ───────────────────────────────────────────────────────────────────────

app = FastAPI(
    title="JARVIS – AI Learning Assistant API",
    description=(
        "Backend API for the AI-Based Intelligent Learning Assistant for "
        "Competitive Programming. Provides AI tutoring via Groq (LLaMA 3.3 70B) + RAG, "
        "gamification (leaderboard, streaks, scoring), and competition features."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

# ── CORS ──────────────────────────────────────────────────────────────────────
# Allow the React frontend (running on localhost:5173 / 3000) to call this API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "*",  # Remove '*' in production and list exact origins
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(progress.router)
app.include_router(ai_tutor.router)
app.include_router(gamification.router)


# ── Root & Utility Endpoints ──────────────────────────────────────────────────
@app.get("/", tags=["Root"])
async def root():
    return {
        "service": "JARVIS AI Learning Assistant",
        "status": "running",
        "docs": "/docs",
        "version": "1.0.0",
    }

@app.post("/api/listener-heartbeat", tags=["Voice"])
async def listener_heartbeat():
    return {"status": "ok"}

@app.get("/api/speaking-status", tags=["Voice"])
async def speaking_status():
    return {"speaking": false}

@app.post("/api/voice-command", tags=["Voice"])
async def voice_command():
    return {"status": "ok", "message": "Voice command received"}

