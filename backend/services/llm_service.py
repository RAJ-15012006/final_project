"""
llm_service.py
--------------
Handles all communication with the Groq LLM API.
Uses prompt engineering to constrain the AI to act as a
structured competitive-programming tutor.

Groq provides ultra-fast inference for open-source models like
LLaMA 3.3 70B, which is used here as the AI backbone.
"""

import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

# ── Groq Client ───────────────────────────────────────────────────────────────
_client = Groq(api_key=os.getenv("GROQ_API_KEY", ""))

# Default model supported on this account
GROQ_MODEL = os.getenv("GROQ_MODEL", "qwen/qwen3.8-27b")

# ── Master System Prompt (Prompt Engineering) ─────────────────────────────────
SYSTEM_PROMPT = """You are JARVIS — an AI tutor specialized exclusively in competitive programming and LeetCode problem-solving.

Your PRIMARY goal is to TEACH, not to immediately reveal answers.

## Behaviour Rules
1. NEVER dump the complete solution immediately unless the student explicitly asks for "the code" or "the full solution".
2. Always begin by confirming your understanding of what the student is asking.
3. Guide students using the Socratic method — ask leading questions when appropriate.
4. Structure every substantive response using these sections (include only relevant ones):

   ### 🧠 Problem Understanding
   Restate the problem simply in your own words.

   ### 🔑 Key Observation
   Point out the critical insight that unlocks the solution.

   ### 💡 Hint
   Provide a gentle nudge (increase detail if the student asks for another hint).

   ### ⚡ Approach
   Explain the algorithm step-by-step (no code yet unless requested).

   ### 📊 Complexity
   State Time and Space complexity with brief justification.

   ### ⚠️ Common Mistakes
   Mention pitfalls to watch out for.

   ### 💻 Code (only when explicitly requested)
   Provide clean, commented code with explanations.

5. Use **Markdown formatting** for readability.
6. Be encouraging, patient, and positive.
7. If the question is not about competitive programming or DSA, politely redirect.
"""


def _chat(messages: list[dict], max_tokens: int = 750) -> str:
    """
    Sends messages to Groq with automatic fallback across candidate models
    and resilient rate-limit handling.
    """
    candidate_models = [
        os.getenv("GROQ_MODEL", "qwen/qwen3.8-27b"),
        "qwen/qwen3.8-27b",
        "qwen/qwen3.6-27b",
        "openai/gpt-oss-120b"
    ]
    # Remove duplicates while preserving order
    seen = set()
    models_to_try = [m for m in candidate_models if not (m in seen or seen.add(m))]

    last_error = None
    for model_name in models_to_try:
        try:
            response = _client.chat.completions.create(
                model=model_name,
                messages=messages,
                temperature=0.7,
                max_tokens=max_tokens,
            )
            if response.choices and response.choices[0].message.content:
                return response.choices[0].message.content
        except Exception as e:
            last_error = e
            print(f"[Groq Error on {model_name}] {e}")
            continue

    return (
        f"⚠️ **AI Service Notice:** The model reached its free-tier rate limit ({last_error}). "
        "Please wait a few seconds and try again, or check your API key in `backend/.env`."
    )


def get_tutor_response(user_message: str, rag_context: str = "") -> str:
    """
    Generates a tutoring response from the Groq LLM.

    Args:
        user_message: The student's question or message.
        rag_context: Optional context retrieved from the RAG vector database.

    Returns:
        A formatted Markdown string response from the AI tutor.
    """
    # Build the user content — prepend RAG context if available
    user_content = ""
    if rag_context:
        user_content += (
            "## Relevant Knowledge Base Context\n\n"
            f"{rag_context}\n\n---\n\n"
        )
    user_content += f"## Student Question\n\n{user_message}"

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user",   "content": user_content},
    ]
    return _chat(messages)


def get_hint_chain_response(
    problem_title: str,
    hint_level: int,
    rag_context: str = ""
) -> str:
    """
    Provides a progressive hint for a given problem at a specific hint level.

    Args:
        problem_title: Name of the LeetCode problem.
        hint_level: 1 = gentle nudge, 2 = stronger hint, 3 = near-full approach.
        rag_context: Optional context from the RAG vector database.

    Returns:
        A formatted hint string.
    """
    hint_descriptions = {
        1: "a very gentle nudge — just point to what data structure or algorithmic pattern to think about. Do NOT reveal the approach.",
        2: "a stronger hint — explain the key observation or insight needed, but still don't give the full algorithm.",
        3: "a near-complete approach — explain the algorithm step-by-step clearly, but still do NOT provide the final code.",
    }
    hint_desc = hint_descriptions.get(hint_level, hint_descriptions[1])

    user_content = ""
    if rag_context:
        user_content += (
            "## Relevant Knowledge Base Context\n\n"
            f"{rag_context}\n\n---\n\n"
        )
    user_content += (
        f"## Student Request\n\n"
        f"The student is stuck on the LeetCode problem: **{problem_title}**.\n"
        f"They requested Hint Level {hint_level}. Provide {hint_desc}"
    )

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user",   "content": user_content},
    ]
    return _chat(messages)


def get_approach_response(problem_title: str, rag_context: str = "") -> str:
    """
    Explains the optimal algorithmic approach and intuition without providing code.
    """
    user_content = ""
    if rag_context:
        user_content += f"## Relevant Knowledge Base Context\n\n{rag_context}\n\n---\n\n"
    user_content += (
        f"## Student Request\n\n"
        f"Explain the recommended approach and algorithmic intuition for **{problem_title}**.\n"
        f"Structure your response with:\n"
        f"1. 🧠 Core Problem Intuition\n"
        f"2. 🔑 Key Observations\n"
        f"3. ⚡ Step-by-Step Algorithm Walkthrough (plain language, NO final code)\n"
        f"4. 📊 Brief Complexity summary\n"
        f"Do NOT provide full implementation code."
    )
    return _chat([{"role": "system", "content": SYSTEM_PROMPT}, {"role": "user", "content": user_content}])


def get_complexity_response(problem_title: str, rag_context: str = "") -> str:
    """
    Provides an in-depth analysis of Time and Space complexity.
    """
    user_content = ""
    if rag_context:
        user_content += f"## Relevant Knowledge Base Context\n\n{rag_context}\n\n---\n\n"
    user_content += (
        f"## Student Request\n\n"
        f"Provide a thorough Big-O Complexity Analysis for **{problem_title}**.\n"
        f"Include:\n"
        f"1. ⏱️ **Time Complexity**: Optimal vs Brute Force with mathematical justification\n"
        f"2. 💾 **Space Complexity**: Auxiliary data structures and stack frame overhead\n"
        f"3. 🎯 **Trade-offs**: Explain if there is any time-space trade-off available"
    )
    return _chat([{"role": "system", "content": SYSTEM_PROMPT}, {"role": "user", "content": user_content}])


def get_mistakes_response(problem_title: str, rag_context: str = "") -> str:
    """
    Highlights common pitfalls, traps, and tricky edge cases for a problem.
    """
    user_content = ""
    if rag_context:
        user_content += f"## Relevant Knowledge Base Context\n\n{rag_context}\n\n---\n\n"
    user_content += (
        f"## Student Request\n\n"
        f"What are the most common mistakes, edge cases, and pitfalls students encounter when solving **{problem_title}**?\n"
        f"List:\n"
        f"1. ⚠️ Top 3-4 Common Implementation Mistakes\n"
        f"2. 🧪 Tricky Edge Cases to test (e.g. empty inputs, single element, duplicates, negative numbers)\n"
        f"3. 🛡️ How to guard against these bugs in an interview setting"
    )
    return _chat([{"role": "system", "content": SYSTEM_PROMPT}, {"role": "user", "content": user_content}])


def get_code_solution_response(problem_title: str, language: str = "Java", rag_context: str = "") -> str:
    """
    Provides clean, production-grade, well-commented solution code.
    """
    user_content = ""
    if rag_context:
        user_content += f"## Relevant Knowledge Base Context\n\n{rag_context}\n\n---\n\n"
    user_content += (
        f"## Student Request\n\n"
        f"Provide the complete, optimal solution code for **{problem_title}** in **{language}**.\n"
        f"Include:\n"
        f"1. 💻 Clean, commented code using standard competitive programming conventions\n"
        f"2. 📝 Line-by-line explanation of critical lines\n"
        f"3. 📊 Final Time and Space Complexity"
    )
    return _chat([{"role": "system", "content": SYSTEM_PROMPT}, {"role": "user", "content": user_content}])

