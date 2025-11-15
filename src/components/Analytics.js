import React from 'react';
import './Analytics.css';

const Analytics = ({ sessions, stats }) => {
  const getWeeklyData = () => {
    const last7Days = [...Array(7)].map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const daySessions = sessions.filter(session => 
        session.startTime.split('T')[0] === date
      );
      
      const totalHours = daySessions.reduce((total, session) => {
        const start = new Date(session.startTime);
        const end = new Date(session.endTime);
        return total + (end - start) / (1000 * 60 * 60);
      }, 0);

      const avgFatigue = daySessions.length > 0 
        ? daySessions.reduce((sum, session) => sum + parseInt(session.fatigueLevel), 0) / daySessions.length
        : 0;

      return {
        date,
        totalHours: Math.round(totalHours * 10) / 10,
        avgFatigue: Math.round(avgFatigue * 10) / 10,
        sessions: daySessions.length
      };
    });
  };

  const weeklyData = getWeeklyData();

  return (
    <div className="analytics">
      <div className="section-header">
        <h1>Análises Detalhadas</h1>
        <p>Insights e tendências do seu trabalho</p>
      </div>

      {sessions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📈</div>
          <h2>Sem dados para análise</h2>
          <p>Registre algumas sessões para ver análises detalhadas</p>
        </div>
      ) : (
        <>
          {/* Estatísticas Principais */}
          <div className="stats-grid">
            <div className="stat-card">
              <h3>📅 Esta Semana</h3>
              <div className="stat-value">{stats.sessionsThisWeek || 0}</div>
              <p>Sessões realizadas</p>
            </div>
            
            <div className="stat-card">
              <h3>⏱️ Média Diária</h3>
              <div className="stat-value">
                {stats.totalHours ? Math.round((stats.totalHours / 7) * 10) / 10 : 0}h
              </div>
              <p>Horas por dia</p>
            </div>
            
            <div className="stat-card">
              <h3>😴 Cansaço</h3>
              <div className="stat-value">{stats.avgFatigue || 0}/10</div>
              <p>Nível médio</p>
            </div>
            
            <div className="stat-card">
              <h3>☕ Pausas</h3>
              <div className="stat-value">
                {stats.totalBreaks ? Math.round(stats.totalBreaks / (stats.sessionsThisWeek || 1)) : 0}m
              </div>
              <p>Média por sessão</p>
            </div>
          </div>

          {/* Gráfico Semanal */}
          <div className="chart-section">
            <h3>Evolução dos Últimos 7 Dias</h3>
            <div className="weekly-chart">
              {weeklyData.map((day, index) => (
                <div key={index} className="chart-bar-container">
                  <div className="chart-bar-label">
                    {new Date(day.date).toLocaleDateString('pt-BR', { weekday: 'short' })}
                  </div>
                  <div className="chart-bar">
                    <div 
                      className="bar hours-bar"
                      style={{ height: `${(day.totalHours / 8) * 100}%` }}
                      title={`${day.totalHours}h trabalhadas`}
                    ></div>
                    <div 
                      className="bar fatigue-bar"
                      style={{ height: `${day.avgFatigue * 10}%` }}
                      title={`Cansaço: ${day.avgFatigue}/10`}
                    ></div>
                  </div>
                  <div className="chart-bar-value">
                    {day.sessions} sessão{day.sessions !== 1 ? 's' : ''}
                  </div>
                </div>
              ))}
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <div className="color-box hours-color"></div>
                <span>Horas Trabalhadas</span>
              </div>
              <div className="legend-item">
                <div className="color-box fatigue-color"></div>
                <span>Nível de Cansaço</span>
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="insights-section">
            <h3>💡 Insights</h3>
            <div className="insights-grid">
              {stats.avgFatigue > 7 && (
                <div className="insight-card warning">
                  <h4>Alto Nível de Cansaço</h4>
                  <p>Seu cansaço médio está elevado. Considere ajustar sua rotina para incluir mais descanso.</p>
                </div>
              )}
              
              {stats.totalHours > 40 && (
                <div className="insight-card warning">
                  <h4>Jornada Intensa</h4>
                  <p>Você trabalhou muitas horas esta semana. Lembre-se do equilíbrio entre vida pessoal e profissional.</p>
                </div>
              )}
              
              {stats.productivityScore > 80 && (
                <div className="insight-card success">
                  <h4>Excelente Produtividade</h4>
                  <p>Seu score de produtividade está ótimo! Continue mantendo esse equilíbrio.</p>
                </div>
              )}
              
              <div className="insight-card info">
                <h4>Dica de Produtividade</h4>
                <p>Tente a técnica Pomodoro: 25 minutos de foco seguidos de 5 minutos de pausa.</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;