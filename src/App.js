import React, { useState, useEffect } from 'react';
import './App.css';

// Componentes
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import SessionManager from './components/SessionManager';
import Analytics from './components/Analytics';
import WellnessTips from './components/WellnessTips';

function App() {
  const [sessions, setSessions] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({});

  // Carregar sessões do localStorage
  useEffect(() => {
    const savedSessions = localStorage.getItem('workbalance-sessions');
    if (savedSessions) {
      const parsedSessions = JSON.parse(savedSessions);
      setSessions(parsedSessions);
      calculateStats(parsedSessions);
    }
  }, []);

  // Calcular estatísticas
  const calculateStats = (sessionsData) => {
    if (sessionsData.length === 0) {
      setStats({});
      return;
    }

    const totalHours = sessionsData.reduce((total, session) => {
      const start = new Date(session.startTime);
      const end = new Date(session.endTime);
      return total + (end - start) / (1000 * 60 * 60);
    }, 0);

    const avgFatigue = sessionsData.reduce((sum, session) => 
      sum + parseInt(session.fatigueLevel), 0) / sessionsData.length;

    const totalBreaks = sessionsData.reduce((sum, session) => 
      sum + (parseInt(session.breaks) || 0), 0);

    const today = new Date();
    const weekAgo = new Date(today.setDate(today.getDate() - 7));
    const sessionsThisWeek = sessionsData.filter(session => 
      new Date(session.startTime) > weekAgo
    ).length;

    setStats({
      totalHours: Math.round(totalHours),
      avgFatigue: avgFatigue.toFixed(1),
      totalBreaks,
      sessionsThisWeek,
      productivityScore: Math.min(100, Math.max(0, 100 - (avgFatigue * 8) + (totalBreaks / sessionsData.length))).toFixed(0)
    });
  };

  // Adicionar sessão
  const handleAddSession = (sessionData) => {
    const newSession = {
      ...sessionData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    const updatedSessions = [...sessions, newSession];
    setSessions(updatedSessions);
    localStorage.setItem('workbalance-sessions', JSON.stringify(updatedSessions));
    calculateStats(updatedSessions);
  };

  // Excluir sessão
  const handleDeleteSession = (id) => {
    const updatedSessions = sessions.filter(session => session.id !== id);
    setSessions(updatedSessions);
    localStorage.setItem('workbalance-sessions', JSON.stringify(updatedSessions));
    calculateStats(updatedSessions);
  };

  return (
    <div className="App">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="main-content">
        {activeTab === 'dashboard' && (
          <Dashboard 
            sessions={sessions} 
            stats={stats}
            onAddSession={() => setActiveTab('session')}
          />
        )}
        
        {activeTab === 'session' && (
          <SessionManager 
            onAddSession={handleAddSession}
            sessions={sessions}
            onDeleteSession={handleDeleteSession}
          />
        )}
        
        {activeTab === 'analytics' && (
          <Analytics sessions={sessions} stats={stats} />
        )}
        
        {activeTab === 'tips' && (
          <WellnessTips sessions={sessions} stats={stats} />
        )}
      </main>
    </div>
  );
}

export default App;