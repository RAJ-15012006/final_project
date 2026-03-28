import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { useAuth } from './AuthContext';

const ProgressContext = createContext(null);

export const ProgressProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [solvedHistory, setSolvedHistory] = useState([]);

  // Load progress when user changes
  useEffect(() => {
    const fetchProgress = async () => {
      if (user && token) {
        try {
          const res = await fetch('http://127.0.0.1:8000/api/progress/', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setSolvedHistory(data);
          } else {
            console.error("Failed to fetch progress from API");
            setSolvedHistory([]);
          }
        } catch (err) {
          console.error("Failed to connect to progress API:", err);
          setSolvedHistory([]);
        }
      } else {
        setSolvedHistory([]);
      }
    };
    fetchProgress();
  }, [user, token]);

  // Derived state for solved problem IDs
  const solvedProblems = useMemo(() => solvedHistory.map(item => item.problemId), [solvedHistory]);

  // Streak logic
  const { currentStreak, longestStreak, activityMap } = useMemo(() => {
    const activity = {};
    solvedHistory.forEach(item => {
      const dateKey = item.solvedAt.split('T')[0];
      activity[dateKey] = true;
    });

    // Simple streak calculation
    let current = 0;
    let longestStore = 0;
    let tempStreak = 0;
    
    // Sort unique dates descending
    const dates = Object.keys(activity).sort((a, b) => b.localeCompare(a));
    
    // Check current streak (consecutive days including today or starting from yesterday)
    const today = new Date().toISOString().split('T')[0];
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = yesterdayDate.toISOString().split('T')[0];
    
    let checkDate = activity[today] ? today : (activity[yesterday] ? yesterday : null);
    
    if (checkDate) {
      let d = new Date(checkDate);
      while (activity[d.toISOString().split('T')[0]]) {
        current++;
        d.setDate(d.getDate() - 1);
      }
    }

    // Longest streak calculation across all time
    const sortedDatesAsc = [...dates].reverse();
    if (sortedDatesAsc.length > 0) {
      let lastDate = new Date(sortedDatesAsc[0]);
      tempStreak = 1;
      longestStore = 1;
      
      for (let i = 1; i < sortedDatesAsc.length; i++) {
        const currDate = new Date(sortedDatesAsc[i]);
        const diffDays = Math.round((currDate - lastDate) / 86400000);
        
        if (diffDays === 1) {
          tempStreak++;
        } else if (diffDays > 1) {
          tempStreak = 1;
        }
        longestStore = Math.max(longestStore, tempStreak);
        lastDate = currDate;
      }
    }

    return { 
      currentStreak: current, 
      longestStreak: longestStore, 
      activityMap: activity 
    };
  }, [solvedHistory]);

  // Mark a problem as solved
  const markAsSolved = async (problemId) => {
    if (!user || !token) return;
    
    // Optimistic UI update
    const newItem = { problemId, solvedAt: new Date().toISOString() };
    setSolvedHistory(prev => {
      if (prev.find(item => item.problemId === problemId)) return prev;
      return [...prev, newItem];
    });

    try {
      const res = await fetch('http://127.0.0.1:8000/api/progress/solved', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ problemId })
      });
      if (!res.ok) {
        console.error("Failed to save progress on server");
      }
    } catch (err) {
      console.error("Error saving progress:", err);
    }
  };

  const isSolved = (problemId) => solvedProblems.includes(problemId);

  return (
    <ProgressContext.Provider value={{ 
      solvedProblems, 
      markAsSolved, 
      isSolved,
      totalSolvedCount: solvedProblems.length,
      streak: currentStreak,
      longestStreak,
      activityMap
    }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => useContext(ProgressContext);
