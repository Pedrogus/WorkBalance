import React from 'react';
import './Analytics.css';

const Analytics = ({ sessions, stats }) => {
  const getWeeklyData = () => {
    const last7Days = [...Array(7)].map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      // Formato ISO da data (YYYY-MM-DD) para comparação
      return date.toISOString().split('T')[0]; 
    }).reverse();

    return last7Days.map(date => {
      const daySessions = sessions.filter(session => {
        // CRÍTICO: Usa inicioSessao, que é o campo do backend.
        // E garante que a sessão não está EM ANDAMENTO (fimSessao não nulo) e inicioSessao existe.
        if (!session.inicioSessao || !session.fimSessao) {
            return false; // Ignora sessões em andamento
        }
        
        // CRÍTICO: Usa inicioSessao. O replace remove o [UTC] se for necessário (depende do seu backend)
        const sessionDatePart = session.inicioSessao.replace(/\[UTC\]$/, '').split('T')[0];
        return sessionDatePart === date;
      });
      
      // REFACTOR: Agora que a sessão tem 'duracaoMinutos', podemos somar diretamente, é mais eficiente.
      const totalHours = daySessions.reduce((total, session) => {
        // duracaoMinutos vem do backend, somamos o total em minutos
        return total + (session.duracaoMinutos || 0); 
      }, 0) / 60; // Divide por 60 para obter horas
      
      // CRÍTICO: Usa nivelCansaco (substitui fatigueLevel)
      const avgFatigue = daySessions.length > 0 
        ? daySessions.reduce((sum, session) => sum + parseInt(session.nivelCansaco || 0), 0) / daySessions.length
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
      {/* ... restante da renderização ... */}
      {sessions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📈</div>
          <h2>Sem dados para análise</h2>
          <p>Registre algumas sessões para ver análises detalhadas</p>
        </div>
      ) : (
        <>
          {/* Estatísticas Principais - USAM O PROP 'stats' QUE JÁ ESTÁ CORRETO */}
          <div className="stats-grid">
            {/* ... (restante do código que usa 'stats' não precisa de alteração) ... */}
          </div>

          {/* Gráfico Semanal - USA O NOVO weeklyData */}
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
            {/* ... (restante do código) ... */}
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;