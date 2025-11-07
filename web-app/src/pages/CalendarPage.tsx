import React, { useState } from 'react';
import './CalendarPage.css';

export const CalendarPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="calendar-page">
      <div className="page-header">
        <h1>Calendar</h1>
        <p className="page-subtitle">{formatDate(selectedDate)}</p>
      </div>

      <div className="calendar-grid">
        <section className="calendar-section">
          <div className="calendar-card">
            <h2>Monthly Calendar</h2>
            <p className="coming-soon">Calendar component coming soon...</p>
            <p className="hint">This will display an interactive monthly calendar</p>
          </div>
        </section>

        <aside className="tasks-section">
          <div className="metrics-card">
            <h3>Day Metrics</h3>
            <div className="metrics-grid">
              <div className="metric">
                <span className="metric-label">Total</span>
                <span className="metric-value">0</span>
              </div>
              <div className="metric">
                <span className="metric-label">Done</span>
                <span className="metric-value">0</span>
              </div>
              <div className="metric">
                <span className="metric-label">Rate</span>
                <span className="metric-value">0%</span>
              </div>
            </div>
          </div>

          <div className="tasks-card">
            <h3>Tasks</h3>
            <p className="empty-state">No tasks for this day</p>
          </div>
        </aside>
      </div>
    </div>
  );
};
