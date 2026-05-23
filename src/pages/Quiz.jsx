import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCouple } from '../context/CoupleContext';
import quizData from '../data/quizData';
import Confetti from '../components/Confetti';
import './Quiz.css';

const allQuestions = quizData.sections.flatMap(s => s.questions.map(q => ({ ...q, section: s.id, sectionTitle: s.title, sectionEmoji: s.emoji })));

const valueLabels = {
  secure: 'Secure', anxious: 'Anxious', avoidant: 'Avoidant', fearful: 'Fearful',
  words: 'Words of Affirmation', acts: 'Acts of Service', gifts: 'Receiving Gifts', time: 'Quality Time', touch: 'Physical Touch',
  assertive: 'Assertive', passive: 'Passive', aggressive: 'Direct', reflective: 'Reflective',
  family: 'Family First', career: 'Career Driven', adventure: 'Adventure Seeker', stability: 'Stability Lover',
};

function getMostFrequent(answers, sectionId) {
  const sectionQs = allQuestions.filter(q => q.section === sectionId);
  const counts = {};
  sectionQs.forEach(q => {
    const a = answers[q.id];
    if (a) counts[a] = (counts[a] || 0) + 1;
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || '';
}

function calcCompatibility(resultsA, resultsB) {
  if (!resultsA || !resultsB) return 0;
  const fields = ['attachment', 'loveLanguage', 'communication', 'values'];
  const matches = fields.filter(f => resultsA[f] === resultsB[f]).length;
  return Math.round((matches / fields.length) * 100);
}

export default function Quiz() {
  const navigate = useNavigate();
  const ctx = useCouple();
  const { activePartner, partnerA, partnerB, quizResults, saveQuizResults, switchPartner } = ctx;
  const currentName = activePartner === 'A' ? partnerA.name : partnerB.name;
  const partnerName = activePartner === 'A' ? partnerB.name : partnerA.name;
  const myResults = quizResults[activePartner];
  const theirResults = quizResults[activePartner === 'A' ? 'B' : 'A'];
  const bothDone = !!(quizResults.A && quizResults.B);

  const [phase, setPhase] = useState(bothDone ? 'comparison' : myResults ? 'results' : 'intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (bothDone && phase !== 'quiz') setPhase('comparison');
    else if (myResults && phase !== 'quiz') setPhase('results');
  }, [activePartner, bothDone, myResults]);

  const handleStart = () => {
    setPhase('quiz');
    setCurrentIdx(0);
    setAnswers({});
  };

  const handleSelect = (questionId, value) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    setTimeout(() => {
      if (currentIdx < allQuestions.length - 1) {
        setCurrentIdx(currentIdx + 1);
      } else {
        // Complete
        const results = {
          attachment: getMostFrequent(newAnswers, 'attachment'),
          loveLanguage: getMostFrequent(newAnswers, 'loveLanguage'),
          communication: getMostFrequent(newAnswers, 'communication'),
          values: getMostFrequent(newAnswers, 'values'),
        };
        saveQuizResults(results);
        if (theirResults) {
          setPhase('comparison');
          const compat = calcCompatibility(results, theirResults);
          if (compat >= 50) setShowConfetti(true);
        } else {
          setPhase('results');
        }
      }
    }, 500);
  };

  const compatibility = bothDone ? calcCompatibility(quizResults.A, quizResults.B) : 0;

  // Radar chart SVG
  const radarSize = 260;
  const cx = radarSize / 2, cy = radarSize / 2, r = 90;
  const axes = [
    { id: 'attachment', label: '💗 Attachment', angle: -90 },
    { id: 'loveLanguage', label: '💝 Love', angle: 0 },
    { id: 'communication', label: '🗣️ Comm', angle: 90 },
    { id: 'values', label: '🌟 Values', angle: 180 },
  ];

  const getPoint = (angle, dist) => {
    const rad = (angle * Math.PI) / 180;
    return { x: cx + dist * Math.cos(rad), y: cy + dist * Math.sin(rad) };
  };

  const getPartnerPolygon = (results) => {
    if (!results) return '';
    return axes.map(a => {
      const match = results[a.id] ? 0.8 : 0.3;
      const p = getPoint(a.angle, r * match);
      return `${p.x},${p.y}`;
    }).join(' ');
  };

  return (
    <div className="page">
      <Confetti show={showConfetti} />
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/')}>←</button>
        <span className="page-header-title">Compatibility Quiz 🧠</span>
      </div>

      <div className="page-content">
        <AnimatePresence mode="wait">
          {phase === 'intro' && (
            <motion.div key="intro" className="quiz-intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <span className="emoji-big">🧠</span>
              <h2 className="mt-md">Compatibility Quiz</h2>
              <p className="text-muted mt-sm text-center">Discover how compatible you are across 4 dimensions of your relationship</p>
              <div className="quiz-sections-preview mt-lg">
                {quizData.sections.map(s => (
                  <div key={s.id} className="quiz-section-pill card">
                    <span>{s.emoji}</span>
                    <span className="font-semibold text-sm">{s.title}</span>
                    <span className="text-xs text-muted">{s.questions.length}q</span>
                  </div>
                ))}
              </div>
              <button className="btn btn-primary btn-lg btn-full mt-lg" onClick={handleStart}>
                Start Quiz ✨
              </button>
            </motion.div>
          )}

          {phase === 'quiz' && (
            <motion.div key="quiz" className="quiz-active" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="quiz-progress-section">
                <div className="flex justify-between items-center mb-sm">
                  <span className="text-xs text-muted">Question {currentIdx + 1} of {allQuestions.length}</span>
                  <span className="badge badge-purple">{allQuestions[currentIdx].sectionEmoji} {allQuestions[currentIdx].sectionTitle}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${((currentIdx + 1) / allQuestions.length) * 100}%` }} />
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div key={currentIdx} className="quiz-question-area"
                  initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.3 }}>
                  <h3 className="quiz-question-text">{allQuestions[currentIdx].text}</h3>
                  <div className="quiz-options">
                    {allQuestions[currentIdx].options.map((opt, i) => (
                      <motion.button key={opt.value}
                        className={`quiz-option ${answers[allQuestions[currentIdx].id] === opt.value ? 'selected' : ''}`}
                        onClick={() => handleSelect(allQuestions[currentIdx].id, opt.value)}
                        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                      >
                        {opt.text}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}

          {phase === 'results' && (
            <motion.div key="results" className="quiz-results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h3>Your Results ✨</h3>
              <p className="text-muted mt-sm">{currentName}'s compatibility profile</p>
              <div className="results-cards mt-lg">
                {quizData.sections.map(s => (
                  <div key={s.id} className="result-card card">
                    <span style={{ fontSize: '1.5rem' }}>{s.emoji}</span>
                    <div>
                      <h4>{s.title}</h4>
                      <p className="gradient-text font-bold">{valueLabels[myResults?.[s.id]] || 'N/A'}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="quiz-waiting-partner mt-lg text-center">
                <p className="text-muted">Waiting for {partnerName} to complete the quiz</p>
                <button className="btn btn-secondary mt-md" onClick={() => { switchPartner(); setPhase('intro'); }}>
                  Switch to {partnerName} 🔄
                </button>
              </div>
              <button className="btn btn-ghost mt-md" onClick={handleStart}>Retake Quiz</button>
            </motion.div>
          )}

          {phase === 'comparison' && (
            <motion.div key="comparison" className="quiz-comparison" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="compat-score-section text-center">
                <motion.span className="compat-score gradient-text"
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 12, stiffness: 200 }}>
                  {compatibility}%
                </motion.span>
                <p className="font-semibold mt-sm">Compatibility Score</p>
                <p className="text-xs text-muted">{compatibility >= 75 ? 'You two are incredibly aligned! 💕' : compatibility >= 50 ? 'Great connection with room to grow! ✨' : 'Different perspectives make you stronger! 🌈'}</p>
              </div>

              {/* Radar Chart */}
              <div className="radar-container mt-lg">
                <svg width={radarSize} height={radarSize} viewBox={`0 0 ${radarSize} ${radarSize}`}>
                  {/* Grid circles */}
                  {[0.25, 0.5, 0.75, 1].map(s => (
                    <circle key={s} cx={cx} cy={cy} r={r * s} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                  ))}
                  {/* Axis lines */}
                  {axes.map(a => {
                    const p = getPoint(a.angle, r);
                    return <line key={a.id} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />;
                  })}
                  {/* Partner A polygon */}
                  <polygon points={getPartnerPolygon(quizResults.A)} fill="rgba(255,107,157,0.2)" stroke="#FF6B9D" strokeWidth="2" />
                  {/* Partner B polygon */}
                  <polygon points={getPartnerPolygon(quizResults.B)} fill="rgba(196,77,255,0.2)" stroke="#C44DFF" strokeWidth="2" />
                  {/* Axis labels */}
                  {axes.map(a => {
                    const p = getPoint(a.angle, r + 30);
                    return (
                      <text key={a.id} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
                        fill="var(--text-muted)" fontSize="11" fontFamily="var(--font-display)" fontWeight="600">
                        {a.label}
                      </text>
                    );
                  })}
                </svg>
                <div className="radar-legend">
                  <span className="radar-legend-item"><span className="legend-dot" style={{ background: '#FF6B9D' }} />{partnerA.name}</span>
                  <span className="radar-legend-item"><span className="legend-dot" style={{ background: '#C44DFF' }} />{partnerB.name}</span>
                </div>
              </div>

              {/* Section breakdown */}
              <div className="comparison-breakdown mt-lg">
                {quizData.sections.map(s => {
                  const aVal = quizResults.A?.[s.id];
                  const bVal = quizResults.B?.[s.id];
                  const match = aVal === bVal;
                  return (
                    <div key={s.id} className="breakdown-card card">
                      <div className="breakdown-header">
                        <span>{s.emoji} {s.title}</span>
                        <span className={`badge ${match ? 'badge-success' : 'badge-warning'}`}>
                          {match ? '✅ Match!' : '🔄 Different'}
                        </span>
                      </div>
                      <div className="breakdown-values">
                        <div className="breakdown-val">
                          <span className="text-xs text-muted">{partnerA.name}</span>
                          <span className="font-semibold text-sm" style={{ color: '#FF6B9D' }}>{valueLabels[aVal] || 'N/A'}</span>
                        </div>
                        <span className="breakdown-vs">vs</span>
                        <div className="breakdown-val">
                          <span className="text-xs text-muted">{partnerB.name}</span>
                          <span className="font-semibold text-sm" style={{ color: '#C44DFF' }}>{valueLabels[bVal] || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button className="btn btn-ghost mt-lg" onClick={handleStart}>Retake Quiz</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
