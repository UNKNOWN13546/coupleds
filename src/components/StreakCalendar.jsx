import React from 'react';
import './StreakCalendar.css';

export default function StreakCalendar({ dailyAnswers = {} }) {
  const today = new Date();
  const days = [];

  // Generate last 84 days (12 weeks)
  for (let i = 83; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    const entry = dailyAnswers[key];
    let level = 0; // 0=empty, 1=one partner, 2=both
    if (entry) {
      if (entry.answerA && entry.answerB) level = 2;
      else if (entry.answerA || entry.answerB) level = 1;
    }
    days.push({ date: key, level, dayOfWeek: d.getDay() });
  }

  // Group into weeks
  const weeks = [];
  let currentWeek = [];
  days.forEach((day, i) => {
    currentWeek.push(day);
    if (currentWeek.length === 7 || i === days.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="streak-calendar" id="streak-calendar">
      <div className="streak-grid-wrapper">
        <div className="streak-day-labels">
          {dayLabels.map((l, i) => (
            <span key={i} className="streak-day-label">{i % 2 === 1 ? l : ''}</span>
          ))}
        </div>
        <div className="streak-grid">
          {weeks.map((week, wi) => (
            <div key={wi} className="streak-week">
              {week.map((day, di) => (
                <div
                  key={di}
                  className={`streak-cell streak-level-${day.level}`}
                  title={`${day.date}${day.level === 2 ? ' ✓ Both answered' : day.level === 1 ? ' ○ One answered' : ''}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="streak-legend">
        <span className="streak-legend-label">Less</span>
        <div className="streak-cell streak-level-0 streak-legend-cell" />
        <div className="streak-cell streak-level-1 streak-legend-cell" />
        <div className="streak-cell streak-level-2 streak-legend-cell" />
        <span className="streak-legend-label">More</span>
      </div>
    </div>
  );
}
