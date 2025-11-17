import React from 'react';
import './Dashboard.css';

const Dashboard = ({ sessions, stats, onAddSession }) => {
  const getProductivityLevel = () => {
    const score = stats.productivityScore || 0;
    if (score >= 80) return { level: 'Alta', color: '#10b981', emoji: '🚀' };
    if (score >= 60) return { level: 'Boa', color: '#3b82f6', emoji: '👍' };
    if (score >= 40) return { level: 'Média', color: '#f59e0b', emoji: '⚡' };
    return { level: 'Baixa', color: '#ef4444', emoji: '😴' };
  };

  const getWellnessTips = () => {
    const tips = [];
    
    if (stats.avgFatigue > 7) {
      tips.push('💤 Seu cansaço está alto - priorize o descanso');
    }
    
    if (stats.totalHours > 40) {
      tips.push('⏰ Muitas horas trabalhadas - programe pausas');
    }
    
    if ((stats.totalBreaks / (stats.sessionsThisWeek || 1)) < 15) {
      tips.push('☕ Faça pausas mais frequentes durante o trabalho');
    }
    
    if (tips.length === 0) {
      tips.push('🎉 Continue mantendo esse equilíbrio!');
    }
    
    return tips;
  };

  const productivity = getProductivityLevel();
  const tips = getWellnessTips();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Visão Geral</h1>
        <p>Resumo da sua produtividade e bem-estar</p>
      </div>

      {sessions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h2>Bem-vindo ao WorkBalance!</h2>
          <p>Comece registrando sua primeira sessão de trabalho para ver suas métricas.</p>
          <button className="cta-button" onClick={onAddSession}>
            + Nova Sessão
          </button>
        </div>
      ) : (
        <>
          {/* Cards de Métricas */}
          <div className="metrics-grid">
            <div className="metric-card primary">
              <div className="metric-icon">⏰</div>
              <div className="metric-content">
                <h3>{stats.totalHours || 0}h</h3>
                <p>Horas Trabalhadas</p>
              </div>
            </div>

            <div className="metric-card warning">
              <div className="metric-icon">😴</div>
              <div className="metric-content">
                <h3>{stats.avgFatigue || 0}/10</h3>
                <p>Cansaço Médio</p>
              </div>
            </div>

            <div className="metric-card success">
              <div className="metric-icon">☕</div>
              <div className="metric-content">
                <h3>{stats.totalBreaks || 0}m</h3>
                <p>Pausas Totais</p>
              </div>
            </div>

            <div className="metric-card productivity">
              <div className="metric-icon">{productivity.emoji}</div>
              <div className="metric-content">
                <h3 style={{ color: productivity.color }}>
                  {stats.productivityScore || 0}%
                </h3>
                <p>Produtividade ({productivity.level})</p>
              </div>
            </div>
          </div>

          {/* Alertas e Dicas */}
          <div className="alerts-section">
            <h3>📋 Recomendações</h3>
            <div className="alerts-list">
              {tips.map((tip, index) => (
                <div key={index} className="alert-item">
                  {tip}
                </div>
              ))}
            </div>
          </div>

          {/* Gráficos Placeholder */}
          <div className="charts-section">
            <div className="chart-card">
              <h4>📈 Evolução Semanal</h4>
              <div className="chart-placeholder">
                <p>Gráfico mostrando horas produtivas vs. pausas</p>
              </div>
            </div>
            
            <div className="chart-card">
              <h4>🎯 Distribuição de Tempo</h4>
              <div className="chart-placeholder">
                <p>Gráfico de pizza: Trabalho vs. Pausas vs. Descanso</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;