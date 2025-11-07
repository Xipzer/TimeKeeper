import React, { useState, useRef, useEffect } from 'react';
import './AppLayout.css';
import { useTheme } from '../../theme/ThemeContext';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const settingsRef = useRef<HTMLDivElement>(null);

  // Close settings menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setSettingsOpen(false);
      }
    };

    if (settingsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [settingsOpen]);

  const handleResetTasks = () => {
    if (confirm('Are you sure you want to delete all tasks? This action cannot be undone.')) {
      localStorage.removeItem('timekeeper-tasks');
      window.location.reload();
    }
  };

  return (
    <div className="app-layout">
      {/* Settings Button */}
      <div className="settings-container" ref={settingsRef}>
        <button
          className="settings-button"
          onClick={() => setSettingsOpen(!settingsOpen)}
          title="Settings"
        >
          ⚙️
        </button>

        {/* Settings Dropdown */}
        {settingsOpen && (
          <div className="settings-menu">
            <div className="settings-menu-item">
              <span className="settings-label">Theme</span>
              <button
                className="theme-toggle-button"
                onClick={toggleTheme}
              >
                {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
              </button>
            </div>
            <div className="settings-menu-divider" />
            <div className="settings-menu-item">
              <button
                className="reset-button"
                onClick={handleResetTasks}
              >
                🗑️ Reset All Tasks
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};
