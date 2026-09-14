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


def _chat(messages: list[dict]) -> str:
    """
    Internal helper — sends a list of messages to Groq and returns the reply.
    """
    try:
        response = _client.chat.completions.create(
            model=GROQ_MODEL,
            messages=messages,
            temperature=0.7,
            max_tokens=2048,
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"[Groq Error] {e}")
        return (
            "I'm having trouble connecting to the AI backend right now. "
            "Please check that your **GROQ_API_KEY** is set correctly in `backend/.env` and try again.\n\n"
            "Get a free API key at: https://console.groq.com"
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
