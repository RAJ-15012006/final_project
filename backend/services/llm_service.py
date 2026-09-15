"""
llm_service.py
--------------
Handles communication with the Groq LLM API.
Enforces the 5-Stage Progressive Hint and Pedagogical Tutoring Pipeline:
  - 5 Levels of Progressive Hints (from gentle conceptual nudge to step-by-step logic)
  - Full Algorithmic Approach (unlocked when hints are exhausted)
  - Clean Solution Code (only when approach has been reviewed)
  - Next Action & Next Question Recommendation from the platform's catalog
  - Guidance on project tabs (Gaming Room, Topic-Wise Mistakes, Company Patterns, etc.)
"""

import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

# ── Groq Client ───────────────────────────────────────────────────────────────
_client = Groq(api_key=os.getenv("GROQ_API_KEY", ""))

# Default model supported on this account
GROQ_MODEL = os.getenv("GROQ_MODEL", "qwen/qwen3.8-27b")

# ── Available Platform Tabs ───────────────────────────────────────────────────
PROJECT_TABS = """
The platform contains the following accessible tabs for the student:
- /dashboard : User profile, current streak, problems solved stats
- /problems : Complete catalog of 60 LeetCode problems (Array, DP, Stack, Trees, Graphs, etc.)
- /problem/:id : Interactive coding workspace with code editor, test runner, and JARVIS AI tutor
- /gaming-room : 1v1 Live Coding Arena & Head-to-Head challenges with leaderboard points
- /company-patterns : FAANG & Top Tech company-specific coding patterns
- /problem-wise-notes : Curated problem notes and algorithmic breakdowns
- /premium-notes : Comprehensive DSA cheatsheets and core theory
- /topic-wise-mistakes : Common pitfalls, antipatterns, and bug traps categorized by DSA topic
- /interview-simulator : AI-powered mock interview environment
"""

# ── Master System Prompt (Prompt Engineering) ─────────────────────────────────
SYSTEM_PROMPT = f"""You are JARVIS — an elite AI tutor specialized exclusively in competitive programming and LeetCode problem-solving.

YOUR CORE PEDAGOGICAL PHILOSOPHY:
You TEACH students how to THINK, instead of spoon-feeding them answers.
A student will NOT learn if they are immediately handed the final solution.

## STRICT BEHAVIOR RULES
1. **NEVER provide the direct code answer immediately!**
   - Whether the user asks "Give me the answer", "Solve this", or "Give me the code", you must decline to immediately dump the code.
   - Instead, guide them through the 5 progressive hint stages first, then explain the approach, and only provide code once they have worked through the intuition.

2. **5-Stage Progressive Hint Framework**:
   - **Hint 1/5 (Conceptual Nudge)**: Point out what broad data structure or pattern to consider. Zero algorithm details.
   - **Hint 2/5 (Key Observation)**: Reveal the critical problem invariant or mathematical insight.
   - **Hint 3/5 (Overcoming Brute Force)**: Explain why a naive approach is inefficient and what redundant work can be pruned.
   - **Hint 4/5 (Algorithmic Framework)**: Outline the state variables, pointers, or transitions to maintain.
   - **Hint 5/5 (Near-Solution Logic)**: Walk through the exact decision rules and edge cases in plain English (still NO code).

3. **Approach Stage**:
   - Unlocked after the 5 hints or when the student is completely stuck.
   - Detail the full algorithmic intuition, step-by-step logic, and Big-O Time/Space complexity.

4. **Code Solution Stage**:
   - Provided only after hints/approach have been explored.
   - Provide clean, well-commented code in the requested language (Java, Python, C++).

5. **NEXT STEP & NEXT QUESTION RECOMMENDATION (Mandatory in every final response)**:
   Whenever you finish explaining an approach or solution code, you MUST always include:
   - 🎯 **Your Immediate Next Step**: What the student should do right now in the editor (e.g. implement it, test with an edge case like empty string).
   - 🚀 **Recommended Next Question**: Suggest the logical NEXT problem from the platform catalog (with problem ID and title) to reinforce the learned pattern.
   - 🧭 **Explore Platform Tabs**: Direct the student to relevant tabs:
     - Visit `/topic-wise-mistakes` to see common pitfalls for this topic
     - Try `/gaming-room` to battle a peer on this topic
     - Check `/company-patterns` for FAANG interview frequency

{PROJECT_TABS}

6. Use clean, professional **Markdown formatting** with KaTeX math ($O(N)$) for readability.
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
    Generates an open-ended tutoring response adhering strictly to pedagogical guidance.
    """
    user_content = ""
    if rag_context:
        user_content += f"## Relevant Knowledge Base Context\n\n{rag_context}\n\n---\n\n"
    user_content += (
        f"## Student Message\n\n{user_message}\n\n"
        "Remember: DO NOT reveal the final code solution if they are asking for initial help. "
        "Guide them Socratically or give them the appropriate hint level (1-5)."
    )

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
    Provides a progressive hint across 5 distinct levels.
    """
    hint_descriptions = {
        1: (
            "Hint 1/5 (Conceptual Nudge): Just point to the general data structure or pattern to consider "
            "(e.g., Stack, Two Pointers, Sliding Window, DP). Do NOT reveal the algorithm or approach."
        ),
        2: (
            "Hint 2/5 (Key Observation): Reveal the underlying mathematical or structural invariant in the problem. "
            "What property must hold true for valid elements? Still do not provide the full algorithm."
        ),
        3: (
            "Hint 3/5 (Overcoming Brute Force): Explain what redundant work a naive approach does and how "
            "to prune or avoid checking unnecessary states."
        ),
        4: (
            "Hint 4/5 (Algorithmic Framework): Outline the state variables, pointers, or data structures needed "
            "and what each stores during traversal. No code."
        ),
        5: (
            "Hint 5/5 (Near-Solution Logic): Walk through the step-by-step decision rules and edge case handling "
            "in plain language. Tell the student that if they are still stuck after this, they can click 'Approach'."
        ),
    }
    hint_desc = hint_descriptions.get(hint_level, hint_descriptions[1])

    user_content = ""
    if rag_context:
        user_content += f"## Relevant Knowledge Base Context\n\n{rag_context}\n\n---\n\n"
    user_content += (
        f"## Student Request\n\n"
        f"The student is working on: **{problem_title}**.\n"
        f"They requested **Hint Level {hint_level} of 5**.\n\n"
        f"Instructions: Provide {hint_desc}\n"
        f"Do NOT provide the final code solution."
    )

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user",   "content": user_content},
    ]
    return _chat(messages)


def get_approach_response(problem_title: str, rag_context: str = "") -> str:
    """
    Explains the optimal algorithmic approach, immediate next step, and next question suggestion.
    """
    approach_system = (
        "You are JARVIS. The student has explored the progressive hints and now needs the "
        "complete algorithmic approach. Explain the intuition and algorithm clearly in plain English (no code). "
        "Always conclude with their immediate next step and recommended next problem link [Problem Title](/problem/:id)."
    )
    user_content = ""
    if rag_context:
        user_content += f"## Relevant Knowledge Base Context\n\n{rag_context}\n\n---\n\n"
    user_content += (
        f"## Student Request\n\n"
        f"Explain the recommended approach and algorithmic intuition for **{problem_title}**.\n\n"
        f"Structure your response with:\n"
        f"1. 🧠 **Core Problem Intuition**\n"
        f"2. 🔑 **Key Observations**\n"
        f"3. ⚡ **Step-by-Step Algorithm Walkthrough** (plain language, NO final code)\n"
        f"4. 📊 **Complexity Summary** (Time & Space)\n"
        f"5. 🎯 **Your Immediate Next Step**: What the student should implement right now\n"
        f"6. 🚀 **Recommended Next Question**: Pick the best next question from our 60 problems catalog "
        f"(give problem title & link like `[Problem Title](/problem/:id)`)\n"
        f"7. 🧭 **Recommended Tab**: Suggest a relevant tab like `[Topic-Wise Mistakes](/topic-wise-mistakes)` or `[1v1 Gaming Room](/gaming-room)`"
    )
    return _chat([{"role": "system", "content": approach_system}, {"role": "user", "content": user_content}])


def get_complexity_response(problem_title: str, rag_context: str = "") -> str:
    """
    Provides Big-O complexity breakdown.
    """
    user_content = ""
    if rag_context:
        user_content += f"## Relevant Knowledge Base Context\n\n{rag_context}\n\n---\n\n"
    user_content += (
        f"## Student Request\n\n"
        f"Provide a Big-O Complexity Analysis for **{problem_title}**.\n"
        f"Include:\n"
        f"1. ⏱️ **Time Complexity**: Optimal vs Brute Force with brief justification\n"
        f"2. 💾 **Space Complexity**: Auxiliary data structures and stack frame overhead\n"
        f"3. 🎯 **Trade-offs**: Time-space trade-offs if applicable"
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
        f"1. ⚠️ Top 3 Common Implementation Pitfalls\n"
        f"2. 🧪 Tricky Edge Cases to test\n"
        f"3. 🛡️ Guardrail checks to write before coding"
    )
    return _chat([{"role": "system", "content": SYSTEM_PROMPT}, {"role": "user", "content": user_content}])


INTERVIEW_SYSTEM_PROMPT = """You are JARVIS — a senior technical interviewer at a top-tier tech company (Google/Meta/Amazon level).
You are conducting a REAL mock interview session with a candidate.

## YOUR STRICT INTERVIEWER BEHAVIOR RULES:

1. **Start** each fresh session by introducing yourself and asking the candidate's name and which role/company they are preparing for.
2. **Ask one technical question at a time.** Wait for the candidate's answer before proceeding.
3. **Cross-question aggressively**: After every answer, ask follow-ups like:
   - "Why did you choose this approach over X?"
   - "What is the time and space complexity?"
   - "How would this scale to 1 million records?"
   - "What edge cases would break your solution?"
   - "Can you optimize this further?"
4. **Adapt difficulty**: Start with a medium-level DSA/system design question. If the candidate answers well, increase difficulty. If they struggle, offer a gentle nudge.
5. **Cover multiple areas**: Rotate through DSA (arrays, trees, DP, graphs), system design, CS fundamentals, and behavioral questions naturally.
6. **Give real feedback after each answer**: Be specific — praise what was good and point out what was weak or missing.
7. **End the interview** when the candidate says "end interview" or after 8-10 exchanges — provide a final report card:
   - Overall Rating: X/10
   - Strengths observed
   - Areas to improve
   - Recommended topics to study
8. **Never tutor** — you are an interviewer, not a teacher. Don't give away answers; probe and challenge.
9. **Keep responses concise** and professional. Use markdown formatting.
"""


def get_interview_response(conversation_history: list[dict]) -> str:
    """
    Drives a multi-turn mock interview session.
    conversation_history is a list of {"role": "user"/"assistant", "content": "..."} dicts.
    """
    messages = [{"role": "system", "content": INTERVIEW_SYSTEM_PROMPT}] + conversation_history
    return _chat(messages, max_tokens=600)


def get_code_solution_response(problem_title: str, language: str = "Java", rag_context: str = "") -> str:
    """
    Provides clean solution code, immediate next step, and next question recommendation.
    """
    code_system = (
        "You are JARVIS. The student has already completed all 5 progressive hints and reviewed "
        "the algorithmic approach. Now provide the complete, optimal, beautifully commented solution code "
        "in the requested language. You MUST provide the actual implementation code, explain the critical lines, "
        "specify their immediate next step in the code editor, recommend their NEXT problem with a Markdown link "
        "like [Problem Title](/problem/:id) from the catalog, and suggest a platform tab to explore."
    )
    user_content = ""
    if rag_context:
        user_content += f"## Relevant Knowledge Base Context\n\n{rag_context}\n\n---\n\n"
    user_content += (
        f"## Student Request\n\n"
        f"Provide the complete, optimal solution code for **{problem_title}** in **{language}**.\n\n"
        f"Include:\n"
        f"1. 💻 **Clean Solution Code** with clear comments\n"
        f"2. 📝 **Key Implementation Notes** (2-3 bullet points)\n"
        f"3. 🎯 **Your Immediate Next Step**: What to do in the editor right now (type it, test with custom input)\n"
        f"4. 🚀 **Recommended Next Question**: Suggest the best related problem from our 60 problem catalog "
        f"(with link `[Problem Title](/problem/:id)`)\n"
        f"5. 🧭 **Explore Tabs**: Suggest an applicable tab like `[Topic-Wise Mistakes](/topic-wise-mistakes)` or `[1v1 Gaming Room](/gaming-room)`"
    )
    return _chat([{"role": "system", "content": code_system}, {"role": "user", "content": user_content}])
