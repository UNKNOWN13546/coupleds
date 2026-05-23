import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCouple } from '../context/CoupleContext';
import HealthRing from '../components/HealthRing';
import StreakCalendar from '../components/StreakCalendar';
import challengePacks from '../data/challenges';
import './Insights.css';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

function AnimatedNumber({ target }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    let start = 0;
    const duration = 1200;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target]);
  return <span>{current}</span>;
}

export default function Insights() {
  const navigate = useNavigate();
  const ctx = useCouple();
  const {
    streak, longestStreak, totalQuestionsAnswered, totalChallengesCompleted,
    memories, dailyAnswers, quizResults, anniversary, activeChallenges
  } = ctx;

  // Health score calculation
  const streakScore = Math.min(streak * 5, 30);
  const questionScore = Math.min(totalQuestionsAnswered * 2, 25);
  const challengeScore = Math.min(totalChallengesCompleted * 3, 25);
  const quizScore = (quizResults.A ? 10 : 0) + (quizResults.B ? 10 : 0);
  const healthScore = Math.min(streakScore + questionScore + challengeScore + quizScore, 100);

  // Days together
  const daysTogether = anniversary
    ? Math.floor((Date.now() - new Date(anniversary).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  // Suggestions
  const suggestions = [];
  if (!quizResults.A || !quizResults.B) {
    suggestions.push({ emoji: '🧠', title: 'Take the Quiz', desc: 'Complete the compatibility quiz together', path: '/quiz' });
  }
  if (totalChallengesCompleted < 7) {
    suggestions.push({ emoji: '🔥', title: 'Start a Challenge', desc: 'Try a 7-day challenge pack', path: '/challenges' });
  }
  if (memories.length < 3) {
    suggestions.push({ emoji: '📸', title: 'Add Memories', desc: 'Start building your photo timeline', path: '/memories' });
  }

  // Recent activity
  const recentActivity = [];
  const sortedDates = Object.entries(dailyAnswers)
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 3);
  sortedDates.forEach(([date, entry]) => {
    if (entry.answerA && entry.answerB) {
      recentActivity.push({ emoji: '💬', text: 'Both answered the daily question', time: date });
    } else if (entry.answerA || entry.answerB) {
      recentActivity.push({ emoji: '💭', text: 'One partner answered today\'s question', time: date });
    }
  });
  memories.slice(0, 2).forEach(m => {
    recentActivity.push({ emoji: '📸', text: `Memory added: ${m.caption?.slice(0, 30)}...`, time: m.date });
  });

  const stats = [
    { emoji: '💬', value: totalQuestionsAnswered, label: 'Questions Answered' },
    { emoji: '🏆', value: totalChallengesCompleted, label: 'Challenges Done' },
    { emoji: '📸', value: memories.length, label: 'Memories Created' },
    { emoji: '❤️', value: daysTogether >= 0 ? daysTogether : 0, label: 'Days Together' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/')}>←</button>
        <span className="page-header-title">Insights 📊</span>
      </div>

      <motion.div className="page-content" variants={container} initial="hidden" animate="show">
        {/* Health Ring */}
        <motion.div className="insights-health text-center" variants={item}>
          <HealthRing value={healthScore} size={180} />
          <p className="text-xs text-muted mt-md">Based on your activity and engagement</p>
        </motion.div>

        {/* Streak Calendar */}
        <motion.div className="card mt-lg" variants={item}>
          <div className="section-header">
            <span className="section-title">Activity Calendar</span>
          </div>
          <StreakCalendar dailyAnswers={dailyAnswers} />
          <div className="streak-badges mt-md">
            <div className="streak-badge-item">
              <span className="streak-badge-num gradient-text">{streak}</span>
              <span className="text-xs text-muted">Current</span>
            </div>
            <div className="streak-badge-item">
              <span className="streak-badge-num" style={{ color: 'var(--color-warning)' }}>{longestStreak}</span>
              <span className="text-xs text-muted">Longest</span>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={item}>
          <div className="section-header mt-lg">
            <span className="section-title">Your Stats</span>
          </div>
          <div className="stats-grid">
            {stats.map((s, i) => (
              <div key={i} className="stat-card card">
                <span className="stat-emoji">{s.emoji}</span>
                <span className="stat-value gradient-text"><AnimatedNumber target={s.value} /></span>
                <span className="stat-label text-xs text-muted">{s.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <motion.div variants={item}>
            <div className="section-header mt-lg">
              <span className="section-title">Areas to Explore</span>
            </div>
            <div className="suggestions-scroll">
              {suggestions.map((s, i) => (
                <div key={i} className="suggestion-card card" onClick={() => navigate(s.path)}>
                  <span style={{ fontSize: '1.5rem' }}>{s.emoji}</span>
                  <h4>{s.title}</h4>
                  <p className="text-xs text-muted">{s.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Activity Feed */}
        {recentActivity.length > 0 && (
          <motion.div variants={item}>
            <div className="section-header mt-lg">
              <span className="section-title">Recent Activity</span>
            </div>
            <div className="activity-feed">
              {recentActivity.slice(0, 5).map((a, i) => (
                <div key={i} className="activity-item">
                  <span className="activity-emoji">{a.emoji}</span>
                  <div className="activity-content">
                    <span className="text-sm">{a.text}</span>
                    <span className="text-xs text-muted">{a.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
