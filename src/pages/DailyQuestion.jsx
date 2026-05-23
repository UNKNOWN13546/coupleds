import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCouple } from '../context/CoupleContext';
import Confetti from '../components/Confetti';
import './DailyQuestion.css';

const reactions = ['❤️', '🥰', '😂', '🤔', '💯'];

export default function DailyQuestion() {
  const navigate = useNavigate();
  const ctx = useCouple();
  const { partnerA, partnerB, activePartner, dailyAnswers, submitAnswer, switchPartner, getTodayQuestion, getToday } = ctx;

  const today = getToday();
  const question = getTodayQuestion();
  const todayEntry = dailyAnswers[today] || {};
  const myAnswer = activePartner === 'A' ? todayEntry.answerA : todayEntry.answerB;
  const theirAnswer = activePartner === 'A' ? todayEntry.answerB : todayEntry.answerA;
  const currentName = activePartner === 'A' ? partnerA.name : partnerB.name;
  const partnerName = activePartner === 'A' ? partnerB.name : partnerA.name;

  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(!!myAnswer);
  const [showReveal, setShowReveal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedReactions, setSelectedReactions] = useState([]);

  const bothAnswered = !!(todayEntry.answerA && todayEntry.answerB);

  const handleSubmit = () => {
    if (!answer.trim()) return;
    submitAnswer(today, answer.trim());
    setSubmitted(true);
    if (theirAnswer) {
      setTimeout(() => {
        setShowReveal(true);
        setShowConfetti(true);
      }, 600);
    }
  };

  const handleReveal = () => {
    setShowReveal(true);
    setShowConfetti(true);
  };

  const toggleReaction = (r) => {
    setSelectedReactions(prev =>
      prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]
    );
  };

  const categoryEmojis = {
    communication: '💬', dreams: '✨', memories: '📸', intimacy: '💕',
    fun: '🎉', deep: '🌊', gratitude: '🙏', future: '🚀',
  };

  return (
    <div className="page dq-page">
      <Confetti show={showConfetti} />

      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/')}>←</button>
        <span className="page-header-title">Daily Question</span>
        <span className="badge badge-primary">{question?.category}</span>
      </div>

      <div className="page-content dq-content">
        <AnimatePresence mode="wait">
          {/* STATE: REVEAL */}
          {showReveal && bothAnswered ? (
            <motion.div key="reveal" className="dq-reveal"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <div className="reveal-sparkle">✨ Your Answers ✨</div>
              <div className="dq-question-mini">
                <span>{categoryEmojis[question?.category] || '💭'}</span>
                <p>{question?.text}</p>
              </div>

              <div className="reveal-cards">
                <motion.div className="reveal-card reveal-card-a"
                  initial={{ opacity: 0, rotateY: 90 }} animate={{ opacity: 1, rotateY: 0 }}
                  transition={{ delay: 0.3, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}>
                  <div className="reveal-card-header">
                    <div className="avatar" style={{ width: 32, height: 32, fontSize: '0.85rem' }}>
                      {partnerA.name[0]?.toUpperCase()}
                    </div>
                    <span className="reveal-name">{partnerA.name}</span>
                  </div>
                  <p className="reveal-answer">{todayEntry.answerA}</p>
                </motion.div>

                <motion.div className="reveal-card reveal-card-b"
                  initial={{ opacity: 0, rotateY: -90 }} animate={{ opacity: 1, rotateY: 0 }}
                  transition={{ delay: 0.6, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}>
                  <div className="reveal-card-header">
                    <div className="avatar" style={{ width: 32, height: 32, fontSize: '0.85rem', background: 'linear-gradient(135deg, #C44DFF, #6BDFFF)' }}>
                      {partnerB.name[0]?.toUpperCase()}
                    </div>
                    <span className="reveal-name">{partnerB.name}</span>
                  </div>
                  <p className="reveal-answer">{todayEntry.answerB}</p>
                </motion.div>
              </div>

              <motion.div className="reveal-reactions"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.4 }}>
                <p className="text-xs text-muted mb-sm">React to their answer</p>
                <div className="reaction-row">
                  {reactions.map(r => (
                    <button key={r} className={`reaction-btn ${selectedReactions.includes(r) ? 'active' : ''}`}
                      onClick={() => toggleReaction(r)}>
                      {r}
                    </button>
                  ))}
                </div>
              </motion.div>

              <p className="text-muted text-center mt-lg">Come back tomorrow for a new question 💕</p>
            </motion.div>

          ) : submitted && myAnswer ? (
            /* STATE: WAITING */
            <motion.div key="waiting" className="dq-waiting"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <div className="waiting-animation">
                <div className="orbit-container">
                  <span className="orbit-heart heart-1">💖</span>
                  <span className="orbit-heart heart-2">💜</span>
                </div>
              </div>
              <h3>Waiting for {partnerName}...</h3>
              <p className="text-muted">Your answer has been saved. Once {partnerName} answers, you'll both see each other's responses!</p>
              <button className="btn btn-secondary mt-lg" onClick={() => { switchPartner(); setSubmitted(false); setAnswer(''); }}>
                Switch to {partnerName} 🔄
              </button>
              {bothAnswered && (
                <button className="btn btn-primary mt-md" onClick={handleReveal}>
                  View Reveal ✨
                </button>
              )}
            </motion.div>

          ) : (
            /* STATE: ANSWER */
            <motion.div key="answer" className="dq-answer"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="dq-question-card card">
                <span className="dq-emoji">{categoryEmojis[question?.category] || '💭'}</span>
                <h2 className="dq-question-text">{question?.text}</h2>
              </div>

              <div className="dq-responding-as">
                <div className="avatar" style={{ width: 28, height: 28, fontSize: '0.75rem',
                  background: activePartner === 'A' ? 'var(--gradient-primary)' : 'linear-gradient(135deg, #C44DFF, #6BDFFF)' }}>
                  {currentName[0]?.toUpperCase()}
                </div>
                <span className="text-sm">Answering as <strong>{currentName}</strong></span>
              </div>

              <textarea
                className="input dq-textarea"
                placeholder="Be honest and thoughtful 💭"
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                rows={4}
                maxLength={500}
                autoFocus
              />
              <div className="dq-char-count text-xs text-muted">{answer.length}/500</div>

              <button className="btn btn-primary btn-lg btn-full mt-md" onClick={handleSubmit}
                disabled={!answer.trim()}>
                Submit Answer 💕
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
