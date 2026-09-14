"""
llm_service.py
--------------
Handles all communication with the Google Gemini LLM.
Uses prompt engineering to constrain the AI to act as a
structured competitive-programming tutor.
"""

import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# ── Configure Gemini API ──────────────────────────────────────────────────────
API_KEY = os.getenv("GEMINI_API_KEY")
if API_KEY:
    genai.configure(api_key=API_KEY)

# ── Master System Prompt (Prompt Engineering) ────────────────────────────────
SYSTEM_PROMPT = """You are JARVIS — an AI tutor specialized exclusively in competitive programming and LeetCode problem-solving.

Your PRIMARY goal is to TEACH, not to immediately reveal answers.

## Behaviour Rules
1. NEVER dump the complete solution immediately unless the student explicitly asks for "the code" or "the full solution".
2. Always begin by confirming your understanding of what the student is asking.
3. Guide students using the Socratic method: ask leading questions when appropriate.
4. Structure every substantive response using these sections (include only relevant ones):

   ### 🧠 Problem Understanding
   Restate the problem simply in your own words.

   ### 🔑 Key Observation
   Point out the critical insight that unlocks the solution.

   ### 💡 Hint
   Provide a gentle nudge (increase detail if student asks for another hint).

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


def get_tutor_response(user_message: str, rag_context: str = "") -> str:
    """
    Generates a tutoring response from Gemini.

    Args:
        user_message: The student's question or message.
        rag_context: Optional context retrieved from the RAG vector database.

    Returns:
        A formatted string response from the AI tutor.
    """
    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        system_instruction=SYSTEM_PROMPT
    )

    # Build the full prompt
    prompt_parts = []

    if rag_context:
        prompt_parts.append(
            f"## Relevant Knowledge Base Context\n\n{rag_context}\n\n---\n"
        )

    prompt_parts.append(f"## Student Question\n\n{user_message}")
    final_prompt = "\n".join(prompt_parts)

    try:
        response = model.generate_content(final_prompt)
        return response.text
    except Exception as e:
        print(f"[LLM Error] {e}")
        return (
            "I'm having trouble connecting to the AI backend right now. "
            "Please check that your GEMINI_API_KEY is set correctly and try again."
        )


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
        1: "a very gentle nudge — just point to what data structure or pattern to think about",
        2: "a stronger hint — explain the key observation or insight needed",
        3: "a near-complete approach — explain the algorithm step-by-step without code",
    }
    hint_desc = hint_descriptions.get(hint_level, hint_descriptions[1])

    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        system_instruction=SYSTEM_PROMPT
    )

    prompt = ""
    if rag_context:
        prompt += f"## Relevant Knowledge Base Context\n\n{rag_context}\n\n---\n"

    prompt += (
        f"## Student Request\n\n"
        f"The student is stuck on the LeetCode problem: **{problem_title}**.\n"
        f"They have asked for Hint Level {hint_level}. "
        f"Provide {hint_desc}. Do NOT provide the full solution."
    )

    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"[LLM Hint Error] {e}")
        return "Sorry, I couldn't generate a hint right now. Please try again."
