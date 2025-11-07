import React, { useState } from 'react';
import './AppLayout.css';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="app-layout">
      {/* Header */}
      <header className="app-header">
        <div className="app-header__left">
          <button
            className="menu-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          <h1 className="app-title">TimeKeeper</h1>
        </div>
        <div className="app-header__right">
          <button className="theme-toggle" title="Toggle theme">
            🌙
          </button>
        </div>
      </header>

      <div className="app-body">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <nav className="sidebar-nav">
            <a href="#" className="nav-item active">
              <span className="nav-icon">📅</span>
              <span className="nav-label">Calendar</span>
            </a>
            <a href="#" className="nav-item">
              <span className="nav-icon">📊</span>
              <span className="nav-label">Statistics</span>
            </a>
            <a href="#" className="nav-item">
              <span className="nav-icon">⚙️</span>
              <span className="nav-label">Settings</span>
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className={`main-content ${sidebarOpen ? '' : 'sidebar-closed'}`}>
          {children}
        </main>
      </div>
    </div>
  );
};
