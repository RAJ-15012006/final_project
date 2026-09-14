# JARVIS AI Backend — FastAPI + Gemini + RAG

Python-based AI backend service for the **AI-Based Intelligent Learning Assistant for Competitive Programming** project.

## Architecture

```
User Question
      │
      ▼
 FastAPI (main.py)
      │
   ┌──┴──────────────────────┐
   │                         │
   ▼                         ▼
/api/ai                /api/gamification
   │
   ▼
RAG Service (ChromaDB)
   │  retrieves relevant
   │  problem context
   ▼
LLM Service (Gemini 1.5 Flash)
   │  generates structured
   │  tutor response
   ▼
Structured AI Tutor Answer
```

## Endpoints

### AI Tutor
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/ask` | Ask the tutor a question (uses RAG + Gemini) |
| POST | `/api/ai/hint` | Get a progressive hint (level 1/2/3) |
| GET | `/api/ai/health` | Health check — API key and RAG status |

### Gamification
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/gamification/leaderboard` | Global leaderboard |
| GET | `/api/gamification/progress/{user_id}` | User progress & stats |
| POST | `/api/gamification/submit` | Submit a problem attempt (earn points) |
| POST | `/api/gamification/competition/result` | Record competition winner |
| GET | `/api/gamification/badges/{user_id}` | User badges |

## Setup

### 1. Create and activate a virtual environment

```bash
cd backend
python3 -m venv venv
source venv/bin/activate    # Mac / Linux
# venv\Scripts\activate     # Windows
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Set your Gemini API key

```bash
cp .env.example .env
# Edit .env and set GEMINI_API_KEY=your_actual_key
```

Get your free API key from: https://aistudio.google.com/app/apikey

### 4. Run the server

```bash
uvicorn main:app --reload --port 8000
```

The server starts at **http://localhost:8000**

**Interactive API docs:** http://localhost:8000/docs

## Key Files

```
backend/
├── main.py                    # FastAPI app entry point, CORS, lifespan
├── requirements.txt           # Python dependencies
├── .env.example               # Environment variable template
├── routers/
│   ├── ai_tutor.py            # /api/ai endpoints (ask, hint, health)
│   └── gamification.py        # /api/gamification endpoints
├── services/
│   ├── llm_service.py         # Gemini LLM integration + prompt engineering
│   └── rag_service.py         # ChromaDB RAG pipeline + retrieval
└── data/
    └── knowledge_base.json    # Curated LeetCode problem knowledge base
```

## RAG Knowledge Base

The `knowledge_base.json` file contains structured knowledge for LeetCode problems. Each entry includes:
- Problem understanding
- Key observations  
- Brute force approach
- Optimized approach
- Time and space complexity
- Common mistakes

**Currently covers:** Two Sum, Valid Parentheses, Best Time to Buy and Sell Stock, Valid Anagram, Maximum Subarray (Kadane's), Merge Intervals, Binary Search, Climbing Stairs, Linked List Cycle, Reverse Linked List, Number of Islands, Coin Change, Longest Common Subsequence.

To add more problems, append entries to `knowledge_base.json` and restart the server.

## Scoring System

| Difficulty | Base Points | Speed Bonus (< 10 min) |
|-----------|-------------|------------------------|
| Easy | 10 | +5 |
| Medium | 20 | +5 |
| Hard | 30 | +5 |
| Competition Win | +15 | — |

## Notes for Viva / Report

> **Important:** We did NOT train the Gemini LLM. We integrated Google's Gemini 1.5 Flash model via API and customized its behavior using **prompt engineering**. The RAG system retrieves domain-specific competitive-programming knowledge from a **vector database (ChromaDB)** before every LLM call, making responses more accurate and context-aware. This is the standard RAG (Retrieval-Augmented Generation) architecture.
