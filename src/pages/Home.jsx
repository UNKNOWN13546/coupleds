import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCouple } from '../context/CoupleContext';
import challengePacks from '../data/challenges';
import './Home.css';

const tips = [
  "Small gestures of appreciation go a long way 💕",
  "Try to learn something new about your partner today ✨",
  "A 6-second hug releases bonding hormones 🤗",
  "Saying 'thank you' strengthens relationships more than 'I love you' 🙏",
  "Couples who laugh together stay together 😄",
  "Ask open-ended questions to deepen conversations 💬",
  "Quality time doesn't need to be elaborate — just be present 🌟",
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
};

export default function Home() {
  const navigate = useNavigate();
  const ctx = useCouple();
  const { coupleName, partnerA, partnerB, activePartner, streak, dailyAnswers, activeChallenges, switchPartner, getTodayQuestion, getToday } = ctx;

  const today = getToday();
  const question = getTodayQuestion();
  const todayEntry = dailyAnswers[today] || {};
  const currentName = activePartner === 'A' ? partnerA.name : partnerB.name;
  const partnerName = activePartner === 'A' ? partnerB.name : partnerA.name;
  const myAnswer = activePartner === 'A' ? todayEntry.answerA : todayEntry.answerB;
  const theirAnswer = activePartner === 'A' ? todayEntry.answerB : todayEntry.answerA;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const tipOfDay = tips[new Date().getDate() % tips.length];

  // Find active challenge
  const activePackId = Object.keys(activeChallenges).find(id => {
    const pack = challengePacks.find(p => p.id === id);
    return pack && activeChallenges[id].completedDays.length < pack.challenges.length;
  });
  const activePack = activePackId ? challengePacks.find(p => p.id === activePackId) : null;
  const activeProgress = activePackId ? activeChallenges[activePackId] : null;

  const quickActions = [
    { emoji: '🔥', title: 'Challenges', sub: '6 packs available', path: '/challenges', color: '#FF6B9D' },
    { emoji: '📸', title: 'Memories', sub: 'Photo timeline', path: '/memories', color: '#6BDFFF' },
    { emoji: '🧠', title: 'Quiz', sub: 'Compatibility test', path: '/quiz', color: '#C44DFF' },
    { emoji: '📊', title: 'Insights', sub: 'Relationship stats', path: '/insights', color: '#4DFFA0' },
  ];

  return (
    <div className="page">
      <motion.div className="page-content" variants={container} initial="hidden" animate="show">
        {/* Header */}
        <motion.div className="home-header" variants={item}>
          <div className="home-greeting">
            <h2>{greeting}, <span className="gradient-text">{coupleName}</span> ❤️</h2>
            <p className="text-muted">Let's grow closer today</p>
          </div>
          <button className="partner-switcher" onClick={switchPartner} id="partner-switcher">
            <div className="avatar" style={{ width: 38, height: 38, fontSize: '0.9rem',
              background: activePartner === 'A' ? 'var(--gradient-primary)' : 'linear-gradient(135deg, #C44DFF, #6BDFFF)' }}>
              {currentName[0]?.toUpperCase()}
            </div>
          </button>
        </motion.div>

        {/* Streak */}
        <motion.div className="streak-banner card" variants={item}>
          <div className="streak-info">
            <span className="streak-number gradient-text">{streak}</span>
            <div>
              <span className="streak-label">day streak 🔥</span>
              <p className="text-xs text-muted">Keep it going!</p>
            </div>
          </div>
          {streak > 0 && <div className="streak-flames">
            {Array.from({ length: Math.min(streak, 5) }, (_, i) => (
              <span key={i} className="streak-flame" style={{ animationDelay: `${i * 0.15}s` }}>🔥</span>
            ))}
          </div>}
        </motion.div>

        {/* Today's Question */}
        <motion.div className="today-question card" variants={item} onClick={() => navigate('/question')}>
          <div className="tq-header">
            <span className="badge badge-primary">{question?.category}</span>
            <span className="text-xs text-muted">Today</span>
          </div>
          <p className="tq-text">{question?.text}</p>
          <div className="tq-status">
            {!myAnswer ? (
              <button className="btn btn-primary btn-sm" onClick={(e) => { e.stopPropagation(); navigate('/question'); }}>
                Answer Now 💭
              </button>
            ) : !theirAnswer ? (
              <div className="tq-waiting">
                <span className="waiting-dot" />
                <span>Waiting for {partnerName}...</span>
              </div>
            ) : (
              <button className="btn btn-primary btn-sm" onClick={(e) => { e.stopPropagation(); navigate('/question'); }}>
                View Reveal ✨
              </button>
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={item}>
          <div className="section-header">
            <span className="section-title">Quick Actions</span>
          </div>
          <div className="quick-actions-grid">
            {quickActions.map((qa) => (
              <motion.div
                key={qa.path}
                className="quick-action-card card"
                onClick={() => navigate(qa.path)}
                whileTap={{ scale: 0.97 }}
                style={{ '--qa-color': qa.color }}
              >
                <span className="qa-emoji">{qa.emoji}</span>
                <span className="qa-title">{qa.title}</span>
                <span className="qa-sub text-xs text-muted">{qa.sub}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Active Challenge */}
        {activePack && (
          <motion.div variants={item}>
            <div className="section-header">
              <span className="section-title">Active Challenge</span>
              <button className="section-action" onClick={() => navigate('/challenges')}>View All</button>
            </div>
            <div className="card active-challenge-card" onClick={() => navigate('/challenges')}>
              <div className="ac-top">
                <span style={{ fontSize: '1.5rem' }}>{activePack.emoji}</span>
                <div>
                  <h4>{activePack.title}</h4>
                  <p className="text-xs text-muted">Day {activeProgress.completedDays.length + 1} of {activePack.challenges.length}</p>
                </div>
              </div>
              <div className="progress-bar mt-sm">
                <div className="progress-fill" style={{ width: `${(activeProgress.completedDays.length / activePack.challenges.length) * 100}%` }} />
              </div>
            </div>
          </motion.div>
        )}

        {/* Tip */}
        <motion.div className="tip-card card" variants={item}>
          <span className="tip-icon">💡</span>
          <p className="tip-text">{tipOfDay}</p>
        </motion.div>

      </motion.div>
    </div>
  );
}
