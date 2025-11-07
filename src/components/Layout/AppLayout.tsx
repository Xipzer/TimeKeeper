import React, { useState, useRef, useEffect } from 'react';
import './AppLayout.css';
import { useTheme } from '../../theme/ThemeContext';
import { IoSettingsSharp } from 'react-icons/io5';
import { MdLightMode, MdDarkMode } from 'react-icons/md';
import { HiTrash } from 'react-icons/hi';
import { RiRobot2Fill } from 'react-icons/ri';
import { AIAssistantDrawer } from '../AIAssistant/AIAssistantDrawer';
import type { Task } from '../../types';

interface AppLayoutProps {
  children: React.ReactNode;
  onTasksCreated?: (tasks: Task[]) => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, onTasksCreated }) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
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

  const handleTasksCreated = (tasks: Task[]) => {
    if (onTasksCreated) {
      onTasksCreated(tasks);
    }
  };

  return (
    <div className="app-layout">
      {/* AI Assistant Button */}
      <div className="ai-assistant-container">
        <button
          className="ai-assistant-button"
          onClick={() => setAiAssistantOpen(!aiAssistantOpen)}
          title="AI Scheduling Assistant"
        >
          <RiRobot2Fill />
        </button>
      </div>

      {/* Settings Button */}
      <div className="settings-container" ref={settingsRef}>
        <button
          className="settings-button"
          onClick={() => setSettingsOpen(!settingsOpen)}
          title="Settings"
        >
          <IoSettingsSharp />
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
                {theme === 'light' ? <><MdDarkMode /> Dark</> : <><MdLightMode /> Light</>}
              </button>
            </div>
            <div className="settings-menu-divider" />
            <div className="settings-menu-item">
              <button
                className="reset-button"
                onClick={handleResetTasks}
              >
                <HiTrash /> Reset All Tasks
              </button>
            </div>
          </div>
        )}
      </div>

      {/* AI Assistant Drawer */}
      <AIAssistantDrawer
        isOpen={aiAssistantOpen}
        onClose={() => setAiAssistantOpen(false)}
        onTasksCreated={handleTasksCreated}
      />

      {/* Main Content */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};
