import React from 'react';
import './Header.css';

const Header = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'session', label: 'Sessões', icon: '⏱️' },
    { id: 'analytics', label: 'Análises', icon: '📈' },
    { id: 'tips', label: 'Bem-estar', icon: '💡' }
  ];

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-section">
          <div className="logo">
            <span className="logo-icon">⚖️</span>
            <div>
              <h1>WorkBalance</h1>
              <p>Produtividade com Equilíbrio</p>
            </div>
          </div>
        </div>

        <nav className="navigation">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="user-section">
          <div className="user-avatar">👤</div>
        </div>
      </div>
    </header>
  );
};

export default Header;