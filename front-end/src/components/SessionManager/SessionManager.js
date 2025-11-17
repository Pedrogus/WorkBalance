import React, { useState } from 'react';
import './SessionManager.css';

const SessionManager = ({ onAddSession, sessions, onDeleteSession }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    startTime: '',
    endTime: '',
    breaks: '',
    notes: '',
    fatigueLevel: 5
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.startTime || !formData.endTime) {
      alert('Por favor, preencha os horários de início e fim.');
      return;
    }
    
    onAddSession(formData);
    setFormData({
      startTime: '',
      endTime: '',
      breaks: '',
      notes: '',
      fatigueLevel: 5
    });
    setShowForm(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateDuration = (start, end) => {
    const diffMs = new Date(end) - new Date(start);
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="session-manager">
      <div className="section-header">
        <h1>Gestão de Sessões</h1>
        <p>Registre e acompanhe suas sessões de trabalho</p>
      </div>

      <div className="session-actions">
        <button 
          className="add-session-btn"
          onClick={() => setShowForm(!showForm)}
        >
          <span>+</span>
          Nova Sessão
        </button>
      </div>

      {/* Formulário de Nova Sessão */}

      {showForm && (
        <div className="session-form-overlay">
          <div className="session-form-modal">
            <h3>📝 Nova Sessão de Trabalho</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Início</label>
                  <input
                    type="datetime-local"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Fim</label>
                  <input
                    type="datetime-local"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Pausas (minutos)</label>
                  <input
                    type="number"
                    name="breaks"
                    value={formData.breaks}
                    onChange={handleChange}
                    placeholder="Ex: 30"
                  />
                </div>
                
                <div className="form-group">
                  <label>Nível de Cansaço: {formData.fatigueLevel}/10</label>
                  <input
                    type="range"
                    name="fatigueLevel"
                    min="1"
                    max="10"
                    value={formData.fatigueLevel}
                    onChange={handleChange}
                    className="fatigue-slider"
                  />
                  <div className="slider-labels">
                    <span>😊</span>
                    <span>😴</span>
                  </div>
                </div>
              </div>
              
              <div className="form-group">
                <label>Observações</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Como foi sua sessão? Alguma observação importante?"
                  rows="3"
                />
              </div>
              
              <div className="form-actions">
                <button type="button" onClick={() => setShowForm(false)}>
                  Cancelar
                </button>
                <button type="submit" className="primary">
                  Salvar Sessão
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
        

      {/* Lista de Sessões */}
      <div className="sessions-list">
        <h3>Histórico de Sessões</h3>
        
        {sessions.length === 0 ? (
          <div className="empty-sessions">
            <p>Nenhuma sessão registrada ainda</p>
          </div>
        ) : (
          <div className="sessions-grid">
            {sessions.map(session => (
              <div key={session.id} className="session-card">
                <div className="session-header">
                  <span className="session-date">
                    {formatDate(session.startTime)}
                  </span>
                  <button 
                    onClick={() => onDeleteSession(session.id)}
                    className="delete-btn"
                  >
                    🗑️
                  </button>
                </div>
                
                <div className="session-details">
                  <div className="detail">
                    <span>Duração:</span>
                    <strong>{calculateDuration(session.startTime, session.endTime)}</strong>
                  </div>
                  
                  {session.breaks && (
                    <div className="detail">
                      <span>Pausas:</span>
                      <strong>{session.breaks}m</strong>
                    </div>
                  )}
                  
                  <div className="detail">
                    <span>Cansaço:</span>
                    <strong className={`fatigue-${session.fatigueLevel}`}>
                      {session.fatigueLevel}/10
                    </strong>
                  </div>
                </div>
                
                {session.notes && (
                  <div className="session-notes">
                    <p>{session.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionManager;