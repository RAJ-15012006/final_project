/**
 * api.js
 * -------
 * Centralized API client for the JARVIS backend (FastAPI + Groq + RAG).
 * All frontend components should use these functions
 * instead of calling fetch() directly.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// ── AI Tutor ─────────────────────────────────────────────────────────────────

/**
 * Ask the AI tutor a general question about a problem.
 * @param {string} message - The student's question
 * @param {string|null} problemTitle - The LeetCode problem title (optional)
 * @returns {Promise<{response: string, rag_used: boolean}>}
 */
export async function askTutor(message, problemTitle = null) {
  const res = await fetch(`${BASE_URL}/api/ai/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, problem_title: problemTitle }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `API error ${res.status}`);
  }
  return res.json();
}

/**
 * Get a progressive hint for a problem at the given level (1-3).
 * @param {string} problemTitle - The LeetCode problem title
 * @param {number} hintLevel - 1 (gentle), 2 (stronger), 3 (near-approach)
 * @returns {Promise<{response: string, hint_level: number}>}
 */
export async function getHint(problemTitle, hintLevel = 1) {
  const res = await fetch(`${BASE_URL}/api/ai/hint`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ problem_title: problemTitle, hint_level: hintLevel }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `API error ${res.status}`);
  }
  return res.json();
}

/**
 * Explain the algorithmic approach and intuition.
 * @param {string} problemTitle - The LeetCode problem title
 * @returns {Promise<{response: string}>}
 */
export async function getApproach(problemTitle) {
  const res = await fetch(`${BASE_URL}/api/ai/approach`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ problem_title: problemTitle }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `API error ${res.status}`);
  }
  return res.json();
}

/**
 * Get Big-O complexity breakdown.
 * @param {string} problemTitle - The LeetCode problem title
 * @returns {Promise<{response: string}>}
 */
export async function getComplexity(problemTitle) {
  const res = await fetch(`${BASE_URL}/api/ai/complexity`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ problem_title: problemTitle }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `API error ${res.status}`);
  }
  return res.json();
}

/**
 * Get common mistakes and tricky edge cases.
 * @param {string} problemTitle - The LeetCode problem title
 * @returns {Promise<{response: string}>}
 */
export async function getMistakes(problemTitle) {
  const res = await fetch(`${BASE_URL}/api/ai/mistakes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ problem_title: problemTitle }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `API error ${res.status}`);
  }
  return res.json();
}

/**
 * Get complete solution code.
 * @param {string} problemTitle - The LeetCode problem title
 * @param {string} language - Programming language (Java, Python, C++)
 * @returns {Promise<{response: string}>}
 */
export async function getCodeSolution(problemTitle, language = "Java") {
  const res = await fetch(`${BASE_URL}/api/ai/code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ problem_title: problemTitle, language }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `API error ${res.status}`);
  }
  return res.json();
}

/**
 * Check AI backend health status.
 */
export async function checkAIHealth() {
  const res = await fetch(`${BASE_URL}/api/ai/health`);
  if (!res.ok) throw new Error("AI backend offline");
  return res.json();
}

// ── Gamification ─────────────────────────────────────────────────────────────

/**
 * Get leaderboard entries.
 * @param {number} limit - Max number of entries
 */
export async function getLeaderboard(limit = 10) {
  const res = await fetch(`${BASE_URL}/api/gamification/leaderboard?limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch leaderboard");
  return res.json();
}

/**
 * Get a user's progress.
 * @param {string} userId
 */
export async function getUserProgress(userId) {
  const res = await fetch(`${BASE_URL}/api/gamification/progress/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch progress");
  return res.json();
}

/**
 * Submit a problem attempt.
 * @param {string} userId
 * @param {string} problemTitle
 * @param {string} difficulty - "Easy" | "Medium" | "Hard"
 * @param {number} timeTakenSeconds
 * @param {boolean} isCorrect
 */
export async function submitProblem(userId, problemTitle, difficulty, timeTakenSeconds, isCorrect) {
  const res = await fetch(
    `${BASE_URL}/api/gamification/submit?user_id=${userId}&problem_title=${encodeURIComponent(problemTitle)}&difficulty=${difficulty}&time_taken_seconds=${timeTakenSeconds}&is_correct=${isCorrect}`,
    { method: "POST" }
  );
  if (!res.ok) throw new Error("Failed to submit problem");
  return res.json();
}

/**
 * Get a user's earned badges.
 * @param {string} userId
 */
export async function getUserBadges(userId) {
  const res = await fetch(`${BASE_URL}/api/gamification/badges/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch badges");
  return res.json();
}
