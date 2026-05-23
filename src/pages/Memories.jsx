import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCouple } from '../context/CoupleContext';
import './Memories.css';

const milestoneOptions = [
  { value: '', label: 'No milestone' },
  { value: 'first-date', label: '💕 First Date' },
  { value: 'anniversary', label: '🎉 Anniversary' },
  { value: 'vacation', label: '✈️ Vacation' },
  { value: 'special', label: '⭐ Special Moment' },
  { value: 'achievement', label: '🏆 Achievement' },
];

const milestoneLabels = {
  'first-date': '💕 First Date',
  'anniversary': '🎉 Anniversary',
  'vacation': '✈️ Vacation',
  'special': '⭐ Special Moment',
  'achievement': '🏆 Achievement',
};

const filters = ['All', 'Photos', 'Milestones'];

export default function Memories() {
  const navigate = useNavigate();
  const ctx = useCouple();
  const { memories, addMemory, deleteMemory } = ctx;
  const fileRef = useRef(null);

  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('All');
  const [caption, setCaption] = useState('');
  const [milestone, setMilestone] = useState('');
  const [preview, setPreview] = useState(null);
  const [memDate, setMemDate] = useState(new Date().toISOString().split('T')[0]);

  const filtered = memories.filter(m => {
    if (filter === 'Photos') return m.imageUrl;
    if (filter === 'Milestones') return m.milestone;
    return true;
  });

  // Group by month
  const groups = {};
  filtered.forEach(m => {
    const key = m.date.slice(0, 7); // YYYY-MM
    if (!groups[key]) groups[key] = [];
    groups[key].push(m);
  });
  const sortedGroups = Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!caption.trim() && !preview) return;
    addMemory({
      imageUrl: preview || null,
      caption: caption.trim(),
      milestone: milestone || null,
      type: milestone ? 'milestone' : 'photo',
      date: memDate,
    });
    setShowModal(false);
    setCaption('');
    setPreview(null);
    setMilestone('');
  };

  const formatMonth = (key) => {
    const [y, m] = key.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[parseInt(m) - 1]} ${y}`;
  };

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/')}>←</button>
        <span className="page-header-title">Our Memories 📸</span>
      </div>

      <div className="page-content">
        {/* Filters */}
        <div className="chip-row mb-md">
          {filters.map(f => (
            <button key={f} className={`chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f}
            </button>
          ))}
        </div>

        {/* Timeline */}
        {sortedGroups.length === 0 ? (
          <motion.div className="memories-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <span className="emoji-big">📷</span>
            <h3 className="mt-md">Start Your Story</h3>
            <p className="text-muted mt-sm">Capture your moments together and build a beautiful timeline of memories</p>
            <button className="btn btn-primary mt-lg" onClick={() => setShowModal(true)}>
              Add First Memory 📸
            </button>
          </motion.div>
        ) : (
          <div className="memories-timeline">
            {sortedGroups.map(([key, mems]) => (
              <div key={key} className="timeline-group">
                <div className="timeline-month">{formatMonth(key)}</div>
                <div className="timeline-items">
                  {mems.map((m, i) => (
                    <motion.div key={m.id} className="memory-card"
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      style={{ '--rotate': `${(Math.random() - 0.5) * 4}deg` }}>
                      {m.imageUrl && (
                        <div className="memory-photo">
                          <img src={m.imageUrl} alt={m.caption} />
                        </div>
                      )}
                      <div className="memory-content">
                        {m.milestone && (
                          <span className="badge badge-warning">{milestoneLabels[m.milestone] || m.milestone}</span>
                        )}
                        <p className="memory-caption">{m.caption}</p>
                        <span className="text-xs text-muted">{m.date}</span>
                      </div>
                      <button className="memory-delete" onClick={() => deleteMemory(m.id)}>×</button>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <button className="memories-fab" onClick={() => setShowModal(true)} id="add-memory-btn">
        <span>+</span>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div className="memory-modal-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="memory-modal"
              initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 60 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}>
              <div className="modal-header">
                <h3>New Memory ✨</h3>
                <button className="back-btn" onClick={() => setShowModal(false)}>×</button>
              </div>

              <div className="modal-body">
                <div className="upload-area" onClick={() => fileRef.current?.click()}>
                  {preview ? (
                    <img src={preview} alt="Preview" className="upload-preview" />
                  ) : (
                    <>
                      <span className="upload-icon">📷</span>
                      <span className="text-sm text-muted">Tap to add a photo</span>
                    </>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} hidden />
                </div>

                <div className="input-group">
                  <label className="input-label">Caption</label>
                  <textarea className="input" placeholder="What makes this memory special?"
                    value={caption} onChange={e => setCaption(e.target.value)} rows={3} maxLength={200} />
                </div>

                <div className="input-group">
                  <label className="input-label">Date</label>
                  <input className="input" type="date" value={memDate} onChange={e => setMemDate(e.target.value)} />
                </div>

                <div className="input-group">
                  <label className="input-label">Milestone</label>
                  <select className="input" value={milestone} onChange={e => setMilestone(e.target.value)}>
                    {milestoneOptions.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>

                <button className="btn btn-primary btn-full mt-md" onClick={handleSave}
                  disabled={!caption.trim() && !preview}>
                  Save Memory 💕
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
