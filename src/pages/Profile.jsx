import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCouple } from '../context/CoupleContext';
import './Profile.css';

const themes = [
  { id: 'rose', label: 'Rose', emoji: '🌹', color: '#FF6B9D' },
  { id: 'midnight', label: 'Midnight', emoji: '🌙', color: '#6BDFFF' },
  { id: 'aurora', label: 'Aurora', emoji: '🌌', color: '#4DFFA0' },
  { id: 'forest', label: 'Forest', emoji: '🌿', color: '#4DFFA0' },
];

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function Profile() {
  const navigate = useNavigate();
  const ctx = useCouple();
  const { partnerA, partnerB, activePartner, coupleName, anniversary, theme,
    switchPartner, setTheme, updateCoupleInfo, resetAll } = ctx;

  const [editName, setEditName] = useState(coupleName);
  const [editAnniversary, setEditAnniversary] = useState(anniversary || '');
  const [showConfirm, setShowConfirm] = useState(false);
  const [saved, setSaved] = useState(false);

  const currentName = activePartner === 'A' ? partnerA.name : partnerB.name;

  const daysTogether = anniversary
    ? Math.max(0, Math.floor((Date.now() - new Date(anniversary).getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  const handleSave = () => {
    updateCoupleInfo({ coupleName: editName, anniversary: editAnniversary || null });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    resetAll();
    navigate('/');
  };

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/')}>←</button>
        <span className="page-header-title">Profile</span>
      </div>

      <motion.div className="page-content" initial="hidden" animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}>

        {/* Couple Header */}
        <motion.div className="profile-couple-header" variants={item}>
          <div className="profile-avatars">
            <div className="avatar avatar-xl">{partnerA.name[0]?.toUpperCase()}</div>
            <span className="profile-heart animate-heartbeat">❤️</span>
            <div className="avatar avatar-xl" style={{ background: 'linear-gradient(135deg, #C44DFF, #6BDFFF)' }}>
              {partnerB.name[0]?.toUpperCase()}
            </div>
          </div>
          <h2 className="mt-md">{coupleName}</h2>
          {anniversary && (
            <p className="text-muted text-sm">{daysTogether} days together 💕</p>
          )}
        </motion.div>

        {/* Partner Switcher */}
        <motion.div className="card profile-switcher" variants={item}>
          <div className="switcher-info">
            <span className="text-sm text-muted">Currently active</span>
            <div className="switcher-current">
              <div className="avatar" style={{ width: 32, height: 32, fontSize: '0.85rem',
                background: activePartner === 'A' ? 'var(--gradient-primary)' : 'linear-gradient(135deg, #C44DFF, #6BDFFF)' }}>
                {currentName[0]?.toUpperCase()}
              </div>
              <span className="font-bold">{currentName}</span>
              <span className="badge badge-primary">Partner {activePartner}</span>
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={switchPartner}>
            Switch Partner 🔄
          </button>
          <p className="text-xs text-muted mt-sm" style={{ fontStyle: 'italic' }}>
            Simulated multi-user — switch to answer as the other partner
          </p>
        </motion.div>

        {/* Theme Picker */}
        <motion.div className="card" variants={item}>
          <h4 className="mb-md">App Theme</h4>
          <div className="theme-options">
            {themes.map(t => (
              <button key={t.id} className={`theme-option ${theme === t.id ? 'active' : ''}`}
                onClick={() => setTheme(t.id)} style={{ '--theme-color': t.color }}>
                <span className="theme-circle" style={{ background: t.color }} />
                <span className="theme-emoji">{t.emoji}</span>
                <span className="text-xs">{t.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Edit Info */}
        <motion.div className="card" variants={item}>
          <h4 className="mb-md">Couple Info</h4>
          <div className="input-group">
            <label className="input-label">Couple Name</label>
            <input className="input" value={editName} onChange={e => setEditName(e.target.value)} maxLength={30} />
          </div>
          <div className="input-group mt-md">
            <label className="input-label">Anniversary</label>
            <input className="input" type="date" value={editAnniversary} onChange={e => setEditAnniversary(e.target.value)} />
          </div>
          <button className="btn btn-primary btn-sm mt-md" onClick={handleSave}>
            {saved ? '✓ Saved!' : 'Save Changes'}
          </button>
        </motion.div>

        {/* Danger Zone */}
        <motion.div className="card profile-danger" variants={item}>
          <h4 className="mb-sm" style={{ color: 'var(--color-danger)' }}>Danger Zone</h4>
          <p className="text-xs text-muted mb-md">This will permanently delete all data and start fresh</p>
          {!showConfirm ? (
            <button className="btn btn-danger-outline" onClick={() => setShowConfirm(true)}>
              Reset Everything
            </button>
          ) : (
            <div className="confirm-reset">
              <p className="text-sm font-bold" style={{ color: 'var(--color-danger)' }}>Are you sure?</p>
              <div className="flex gap-sm mt-sm">
                <button className="btn btn-ghost btn-sm" onClick={() => setShowConfirm(false)}>Cancel</button>
                <button className="btn btn-danger btn-sm" onClick={handleReset}>Yes, Reset</button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Footer */}
        <motion.div className="profile-footer" variants={item}>
          <span className="text-sm text-muted">Coupled v1.0</span>
          <span className="text-xs text-muted">Made with ❤️ for love</span>
          <span className="profile-sparkle">✨💕✨</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
