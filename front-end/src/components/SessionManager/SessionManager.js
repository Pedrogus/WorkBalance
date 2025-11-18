import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './SessionManager.css'; // Importa o CSS

// URL base da API
const API_BASE_URL = "http://localhost:8080/api";

// ---------------------------------------------------------
// FUNÇÕES AUXILIARES DE DATA (CORREÇÃO HIPER-ROBUSTA DE PARSING)
// ---------------------------------------------------------

/**
 * Cria um objeto Date robustamente, tratando a string de data do backend.
 * Resolve problemas com strings não-ISO (ex: "2023-11-15 10:30:00.0 [UTC]").
 * * @param {string} dateString - A string de data a ser parseada, potencialmente não-ISO.
 * @returns {Date|null} Um objeto Date válido ou null.
 */
const safeDate = (dateString) => {
    if (!dateString) return null;
    
    // 1. Limpeza e Conversão para ISO 8601.
    // Substitui o espaço (delimitador comum em Timestamps JDBC) por 'T'
    // e remove o lixo como '[UTC]' ou outros sufixos de fuso horário não-padrão.
    let cleanedDateString = dateString
        .replace(/(\d{4}-\d{2}-\d{2})\s(\d{2}:\d{2}:\d{2})/, '$1T$2')
        .replace(/\[UTC\]/g, '')
        .trim();

    // 2. Tenta isolar a string ISO estrita para garantir compatibilidade.
    // Captura YYYY-MM-DDTHH:mm:ss[.sss] seguido opcionalmente por Z ou offset.
    const isoMatch = cleanedDateString.match(/(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?)/);
    
    // Se o regex encontrar uma parte ISO válida, usa-a. Caso contrário, usa a string limpa.
    const finalDateString = isoMatch ? isoMatch[1] : cleanedDateString;
    
    try {
        const date = new Date(finalDateString);
        // 3. Verifica se a data é válida
        return isNaN(date.getTime()) ? null : date;
    } catch (e) {
        console.error("Erro no safeDate ao parsear:", finalDateString, e);
        return null;
    }
};

/**
 * Formata a string de data e hora para exibição na UI.
 * @param {string} dateString - A string de data do backend.
 * @returns {string} Data e hora formatadas ou "Data Inválida".
 */
const formatDateString = (dateString) => {
    const date = safeDate(dateString);
    if (!date) return "Data Inválida";
    // Usa 'pt-BR' para garantir a formatação completa da data e hora
    return date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'medium' });
};


// ---------------------------------------------------------
// COMPONENTE PRINCIPAL
// ---------------------------------------------------------

const SessionManager = ({ userId, onUpdateSessions }) => {
    const [sessions, setSessions] = useState([]);
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [comment, setComment] = useState('');
    const [message, setMessage] = useState(null);
    const [activeSessionId, setActiveSessionId] = useState(null);

    // ---------------------------------------------------------
    // AÇÃO 1: FETCH (GET) - Carregar Histórico
    // ---------------------------------------------------------
    const fetchSessions = useCallback(async () => {
        if (!userId) {
            setMessage("Erro: ID de usuário não fornecido.");
            setSessions([]);
            return;
        }

        const url = `${API_BASE_URL}/users/${userId}/sessions`;
        try {
            const response = await fetch(url);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Resposta não OK da API.' }));
                throw new Error(`Erro ${response.status} ao buscar sessões: ${errorData.message || 'Falha na requisição.'}`);
            }

            const sessionsData = await response.json();
            setSessions(sessionsData);
            setMessage(null);

            const active = sessionsData.find(s => !s.fimSessao);
            if (active) {
                setIsSessionActive(true);
                setActiveSessionId(active.id);
                setComment(active.comentario || '');
            } else {
                setIsSessionActive(false);
                setActiveSessionId(null);
                setComment('');
            }

        } catch (error) {
            console.error("Erro ao carregar sessões:", error);
            setMessage(`Falha ao carregar sessões: ${error.message}`);
            setSessions([]);
        }
    }, [userId]);
    
    useEffect(() => {
        fetchSessions();
    }, [fetchSessions]); 

    // ---------------------------------------------------------
    // AÇÃO 4: DELETE - Eliminar Sessão
    // ---------------------------------------------------------
    const deleteSession = async (sessionId) => {
        // Usar um modal customizado em apps de produção.
        if (!window.confirm(`Tem certeza que deseja eliminar a sessão ${sessionId}? Esta ação é irreversível.`)) {
            return; 
        }
        
        const url = `${API_BASE_URL}/sessions/${sessionId}`;
        try {
            const response = await fetch(url, {
                method: 'DELETE',
            });

            if (response.status === 204 || response.ok) { // 204 No Content é o esperado
                setMessage(`Sessão ${sessionId} eliminada com sucesso.`);
            } else {
                 const errorData = await response.json().catch(() => ({ message: 'Resposta não OK da API.' }));
                 throw new Error(`Erro ${response.status} ao eliminar sessão: ${errorData.message || 'Falha na requisição.'}`);
            }
            
            // Se a sessão eliminada era a ativa, atualiza o estado
            if (sessionId === activeSessionId) {
                setIsSessionActive(false);
                setActiveSessionId(null);
                setComment('');
                onUpdateSessions(); 
            }
            
            fetchSessions(); // Recarrega a lista

        } catch (error) {
            console.error("Erro ao eliminar sessão:", error);
            setMessage(`Falha ao eliminar sessão: ${error.message}`);
        }
    };

    // ---------------------------------------------------------
    // OUTRAS AÇÕES (Start, End)
    // ---------------------------------------------------------
    const startSession = async () => {
        if (!userId) { setMessage("Erro de autenticação."); return; }
        const url = `${API_BASE_URL}/users/${userId}/sessions`;
        try {
            const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ comentario: comment }) });
            if (!response.ok) { const errorData = await response.json().catch(() => ({ message: 'Resposta não OK da API.' })); throw new Error(`Erro ${response.status} ao iniciar sessão: ${errorData.message || 'Falha na requisição.'}`); }
            setMessage("Sessão iniciada com sucesso!");
            onUpdateSessions(); fetchSessions();
        } catch (error) { console.error("Erro ao iniciar sessão:", error); setMessage(`Falha ao iniciar sessão: ${error.message}`); }
    };

    const endSession = async () => {
        if (!activeSessionId) { setMessage("Nenhuma sessão ativa para finalizar."); return; }
        const url = `${API_BASE_URL}/sessions/${activeSessionId}`;
        try {
            const response = await fetch(url, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ comentario: comment }) });
            if (!response.ok) { const errorData = await response.json().catch(() => ({ message: 'Resposta não OK da API.' })); throw new Error(`Erro ${response.status} ao finalizar sessão: ${errorData.message || 'Falha na requisição.'}`); }
            setMessage("Sessão finalizada com sucesso!");
            onUpdateSessions(); fetchSessions();
        } catch (error) { console.error("Erro ao finalizar sessão:", error); setMessage(`Falha ao finalizar sessão: ${error.message}`); }
    };
    
    // ---------------------------------------------------------
    // UI HELPER
    // ---------------------------------------------------------

    const formatDuration = (inicio, fim) => {
        const start = safeDate(inicio);
        const end = safeDate(fim);

        if (!end) return "Sessão em andamento";
        if (!start) return "Erro de Duração"; 

        const diffMs = end.getTime() - start.getTime();
        
        if (diffMs < 0) return "Duração Inválida";

        // Cálculo da duração 
        const totalSeconds = Math.floor(diffMs / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
    };

    const sortedSessions = useMemo(() => {
        // Ordena pela data de início, do mais recente para o mais antigo
        return [...sessions].sort((a, b) => {
            const dateA = safeDate(b.inicioSessao);
            const dateB = safeDate(a.inicioSessao);
            
            if (!dateA && !dateB) return 0;
            if (!dateA) return 1; 
            if (!dateB) return -1;
            
            return dateA.getTime() - dateB.getTime();
        });
    }, [sessions]);


    // ---------------------------------------------------------
    // RENDERIZAÇÃO
    // ---------------------------------------------------------

    return (
        <div className="session-manager-page">
            <div className="session-card">
                <div className="session-header">
                    <h1 className="session-title">Gestão de Sessões</h1>
                    <p className="session-subtitle">
                        {isSessionActive ? "Você tem uma sessão ativa!" : "Registre e acompanhe suas sessões de trabalho."}
                    </p>
                </div>

                {/* Área de Ação (Start/Stop) */}
                <div className="session-action-area">
                    <textarea
                        className="session-comment-input"
                        placeholder="Adicione um comentário para esta sessão (Ex: Projeto X, Estudo React)..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        disabled={userId === null} 
                    />

                    {isSessionActive ? (
                        <button 
                            className="session-button stop-button" 
                            onClick={endSession}
                            disabled={userId === null}
                        >
                            <span className="button-icon">🛑</span> Finalizar Sessão
                        </button>
                    ) : (
                        <button 
                            className="session-button start-button" 
                            onClick={startSession}
                            disabled={userId === null}
                        >
                            <span className="button-icon">▶️</span> Nova Sessão
                        </button>
                    )}
                </div>

                {/* Mensagens de feedback */}
                {message && <p className="session-message">{message}</p>}

                {/* Histórico de Sessões */}
                <h2 className="session-history-title">Histórico de Sessões</h2>

                {sortedSessions.length === 0 ? (
                    <div className="empty-state">
                        <span className="empty-icon">⏳</span>
                        <h2>Nenhuma sessão registrada ainda</h2>
                        <p>Comece sua primeira sessão de trabalho acima.</p>
                    </div>
                ) : (
                    <div className="session-list">
                        {sortedSessions.map((session) => (
                            <div key={session.id} className={`session-item ${session.fimSessao ? 'completed' : 'active'}`}>
                                <div className="session-info">
                                    <p className="session-duration">{formatDuration(session.inicioSessao, session.fimSessao)}</p>
                                    <p className="session-time">Início: {formatDateString(session.inicioSessao)}</p>
                                    {session.fimSessao && <p className="session-time">Fim: {formatDateString(session.fimSessao)}</p>}
                                </div>
                                <p className="session-comment">{session.comentario || 'Sem comentário'}</p>
                                
                                {/* Botão de Eliminar */}
                                <button 
                                    className="session-button delete-button small-button" 
                                    onClick={() => deleteSession(session.id)}
                                    disabled={userId === null || isSessionActive} // Não permite apagar se for a sessão ativa
                                >
                                    <span className="button-icon">🗑️</span> Eliminar
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SessionManager;