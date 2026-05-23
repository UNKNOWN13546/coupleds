import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import questions from '../data/questions';

const CoupleContext = createContext(null);

const STORAGE_KEY = 'coupled_app_state';

const generateCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
};

const getToday = () => new Date().toISOString().split('T')[0];

const getDayOfYear = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

const initialState = {
  isOnboarded: false,
  coupleCode: generateCode(),
  partnerA: { name: '' },
  partnerB: { name: '' },
  activePartner: 'A',
  theme: 'rose',
  anniversary: null,
  coupleName: '',
  dailyAnswers: {},
  activeChallenges: {},
  memories: [],
  quizResults: { A: null, B: null },
  streak: 0,
  totalQuestionsAnswered: 0,
  totalChallengesCompleted: 0,
  longestStreak: 0,
};

function calculateStreak(dailyAnswers) {
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    const entry = dailyAnswers[key];
    if (entry && entry.answerA && entry.answerB) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }
  return streak;
}

function reducer(state, action) {
  switch (action.type) {
    case 'COMPLETE_ONBOARDING': {
      const { partnerAName, partnerBName, coupleName, anniversary } = action.payload;
      return {
        ...state,
        isOnboarded: true,
        partnerA: { name: partnerAName },
        partnerB: { name: partnerBName },
        coupleName: coupleName || `${partnerAName} & ${partnerBName}`,
        anniversary: anniversary || null,
      };
    }
    case 'SWITCH_PARTNER':
      return { ...state, activePartner: state.activePartner === 'A' ? 'B' : 'A' };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SUBMIT_ANSWER': {
      const { date, answer } = action.payload;
      const existing = state.dailyAnswers[date] || { question: getTodayQuestionStatic() };
      const key = state.activePartner === 'A' ? 'answerA' : 'answerB';
      const updated = { ...existing, [key]: answer };
      const newAnswers = { ...state.dailyAnswers, [date]: updated };
      const newStreak = calculateStreak(newAnswers);
      const totalAnswered = Object.values(newAnswers).reduce((acc, e) => {
        return acc + (e.answerA ? 1 : 0) + (e.answerB ? 1 : 0);
      }, 0);
      return {
        ...state,
        dailyAnswers: newAnswers,
        streak: newStreak,
        longestStreak: Math.max(state.longestStreak, newStreak),
        totalQuestionsAnswered: totalAnswered,
      };
    }
    case 'START_CHALLENGE': {
      const { packId } = action.payload;
      return {
        ...state,
        activeChallenges: {
          ...state.activeChallenges,
          [packId]: { startDate: getToday(), completedDays: [] },
        },
      };
    }
    case 'COMPLETE_CHALLENGE': {
      const { packId, dayNumber } = action.payload;
      const pack = state.activeChallenges[packId];
      if (!pack) return state;
      const completedDays = pack.completedDays.includes(dayNumber)
        ? pack.completedDays
        : [...pack.completedDays, dayNumber];
      return {
        ...state,
        activeChallenges: {
          ...state.activeChallenges,
          [packId]: { ...pack, completedDays },
        },
        totalChallengesCompleted: state.totalChallengesCompleted + (pack.completedDays.includes(dayNumber) ? 0 : 1),
      };
    }
    case 'ADD_MEMORY': {
      const memory = { ...action.payload, id: Date.now(), date: action.payload.date || getToday() };
      return { ...state, memories: [memory, ...state.memories] };
    }
    case 'DELETE_MEMORY':
      return { ...state, memories: state.memories.filter(m => m.id !== action.payload) };
    case 'SAVE_QUIZ_RESULTS': {
      const key = state.activePartner;
      return { ...state, quizResults: { ...state.quizResults, [key]: action.payload } };
    }
    case 'UPDATE_COUPLE_INFO': {
      const { coupleName, anniversary } = action.payload;
      return { ...state, coupleName: coupleName ?? state.coupleName, anniversary: anniversary ?? state.anniversary };
    }
    case 'RESET':
      return { ...initialState, coupleCode: generateCode() };
    case 'LOAD':
      return { ...initialState, ...action.payload };
    default:
      return state;
  }
}

function getTodayQuestionStatic() {
  const idx = getDayOfYear() % questions.length;
  return questions[idx];
}

export function CoupleProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...init, ...parsed };
      }
    } catch (e) { /* ignore */ }
    return init;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) { /* ignore */ }
  }, [state]);

  useEffect(() => {
    if (state.theme === 'rose') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', state.theme);
    }
  }, [state.theme]);

  const completeOnboarding = useCallback((partnerAName, partnerBName, coupleName, anniversary) => {
    dispatch({ type: 'COMPLETE_ONBOARDING', payload: { partnerAName, partnerBName, coupleName, anniversary } });
  }, []);

  const switchPartner = useCallback(() => dispatch({ type: 'SWITCH_PARTNER' }), []);
  const setTheme = useCallback((t) => dispatch({ type: 'SET_THEME', payload: t }), []);

  const submitAnswer = useCallback((date, answer) => {
    dispatch({ type: 'SUBMIT_ANSWER', payload: { date, answer } });
  }, []);

  const getTodayQuestion = useCallback(() => getTodayQuestionStatic(), []);

  const startChallenge = useCallback((packId) => {
    dispatch({ type: 'START_CHALLENGE', payload: { packId } });
  }, []);

  const completeChallenge = useCallback((packId, dayNumber) => {
    dispatch({ type: 'COMPLETE_CHALLENGE', payload: { packId, dayNumber } });
  }, []);

  const addMemory = useCallback((memory) => {
    dispatch({ type: 'ADD_MEMORY', payload: memory });
  }, []);

  const deleteMemory = useCallback((id) => {
    dispatch({ type: 'DELETE_MEMORY', payload: id });
  }, []);

  const saveQuizResults = useCallback((results) => {
    dispatch({ type: 'SAVE_QUIZ_RESULTS', payload: results });
  }, []);

  const updateCoupleInfo = useCallback((info) => {
    dispatch({ type: 'UPDATE_COUPLE_INFO', payload: info });
  }, []);

  const resetAll = useCallback(() => dispatch({ type: 'RESET' }), []);

  const value = {
    ...state,
    completeOnboarding,
    switchPartner,
    setTheme,
    submitAnswer,
    getTodayQuestion,
    startChallenge,
    completeChallenge,
    addMemory,
    deleteMemory,
    saveQuizResults,
    updateCoupleInfo,
    resetAll,
    getToday,
  };

  return <CoupleContext.Provider value={value}>{children}</CoupleContext.Provider>;
}

export function useCouple() {
  const ctx = useContext(CoupleContext);
  if (!ctx) throw new Error('useCouple must be used within CoupleProvider');
  return ctx;
}

export default CoupleContext;
