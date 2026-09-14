"""
auth.py – /api/auth router
---------------------------
Handles authentication endpoints matching the frontend requirements:
  - POST /api/auth/login-json   : Sign in with ID/username and password
  - POST /api/auth/register     : Register a new user
"""

import uuid
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from typing import Optional, Dict

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# ── Data Models ───────────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    id: str = Field(..., description="Username or User ID")
    password: str = Field(..., description="User password")

class RegisterRequest(BaseModel):
    id: str = Field(..., min_length=2, description="Username or User ID")
    name: str = Field(..., min_length=1, description="Full Name")
    email: str = Field(..., min_length=3, description="Email address")
    password: str = Field(..., min_length=4, description="Password")

class UserResponse(BaseModel):
    id: str
    name: str
    email: str

class LoginResponse(BaseModel):
    user: UserResponse
    access_token: str
    token_type: str = "bearer"

class RegisterResponse(BaseModel):
    message: str
    user: UserResponse

# ── In-Memory Users Database ─────────────────────────────────────────────────
# Seeded with default demo credentials matching src/data/users.js
_users_db: Dict[str, dict] = {
    "student1": {
        "id": "student1",
        "password": "password123",
        "name": "Student 1",
        "email": "student1@example.com"
    },
    "admin": {
        "id": "admin",
        "password": "admin",
        "name": "Admin User",
        "email": "admin@example.com"
    },
    "raj": {
        "id": "raj",
        "password": "password123",
        "name": "Raj Samrendra",
        "email": "raj@example.com"
    }
}

# ── Endpoints ──────────────────────────────────────────────────────────────────

@router.post("/login-json", response_model=LoginResponse, summary="User login via JSON")
async def login_json(credentials: LoginRequest):
    """
    Authenticates a user with ID/username and password.
    Returns the user profile and a Bearer access token.
    """
    user_id = credentials.id.strip().lower()
    user = _users_db.get(user_id)

    if not user or user["password"] != credentials.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )

    # Generate a lightweight session token
    token = f"jarvis-token-{uuid.uuid4().hex}"

    return LoginResponse(
        user=UserResponse(
            id=user["id"],
            name=user["name"],
            email=user["email"]
        ),
        access_token=token
    )

@router.post("/register", response_model=RegisterResponse, status_code=status.HTTP_201_CREATED, summary="Register a new user")
async def register_user(req: RegisterRequest):
    """
    Registers a new user in the system.
    """
    user_id = req.id.strip().lower()

    if user_id in _users_db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken. Please choose another."
        )

    new_user = {
        "id": user_id,
        "name": req.name.strip(),
        "email": req.email.strip(),
        "password": req.password
    }
    _users_db[user_id] = new_user

    return RegisterResponse(
        message="Registration successful",
        user=UserResponse(
            id=new_user["id"],
            name=new_user["name"],
            email=new_user["email"]
        )
    )

@router.get("/users", summary="List registered users (for debugging)")
async def list_users():
    return [
        {"id": u["id"], "name": u["name"], "email": u["email"]}
        for u in _users_db.values()
    ]
