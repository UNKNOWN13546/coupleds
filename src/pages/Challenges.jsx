import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCouple } from '../context/CoupleContext';
import challengePacks from '../data/challenges';
import Confetti from '../components/Confetti';
import './Challenges.css';

export default function Challenges() {
  const navigate = useNavigate();
  const ctx = useCouple();
  const { activeChallenges, startChallenge, completeChallenge } = ctx;
  const [selectedPack, setSelectedPack] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const pack = selectedPack ? challengePacks.find(p => p.id === selectedPack) : null;
  const packProgress = selectedPack ? activeChallenges[selectedPack] : null;
  const completedDays = packProgress?.completedDays || [];
  const isStarted = !!packProgress;
  const isCompleted = pack && completedDays.length >= pack.challenges.length;

  const handleStartPack = () => {
    startChallenge(selectedPack);
  };

  const handleCompleteDay = (day) => {
    completeChallenge(selectedPack, day);
    if (completedDays.length + 1 >= pack.challenges.length) {
      setShowConfetti(true);
    }
  };

  const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="page">
      <Confetti show={showConfetti} />

      <AnimatePresence mode="wait">
        {!selectedPack ? (
          /* Pack Browser */
          <motion.div key="browser" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="page-header">
              <button className="back-btn" onClick={() => navigate('/')}>←</button>
              <span className="page-header-title">Challenge Packs 🔥</span>
            </div>
            <div className="page-content">
              <p className="text-muted mb-lg">Complete 7-day challenges together to strengthen your bond</p>
              <div className="challenge-grid">
                {challengePacks.map((p, i) => {
                  const prog = activeChallenges[p.id];
                  const done = prog && prog.completedDays.length >= p.challenges.length;
                  const active = prog && !done;
                  return (
                    <motion.div key={p.id} className="challenge-pack-card card"
                      variants={item} initial="hidden" animate="show"
                      transition={{ delay: i * 0.06 }}
                      onClick={() => setSelectedPack(p.id)}
                      style={{ '--pack-color': p.color }}
                    >
                      <div className="pack-accent" style={{ background: p.color }} />
                      <span className="pack-emoji">{p.emoji}</span>
                      <h4 className="pack-title">{p.title}</h4>
                      <p className="text-xs text-muted">{p.description.slice(0, 60)}...</p>
                      <div className="pack-footer">
                        <span className="text-xs text-muted">{p.challenges.length} days</span>
                        {done && <span className="badge badge-success">✅ Done</span>}
                        {active && <span className="badge badge-primary">Active</span>}
                      </div>
                      {active && (
                        <div className="progress-bar mt-sm">
                          <div className="progress-fill" style={{ width: `${(prog.completedDays.length / p.challenges.length) * 100}%` }} />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ) : (
          /* Pack Detail */
          <motion.div key="detail" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
            <div className="page-header">
              <button className="back-btn" onClick={() => { setSelectedPack(null); setShowConfetti(false); }}>←</button>
              <span className="page-header-title">{pack.emoji} {pack.title}</span>
            </div>
            <div className="page-content">
              <div className="pack-detail-header" style={{ '--pack-color': pack.color }}>
                <span className="pack-detail-emoji">{pack.emoji}</span>
                <p className="text-muted">{pack.description}</p>
                {isStarted && (
                  <div className="progress-bar mt-md">
                    <div className="progress-fill" style={{ width: `${(completedDays.length / pack.challenges.length) * 100}%`, background: pack.color }} />
                  </div>
                )}
                <p className="text-xs text-muted mt-sm">{completedDays.length} / {pack.challenges.length} completed</p>
              </div>

              {!isStarted && (
                <button className="btn btn-primary btn-full mt-lg" onClick={handleStartPack}>
                  Start This Pack 🚀
                </button>
              )}

              <div className="challenge-list mt-lg">
                {pack.challenges.map((c) => {
                  const isDone = completedDays.includes(c.day);
                  const isNext = isStarted && !isDone && completedDays.length === c.day - 1;
                  return (
                    <motion.div key={c.id}
                      className={`challenge-item ${isDone ? 'done' : ''} ${isNext ? 'next' : ''}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: c.day * 0.05 }}
                    >
                      <div className="challenge-day-badge" style={{ background: isDone ? pack.color : 'var(--bg-elevated)' }}>
                        {isDone ? '✓' : c.day}
                      </div>
                      <div className="challenge-item-content">
                        <h4 className={isDone ? 'line-through' : ''}>{c.title}</h4>
                        <p className="text-xs text-muted">{c.description}</p>
                      </div>
                      {isStarted && !isDone && (
                        <button className="btn btn-sm btn-primary challenge-complete-btn"
                          onClick={() => handleCompleteDay(c.day)}>
                          ✓
                        </button>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {isCompleted && (
                <div className="pack-complete-banner mt-lg">
                  <span className="emoji-big">🎉</span>
                  <h3>Pack Complete!</h3>
                  <p className="text-muted">Amazing job finishing {pack.title} together!</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
