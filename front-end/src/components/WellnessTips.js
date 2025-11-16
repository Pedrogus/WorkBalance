import React from 'react';
import './WellnessTips.css';

const WellnessTips = ({ sessions, stats }) => {
  const generalTips = [
    {
      icon: '⏱️',
      title: 'Técnica Pomodoro',
      description: 'Trabalhe em blocos de 25-30 minutos com pausas de 5 minutos. A cada 4 blocos, faça uma pausa maior de 15-30 minutos.',
      category: 'Produtividade'
    },
    {
      icon: '🚶',
      title: 'Pausas Ativas',
      description: 'Durante as pausas, levante-se, alongue-se ou caminhe. Isso melhora a circulação e reduz a fadiga muscular.',
      category: 'Saúde Física'
    },
    {
      icon: '💧',
      title: 'Hidratação',
      description: 'Mantenha uma garrafa de água sempre por perto. A desidratação pode causar fadiga e dificuldade de concentração.',
      category: 'Saúde'
    },
    {
      icon: '💺',
      title: 'Postura Correta',
      description: 'Ajuste sua cadeira para manter os pés apoiados no chão, costas retas e monitor na altura dos olhos.',
      category: 'Ergonomia'
    },
    {
      icon: '🌞',
      title: 'Luz Natural',
      description: 'Posicione sua mesa próximo a uma janela. A luz natural melhora o humor e reduz a fadiga ocular.',
      category: 'Ambiente'
    },
    {
      icon: '📵',
      title: 'Desconexão',
      description: 'Estabeleça horários para checar e-mails e mensagens. Evite notificações constantes durante o trabalho focado.',
      category: 'Foco'
    }
  ];

  const getPersonalizedTips = () => {
    const tips = [];
    
    if (stats.avgFatigue > 7) {
      tips.push({
        icon: '😴',
        title: 'Cansaço Elevado',
        description: 'Seu nível de cansaço está alto. Considere dormir mais cedo e praticar técnicas de relaxamento.',
        urgent: true
      });
    }
    
    if (stats.totalHours > 40) {
      tips.push({
        icon: '⏰',
        title: 'Jornada Longa',
        description: 'Você está trabalhando muitas horas. Lembre-se de equilibrar trabalho e descanso para evitar burnout.',
        urgent: true
      });
    }
    
    if ((stats.totalBreaks / (stats.sessionsThisWeek || 1)) < 15) {
      tips.push({
        icon: '☕',
        title: 'Pausas Insuficientes',
        description: 'Tente fazer pausas mais frequentes. Pausas regulares melhoram a produtividade e o bem-estar.',
        urgent: false
      });
    }
    
    if (stats.productivityScore > 80) {
      tips.push({
        icon: '🎯',
        title: 'Excelente Performance',
        description: 'Seu equilíbrio entre trabalho e descanso está ótimo! Continue mantendo essa rotina saudável.',
        urgent: false
      });
    }
    
    return tips;
  };

  const personalizedTips = getPersonalizedTips();

  return (
    <div className="wellness-tips">
      <div className="section-header">
        <h1>Dicas de Bem-estar</h1>
        <p>Recomendações para melhorar sua produtividade e qualidade de vida</p>
      </div>

      {/* Dicas Personalizadas */}
      {personalizedTips.length > 0 && (
        <div className="tips-section">
          <h2>💎 Recomendações para Você</h2>
          <p className="section-subtitle">Baseadas na sua rotina de trabalho</p>
          
          <div className="tips-grid personalized">
            {personalizedTips.map((tip, index) => (
              <div key={index} className={`tip-card ${tip.urgent ? 'urgent' : ''}`}>
                <div className="tip-header">
                  <span className="tip-icon">{tip.icon}</span>
                  {tip.urgent && <span className="urgent-badge">Importante</span>}
                </div>
                <h3>{tip.title}</h3>
                <p>{tip.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dicas Gerais */}
      <div className="tips-section">
        <h2>📚 Dicas Gerais</h2>
        <p className="section-subtitle">Boas práticas para todos os profissionais</p>
        
        <div className="tips-grid">
          {generalTips.map((tip, index) => (
            <div key={index} className="tip-card">
              <div className="tip-header">
                <span className="tip-icon">{tip.icon}</span>
                <span className="tip-category">{tip.category}</span>
              </div>
              <h3>{tip.title}</h3>
              <p>{tip.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Checklist de Bem-estar */}
      <div className="checklist-section">
        <h2>✅ Checklist Diário</h2>
        <div className="checklist">
          <div className="checklist-item">
            <input type="checkbox" id="hydration" />
            <label htmlFor="hydration">Beber 2L de água durante o dia</label>
          </div>
          <div className="checklist-item">
            <input type="checkbox" id="breaks" />
            <label htmlFor="breaks">Fazer pausas a cada 2 horas de trabalho</label>
          </div>
          <div className="checklist-item">
            <input type="checkbox" id="posture" />
            <label htmlFor="posture">Manter postura correta na cadeira</label>
          </div>
          <div className="checklist-item">
            <input type="checkbox" id="eyes" />
            <label htmlFor="eyes">Descansar os olhos (olhar para longe a cada 20min)</label>
          </div>
          <div className="checklist-item">
            <input type="checkbox" id="movement" />
            <label htmlFor="movement">Alongar-se pelo menos 3 vezes ao dia</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WellnessTips;