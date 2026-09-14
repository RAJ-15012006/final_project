"""
ai_tutor.py  –  /api/ai router
--------------------------------
Exposes the AI Tutor endpoints consumed by the frontend Chatbot component.

Endpoints:
  POST /api/ai/ask        – General question about any problem
  POST /api/ai/hint       – Progressive hint (level 1 / 2 / 3)
  GET  /api/ai/health     – Health check / model status
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional

from services.llm_service import get_tutor_response, get_hint_chain_response
from services.rag_service import rag_service

router = APIRouter(prefix="/api/ai", tags=["AI Tutor"])


# ── Request / Response Models ─────────────────────────────────────────────────

class AskRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000,
                         description="The student's question or message")
    problem_title: Optional[str] = Field(
        None, description="LeetCode problem title for RAG context retrieval"
    )

class HintRequest(BaseModel):
    problem_title: str = Field(..., min_length=1,
                               description="LeetCode problem title")
    hint_level: int = Field(1, ge=1, le=3,
                            description="Hint level: 1=gentle, 2=stronger, 3=near-approach")

class AIResponse(BaseModel):
    response: str
    rag_used: bool = False
    hint_level: Optional[int] = None


# ── Endpoints ──────────────────────────────────────────────────────────────────

@router.post("/ask", response_model=AIResponse, summary="Ask the AI Tutor a question")
async def ask_tutor(request: AskRequest):
    """
    Main chat endpoint. Retrieves relevant context from RAG and
    generates a structured tutoring response via Gemini.
    """
    try:
        # RAG: build the search query from problem title + message
        search_query = f"{request.problem_title or ''} {request.message}".strip()
        rag_context = rag_service.retrieve_context(search_query)

        ai_response = get_tutor_response(request.message, rag_context)

        return AIResponse(
            response=ai_response,
            rag_used=bool(rag_context),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")


@router.post("/hint", response_model=AIResponse, summary="Get a progressive hint")
async def get_hint(request: HintRequest):
    """
    Returns a progressive hint for a problem at the requested hint level.
    Level 1 = gentle nudge, Level 2 = stronger hint, Level 3 = near approach.
    """
    try:
        rag_context = rag_service.retrieve_context(request.problem_title)
        hint_response = get_hint_chain_response(
            request.problem_title, request.hint_level, rag_context
        )

        return AIResponse(
            response=hint_response,
            rag_used=bool(rag_context),
            hint_level=request.hint_level,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Hint generation error: {str(e)}")


@router.get("/health", summary="Health check for AI service")
async def ai_health():
    """
    Returns status of the AI service and whether the RAG vector DB is loaded.
    """
    import os
    api_key_set = bool(os.getenv("GEMINI_API_KEY"))
    rag_loaded = rag_service._collection_loaded

    return {
        "status": "ok",
        "gemini_api_key_configured": api_key_set,
        "rag_knowledge_base_loaded": rag_loaded,
        "model": "gemini-1.5-flash",
    }
