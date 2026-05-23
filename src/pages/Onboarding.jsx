import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCouple } from '../context/CoupleContext';
import './Onboarding.css';

const pageVariants = {
  enter: { opacity: 0, x: 80 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -80 },
};

export default function Onboarding() {
  const navigate = useNavigate();
  const { coupleCode, completeOnboarding } = useCouple();
  const [step, setStep] = useState(0);
  const [partnerAName, setPartnerAName] = useState('');
  const [partnerBName, setPartnerBName] = useState('');
  const [coupleName, setCoupleName] = useState('');
  const [anniversary, setAnniversary] = useState('');

  const handleComplete = () => {
    if (!partnerAName.trim() || !partnerBName.trim()) return;
    completeOnboarding(
      partnerAName.trim(),
      partnerBName.trim(),
      coupleName.trim() || `${partnerAName.trim()} & ${partnerBName.trim()}`,
      anniversary || null
    );
    navigate('/');
  };

  const canNext = () => {
    if (step === 1) return partnerAName.trim().length > 0;
    if (step === 2) return partnerBName.trim().length > 0;
    return true;
  };

  return (
    <div className="onboarding">
      {/* Particle background */}
      <div className="onboarding-particles">
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`,
            width: `${3 + Math.random() * 5}px`,
            height: `${3 + Math.random() * 5}px`,
          }} />
        ))}
      </div>

      {/* Progress dots */}
      <div className="onboarding-progress">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className={`progress-dot ${step === i ? 'active' : ''} ${step > i ? 'done' : ''}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="splash" className="onboarding-step onboarding-splash"
            variants={pageVariants} initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="splash-heart-container">
              <span className="splash-heart">💕</span>
              <div className="splash-ring ring-1" />
              <div className="splash-ring ring-2" />
              <div className="splash-ring ring-3" />
            </div>
            <h1 className="splash-title">
              <span className="gradient-text">Coupled</span>
            </h1>
            <p className="splash-tagline">Grow Closer Every Day</p>
            <p className="splash-desc">
              A private space for you and your partner to deepen your connection through daily questions, challenges, and shared memories.
            </p>
            <button className="btn btn-primary btn-lg btn-full" onClick={() => setStep(1)}>
              Get Started ✨
            </button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="partnerA" className="onboarding-step"
            variants={pageVariants} initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="step-emoji">👤</div>
            <h2>Create Your Space</h2>
            <p className="text-muted mt-sm">Let's start with your name</p>
            <div className="onboarding-avatar-preview">
              <div className="avatar avatar-xl">
                {partnerAName ? partnerAName[0].toUpperCase() : '?'}
              </div>
              <span className="badge badge-primary mt-sm">Partner A</span>
            </div>
            <div className="input-group mt-lg">
              <label className="input-label">Your Name</label>
              <input
                className="input"
                type="text"
                placeholder="Enter your name..."
                value={partnerAName}
                onChange={e => setPartnerAName(e.target.value)}
                autoFocus
                maxLength={20}
              />
            </div>
            <div className="onboarding-nav mt-lg">
              <button className="btn btn-ghost" onClick={() => setStep(0)}>Back</button>
              <button className="btn btn-primary" disabled={!canNext()} onClick={() => setStep(2)}>
                Next →
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="partnerB" className="onboarding-step"
            variants={pageVariants} initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="step-emoji">💑</div>
            <h2>Invite Your Partner</h2>
            <p className="text-muted mt-sm">Share this code with your partner</p>
            <div className="couple-code-display">
              {coupleCode.split('').map((ch, i) => (
                <span key={i} className="code-char">{ch}</span>
              ))}
            </div>
            <p className="text-xs text-muted" style={{ fontStyle: 'italic', marginTop: '8px' }}>
              Simulated pairing — both partners on the same device
            </p>
            <div className="input-group mt-lg">
              <label className="input-label">Partner's Name</label>
              <input
                className="input"
                type="text"
                placeholder="Enter their name..."
                value={partnerBName}
                onChange={e => setPartnerBName(e.target.value)}
                autoFocus
                maxLength={20}
              />
            </div>
            <div className="onboarding-avatar-preview mt-md">
              <div className="avatar avatar-lg" style={{ background: 'linear-gradient(135deg, #C44DFF, #6BDFFF)' }}>
                {partnerBName ? partnerBName[0].toUpperCase() : '?'}
              </div>
              <span className="badge badge-purple mt-sm">Partner B</span>
            </div>
            <div className="onboarding-nav mt-lg">
              <button className="btn btn-ghost" onClick={() => setStep(1)}>Back</button>
              <button className="btn btn-primary" disabled={!canNext()} onClick={() => setStep(3)}>
                Next →
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="details" className="onboarding-step"
            variants={pageVariants} initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="step-emoji">💍</div>
            <h2>Almost There!</h2>
            <p className="text-muted mt-sm">A few last details about your relationship</p>
            <div className="couple-preview">
              <div className="avatar" style={{ fontSize: '1.1rem' }}>{partnerAName[0]?.toUpperCase()}</div>
              <span className="couple-heart-between">❤️</span>
              <div className="avatar" style={{ background: 'linear-gradient(135deg, #C44DFF, #6BDFFF)', fontSize: '1.1rem' }}>
                {partnerBName[0]?.toUpperCase()}
              </div>
            </div>
            <div className="input-group mt-lg">
              <label className="input-label">Couple Name (optional)</label>
              <input
                className="input"
                type="text"
                placeholder={`${partnerAName} & ${partnerBName}`}
                value={coupleName}
                onChange={e => setCoupleName(e.target.value)}
                maxLength={30}
              />
            </div>
            <div className="input-group mt-md">
              <label className="input-label">Anniversary Date (optional)</label>
              <input
                className="input"
                type="date"
                value={anniversary}
                onChange={e => setAnniversary(e.target.value)}
              />
            </div>
            <button className="btn btn-primary btn-lg btn-full mt-lg" onClick={handleComplete}>
              Start Your Journey 💕
            </button>
            <button className="btn btn-ghost mt-sm" onClick={() => setStep(2)}>← Back</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
