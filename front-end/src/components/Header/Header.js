import React from 'react';
import './Header.css';

const Header = ({ activeTab, setActiveTab, userId, onLogout }) => {
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

        
        {/* 🎯 LÓGICA DE AUTENTICAÇÃO INTEGRADA */}
        <div className="user-section">
          {userId ? (
            // Se o usuário está logado, mostra avatar e botão de sair
            <>
              <div 
                className="user-avatar logged-in"
                title={`Logado (ID: ${userId})`}
              >
                👤
              </div>
              <button
                className="logout-button"
                onClick={onLogout} // Chama a função de logout do App.js
              >
                Sair
              </button>
            </>
          ) : (
            // Se o usuário NÃO está logado, mostra o avatar simples (pode ser um botão de login)
            // No seu App.js, o AuthWrapper já gerencia a exibição do login, 
            // então aqui só mostramos o ícone deslogado.
            <div className="user-avatar logged-out">
              🔒
            </div>
          )}
        </div>
        {/* 🎯 FIM LÓGICA DE AUTENTICAÇÃO */}
      </div>
    </header>
  );
};

export default Header;