"""
ai_tutor.py  –  /api/ai router
--------------------------------
Exposes the 5 core AI Tutor workflow endpoints:
  1. POST /api/ai/hint       – Progressive hint (levels 1, 2, 3)
  2. POST /api/ai/approach   – Optimal algorithmic intuition and approach
  3. POST /api/ai/complexity – Big-O Time and Space complexity breakdown
  4. POST /api/ai/mistakes   – Common pitfalls and tricky edge cases
  5. POST /api/ai/code       – Clean, commented solution code
  +  POST /api/ai/ask        – Open-ended Socratic dialogue
  +  GET  /api/ai/health     – Service health check
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional

from services.llm_service import (
    get_tutor_response,
    get_hint_chain_response,
    get_approach_response,
    get_complexity_response,
    get_mistakes_response,
    get_code_solution_response,
    get_interview_response
)
from services.rag_service import rag_service

router = APIRouter(prefix="/api/ai", tags=["AI Tutor"])


# ── Request / Response Models ─────────────────────────────────────────────────

class AskRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000,
                         description="The student's question or message")
    problem_title: Optional[str] = Field(
        None, description="LeetCode problem title for RAG context retrieval"
    )

class ProblemActionRequest(BaseModel):
    problem_title: str = Field(..., min_length=1,
                               description="LeetCode problem title")

class HintRequest(BaseModel):
    problem_title: str = Field(..., min_length=1,
                               description="LeetCode problem title")
    hint_level: int = Field(1, ge=1, le=5,
                            description="Hint level: 1 to 5 progressive nudges")

class CodeRequest(BaseModel):
    problem_title: str = Field(..., min_length=1,
                               description="LeetCode problem title")
    language: Optional[str] = Field("Java", description="Programming language (Java, Python, C++, JavaScript)")

class AIResponse(BaseModel):
    response: str
    rag_used: bool = False
    action: Optional[str] = None
    hint_level: Optional[int] = None


# ── 1. Open-ended Q&A ──────────────────────────────────────────────────────────

@router.post("/ask", response_model=AIResponse, summary="Ask the AI Tutor anything")
async def ask_tutor(request: AskRequest):
    try:
        search_query = f"{request.problem_title or ''} {request.message}".strip()
        rag_context = rag_service.retrieve_context(search_query)
        ai_response = get_tutor_response(request.message, rag_context)

        return AIResponse(
            response=ai_response,
            rag_used=bool(rag_context),
            action="ask"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")


# ── 2. Progressive Hint ───────────────────────────────────────────────────────

@router.post("/hint", response_model=AIResponse, summary="Progressive Hint (Levels 1-3)")
async def get_hint(request: HintRequest):
    try:
        rag_context = rag_service.retrieve_context(request.problem_title)
        hint_response = get_hint_chain_response(
            request.problem_title, request.hint_level, rag_context
        )
        return AIResponse(
            response=hint_response,
            rag_used=bool(rag_context),
            action="hint",
            hint_level=request.hint_level,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Hint generation error: {str(e)}")


# ── 3. Approach & Intuition ───────────────────────────────────────────────────

@router.post("/approach", response_model=AIResponse, summary="Explain Algorithmic Approach")
async def get_approach(request: ProblemActionRequest):
    try:
        rag_context = rag_service.retrieve_context(request.problem_title)
        approach_response = get_approach_response(request.problem_title, rag_context)
        return AIResponse(
            response=approach_response,
            rag_used=bool(rag_context),
            action="approach"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Approach generation error: {str(e)}")


# ── 4. Complexity Analysis ────────────────────────────────────────────────────

@router.post("/complexity", response_model=AIResponse, summary="Big-O Complexity Breakdown")
async def get_complexity(request: ProblemActionRequest):
    try:
        rag_context = rag_service.retrieve_context(request.problem_title)
        complexity_response = get_complexity_response(request.problem_title, rag_context)
        return AIResponse(
            response=complexity_response,
            rag_used=bool(rag_context),
            action="complexity"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Complexity analysis error: {str(e)}")


# ── 5. Common Mistakes & Edge Cases ───────────────────────────────────────────

@router.post("/mistakes", response_model=AIResponse, summary="Common Pitfalls & Edge Cases")
async def get_mistakes(request: ProblemActionRequest):
    try:
        rag_context = rag_service.retrieve_context(request.problem_title)
        mistakes_response = get_mistakes_response(request.problem_title, rag_context)
        return AIResponse(
            response=mistakes_response,
            rag_used=bool(rag_context),
            action="mistakes"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Mistakes analysis error: {str(e)}")


# ── 6. Full Solution Code ─────────────────────────────────────────────────────

@router.post("/code", response_model=AIResponse, summary="Provide Complete Solution Code")
async def get_code(request: CodeRequest):
    try:
        rag_context = rag_service.retrieve_context(request.problem_title)
        code_response = get_code_solution_response(request.problem_title, request.language or "Java", rag_context)
        return AIResponse(
            response=code_response,
            rag_used=bool(rag_context),
            action="code"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Code generation error: {str(e)}")


# ── 7. Mock Interview Chat ────────────────────────────────────────────────────

class InterviewMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str

class InterviewRequest(BaseModel):
    history: list[InterviewMessage] = []

class InterviewResponse(BaseModel):
    response: str

@router.post("/interview", response_model=InterviewResponse, summary="Mock Interview Chat Turn")
async def mock_interview(request: InterviewRequest):
    try:
        history = [{"role": m.role, "content": m.content} for m in request.history]
        reply = get_interview_response(history)
        return InterviewResponse(response=reply)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Interview service error: {str(e)}")


# ── Health Check ──────────────────────────────────────────────────────────────

@router.get("/health", summary="Health check for AI service")
async def ai_health():
    import os
    api_key_set = bool(os.getenv("GROQ_API_KEY"))
    rag_loaded = rag_service._collection_loaded
    model = os.getenv("GROQ_MODEL", "qwen/qwen3.8-27b")

    return {
        "status": "ok",
        "groq_api_key_configured": api_key_set,
        "rag_knowledge_base_loaded": rag_loaded,
        "model": model,
        "provider": "Groq",
        "endpoints": [
            "/api/ai/ask",
            "/api/ai/hint",
            "/api/ai/approach",
            "/api/ai/complexity",
            "/api/ai/mistakes",
            "/api/ai/code"
        ]
    }
