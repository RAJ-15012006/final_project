"""
progress.py – /api/progress router
-----------------------------------
Handles user progress tracking for solved problems matching ProgressContext.jsx:
  - GET  /api/progress/        : List solved problems for the current user
  - POST /api/progress/solved  : Record a solved problem
"""

from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime

router = APIRouter(prefix="/api/progress", tags=["Progress"])

class SolvedItem(BaseModel):
    problemId: str
    solvedAt: str

class MarkSolvedRequest(BaseModel):
    problemId: str

# In-memory storage for solved progress per user / token
_progress_store: Dict[str, List[dict]] = {}

@router.get("/", response_model=List[SolvedItem], summary="Get user solved problems")
async def get_progress(authorization: Optional[str] = Header(None)):
    """
    Returns array of solved problems for the user.
    """
    token = authorization.replace("Bearer ", "") if authorization else "anonymous"
    return _progress_store.get(token, [])

@router.post("/solved", summary="Mark problem as solved")
async def mark_solved(req: MarkSolvedRequest, authorization: Optional[str] = Header(None)):
    """
    Saves problem as solved with ISO timestamp.
    """
    token = authorization.replace("Bearer ", "") if authorization else "anonymous"
    
    if token not in _progress_store:
        _progress_store[token] = []
        
    existing = any(item["problemId"] == req.problemId for item in _progress_store[token])
    if not existing:
        new_item = {
            "problemId": str(req.problemId),
            "solvedAt": datetime.utcnow().isoformat() + "Z"
        }
        _progress_store[token].append(new_item)
        
    return {"message": "Progress recorded", "problemId": req.problemId}
