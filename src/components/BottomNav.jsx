import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './BottomNav.css';

const tabs = [
  { path: '/', icon: '🏠', label: 'Home' },
  { path: '/challenges', icon: '🔥', label: 'Challenges' },
  { path: '/memories', icon: '📸', label: 'Memories', center: true },
  { path: '/quiz', icon: '🧠', label: 'Quiz' },
  { path: '/insights', icon: '📊', label: 'Insights' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="bottom-nav" id="bottom-navigation">
      <div className="bottom-nav-inner">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <button
              key={tab.path}
              id={`nav-${tab.label.toLowerCase()}`}
              className={`nav-tab ${isActive ? 'active' : ''} ${tab.center ? 'nav-tab-center' : ''}`}
              onClick={() => navigate(tab.path)}
            >
              {tab.center ? (
                <span className="nav-center-icon">
                  <span className="nav-center-emoji">{tab.icon}</span>
                </span>
              ) : (
                <span className="nav-icon">{tab.icon}</span>
              )}
              <span className="nav-label">{tab.label}</span>
              {isActive && !tab.center && <span className="nav-indicator" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
