import React, { useEffect, useState } from 'react';
import './Confetti.css';

const COLORS = ['#FF6B9D', '#C44DFF', '#FFD166', '#4DFFA0', '#6BDFFF', '#FF9F6B', '#F5F0FF'];

function ConfettiPiece({ index }) {
  const style = {
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 0.8}s`,
    animationDuration: `${1.5 + Math.random() * 2}s`,
    backgroundColor: COLORS[index % COLORS.length],
    width: `${6 + Math.random() * 8}px`,
    height: `${6 + Math.random() * 8}px`,
    borderRadius: Math.random() > 0.5 ? '50%' : '2px',
    transform: `rotate(${Math.random() * 360}deg)`,
  };
  return <div className="confetti-piece" style={style} />;
}

export default function Confetti({ show }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 3500);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!visible) return null;

  return (
    <div className="confetti-container">
      {Array.from({ length: 40 }, (_, i) => (
        <ConfettiPiece key={i} index={i} />
      ))}
    </div>
  );
}
