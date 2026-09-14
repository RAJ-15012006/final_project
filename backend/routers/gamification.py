"""
gamification.py  –  /api/gamification router
----------------------------------------------
Handles all gamification features:
  - Leaderboard (ranked by score)
  - User progress (score, streak, problems solved)
  - Problem submission (awards points by difficulty + speed bonus)
  - Competition submission (1v1 head-to-head result)

NOTE: Currently uses an in-memory mock store.
      Replace with MongoDB calls when the database is connected.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, date

router = APIRouter(prefix="/api/gamification", tags=["Gamification"])


# ── Data Models ───────────────────────────────────────────────────────────────

class UserProgress(BaseModel):
    user_id: str
    username: str
    score: int = 0
    streak: int = 0
    problems_solved: int = 0
    last_active: Optional[str] = None
    badges: List[str] = []

class SubmitRequest(BaseModel):
    user_id: str
    problem_title: str
    difficulty: str = Field(..., pattern="^(Easy|Medium|Hard)$")
    time_taken_seconds: int = Field(..., ge=0)
    is_correct: bool

class CompetitionResult(BaseModel):
    user_a_id: str
    user_b_id: str
    winner_id: str
    problem_title: str
    time_a_seconds: int
    time_b_seconds: int

class LeaderboardEntry(BaseModel):
    rank: int
    username: str
    score: int
    problems_solved: int
    streak: int

class SubmitResponse(BaseModel):
    message: str
    points_earned: int
    new_total_score: int
    streak: int


# ── Scoring Configuration ─────────────────────────────────────────────────────

POINTS_BY_DIFFICULTY = {"Easy": 10, "Medium": 20, "Hard": 30}
SPEED_BONUS_THRESHOLD = 600   # < 10 minutes → bonus
SPEED_BONUS_POINTS = 5
COMPETITION_WIN_BONUS = 15

# ── In-Memory Mock Store (replace with MongoDB) ────────────────────────────────

_mock_users: dict[str, UserProgress] = {
    "user_raj": UserProgress(
        user_id="user_raj", username="Raj",
        score=950, streak=5, problems_solved=42,
        last_active=str(date.today()),
        badges=["🔥 5-Day Streak", "🥇 First Solve"]
    ),
    "user_yana": UserProgress(
        user_id="user_yana", username="Yana",
        score=900, streak=3, problems_solved=38,
        last_active=str(date.today()),
        badges=["⚡ Speed Solver"]
    ),
    "user_dhwani": UserProgress(
        user_id="user_dhwani", username="Dhwani",
        score=850, streak=7, problems_solved=35,
        last_active=str(date.today()),
        badges=["🔥 7-Day Streak", "🧠 Problem Explorer"]
    ),
}


def _calculate_streak(user: UserProgress) -> int:
    """
    Checks if the user was active yesterday and increments streak.
    Resets streak if more than a day was missed.
    """
    today = date.today()
    if user.last_active:
        last = date.fromisoformat(user.last_active)
        delta = (today - last).days
        if delta == 0:
            return user.streak  # Already active today
        elif delta == 1:
            return user.streak + 1  # Consecutive day
        else:
            return 1  # Streak broken, restart
    return 1


# ── Endpoints ──────────────────────────────────────────────────────────────────

@router.get("/progress/{user_id}", response_model=UserProgress,
            summary="Get user progress and stats")
async def get_progress(user_id: str):
    user = _mock_users.get(user_id)
    if user:
        return user
    # Return empty progress for new users
    return UserProgress(user_id=user_id, username=f"User {user_id[:6]}")


@router.post("/submit", response_model=SubmitResponse,
             summary="Submit a problem attempt and earn points")
async def submit_problem(req: SubmitRequest):
    if not req.is_correct:
        return SubmitResponse(
            message="Incorrect submission. Keep trying!",
            points_earned=0,
            new_total_score=_mock_users.get(req.user_id, UserProgress(user_id=req.user_id, username="")).score,
            streak=_mock_users.get(req.user_id, UserProgress(user_id=req.user_id, username="")).streak,
        )

    points = POINTS_BY_DIFFICULTY.get(req.difficulty, 10)
    if req.time_taken_seconds < SPEED_BONUS_THRESHOLD:
        points += SPEED_BONUS_POINTS

    # Upsert user
    if req.user_id not in _mock_users:
        _mock_users[req.user_id] = UserProgress(user_id=req.user_id, username=f"User {req.user_id[:6]}")

    user = _mock_users[req.user_id]
    user.score += points
    user.problems_solved += 1
    user.streak = _calculate_streak(user)
    user.last_active = str(date.today())

    # Award badges
    if user.streak >= 7 and "🔥 7-Day Streak" not in user.badges:
        user.badges.append("🔥 7-Day Streak")
    elif user.streak >= 5 and "🔥 5-Day Streak" not in user.badges:
        user.badges.append("🔥 5-Day Streak")
    if user.problems_solved == 1 and "🥇 First Solve" not in user.badges:
        user.badges.append("🥇 First Solve")
    if req.time_taken_seconds < SPEED_BONUS_THRESHOLD and "⚡ Speed Solver" not in user.badges:
        user.badges.append("⚡ Speed Solver")

    return SubmitResponse(
        message=f"Correct! You earned {points} points.",
        points_earned=points,
        new_total_score=user.score,
        streak=user.streak,
    )


@router.post("/competition/result", summary="Record a competition result")
async def record_competition(result: CompetitionResult):
    for uid in [result.user_a_id, result.user_b_id]:
        if uid not in _mock_users:
            _mock_users[uid] = UserProgress(user_id=uid, username=f"User {uid[:6]}")

    winner = _mock_users.get(result.winner_id)
    if winner:
        winner.score += COMPETITION_WIN_BONUS
        if "🏆 Competition Winner" not in winner.badges:
            winner.badges.append("🏆 Competition Winner")

    loser_id = result.user_b_id if result.winner_id == result.user_a_id else result.user_a_id
    loser = _mock_users.get(loser_id)

    return {
        "message": "Competition result recorded.",
        "winner": winner.username if winner else result.winner_id,
        "winner_bonus_points": COMPETITION_WIN_BONUS,
        "winner_new_score": winner.score if winner else None,
    }


@router.get("/leaderboard", response_model=List[LeaderboardEntry],
            summary="Get the global leaderboard")
async def get_leaderboard(limit: int = 10):
    sorted_users = sorted(
        _mock_users.values(), key=lambda u: u.score, reverse=True
    )
    return [
        LeaderboardEntry(
            rank=idx + 1,
            username=u.username,
            score=u.score,
            problems_solved=u.problems_solved,
            streak=u.streak,
        )
        for idx, u in enumerate(sorted_users[:limit])
    ]


@router.get("/badges/{user_id}", summary="Get user badges")
async def get_badges(user_id: str):
    user = _mock_users.get(user_id)
    if not user:
        return {"badges": []}
    return {"badges": user.badges}
