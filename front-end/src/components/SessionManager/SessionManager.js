import React, { useState, useEffect } from 'react';
import './SessionManager.css';

// =========================================================
// FUNÇÕES UTILITÁRIAS (Formatando datas da API Java)
// =========================================================
const formatDate = (isoString) => {
    if (!isoString) return 'N/A';

    try {
        // 1. Limpa a string (como fizemos antes)
        const cleanedString = isoString.replace(/\[UTC\]$/, ''); 
        
        // 2. Cria o objeto Date
        const date = new Date(cleanedString);

        if (isNaN(date.getTime())) {
             // Tenta uma nova abordagem de parsing se a primeira falhar
             // O fuso horário pode estar sendo omitido no banco, gerando anomalia
             const parts = cleanedString.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/);
             if (parts) {
                 // Cria a data localmente no fuso do banco, ignorando o Z (UTC)
                 date = new Date(parts[1], parts[2] - 1, parts[3], parts[4], parts[5], parts[6]);
             } else {
                 throw new Error('Formato de data irrecuperável.');
             }
        }
        
        // 3. Formata manualmente para forçar o GMT-03:00 (se este for o fuso do banco)
        // O método mais robusto é usar Intl.DateTimeFormat com o timezone alvo.
        const options = { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit', 
            hour12: false,
            // Força a interpretação como horário do Brasil (GMT-3)
            timeZone: 'America/Sao_Paulo' 
        };
        
        // Usamos toLocaleString, mas com a timezone especificada
        return date.toLocaleString('pt-BR', options);
        
    } catch (e) {
        console.error("ERRO [TZ]: Falha ao formatar ISO string:", e);
        return 'Data Inválida';
    }
};
// =========================================================
// COMPONENTE PRINCIPAL
// =========================================================
const SessionManager = ({ onDeleteSession }) => {
    // Estados do Formulário (mantidos, mas não usados para o POST automático)
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        startTime: '',
        endTime: '',
        breaks: '',
        notes: '',
        fatigueLevel: 5
    });

    const [showCommentModal, setShowCommentModal] = useState(false); // NOVO
    const [newComment, setNewComment] = useState('');

    // Handler para o campo de texto
    const handleCommentChange = (event) => {
        setNewComment(event.target.value);
    };

    // Estados de Sessão e Usuário
    const [sessions, setSessions] = useState([]);
    const userId = 1; // ID do Usuário Fixo para o escopo

    // ---------------------------------------------------------
    // AÇÃO 1: FETCH (GET) - Carregar Histórico
    // ---------------------------------------------------------
    const fetchSessions = async () => {
        const url = `http://localhost:8080/api/users/${userId}/sessions`;
        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Erro ${response.status} ao buscar sessões.`);
            }

            // O JSON retornado pela API é diretamente setado, usando nomes de campos Java
            const sessionsData = await response.json();
            setSessions(sessionsData); 

        } catch (error) {
            console.error("Erro ao carregar sessões:", error);
            // Poderia adicionar um alerta de erro aqui
        }
    };
    
    // Executa a busca na montagem do componente
    useEffect(() => {
        fetchSessions();
    }, []); 


    // ---------------------------------------------------------
    // AÇÃO 2: START (POST) - Iniciar Nova Sessão
    // ---------------------------------------------------------
    const startNewSession = async (comment) => {
        const url = `http://localhost:8080/api/users/${userId}/sessions`;
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  comentario: comment,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Falha ao iniciar sessão: ${response.status} - ${errorData.message || 'Erro desconhecido'}`);
            }

            const newSession = await response.json();
            
            // Adiciona a nova sessão (que estará "Em Andamento") à lista
            setSessions(prevSessions => [...prevSessions, newSession]);

            console.log('Sessão iniciada com sucesso:', newSession);
            
        } catch (error) {
            console.error("Erro técnico na API (POST /sessions):", error);
            alert(`Erro ao iniciar sessão: ${error.message}`);
        }
    };

    const handleSubmitNewSession = async (e) => {
        e.preventDefault(); // Evita o refresh da página

        // Chama o POST com o comentário
        startNewSession(newComment); 

        // Fecha o modal e limpa o campo
        setNewComment('');
        setShowCommentModal(false); 
    };

    // ---------------------------------------------------------
    // AÇÃO 3: DELETE - Deletar Sessão
    // ---------------------------------------------------------

    const handleDeleteSession = async (id) => {
    const url = `http://localhost:8080/api/sessions/${id}`;

    // Confirmação para evitar exclusão acidental
    if (!window.confirm(`Tem certeza que deseja deletar a sessão ID ${id}?`)) {
        return;
    }
    
    try {
        // 1. Requisição DELETE
        const response = await fetch(url, {
            method: 'DELETE',
            // O DELETE não requer Content-Type se não tiver body
        });

        // O status 204 NO CONTENT é o esperado para o DELETE bem-sucedido
        if (response.status !== 204) {
             // Tenta ler o erro se o status for 4xx ou 5xx
            const errorText = await response.text();
            throw new Error(`Falha ao deletar sessão: ${response.status} - ${errorText || 'Erro desconhecido'}`);
        }

        // 2. Atualiza o State (Immutability)
        // Remove a sessão do array de sessões sem recarregar a página
        setSessions(prevSessions => prevSessions.filter(s => s.id !== id));

        console.log(`Sessão ID ${id} deletada com sucesso.`);

    } catch (error) {
        console.error("Erro técnico na API (DELETE /sessions):", error);
        alert(`Erro ao deletar: ${error.message}`);
    }
};

    // ---------------------------------------------------------
    // AÇÃO 4: END (PUT) - Encerrar Sessão
    // ---------------------------------------------------------

// Função para encerrar uma sessão
const handleEndSession = async (id) => {
    const url = `http://localhost:8080/api/sessions/${id}`;
    
    try {
        // 1. Requisição PUT para o novo endpoint
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            // Não há body, pois o backend usa o ID e a hora atual
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Falha ao encerrar sessão: ${response.status} - ${errorData.message || 'Erro desconhecido'}`);
        }

        // 2. Recebe a SessionWork ATUALIZADA
        const updatedSession = await response.json();
        
        // 3. Atualiza o State (Immutability)
        // Substitui a sessão antiga pela versão atualizada (agora com fimSessao e duracaoMinutos)
        setSessions(prevSessions => 
            prevSessions.map(s => s.id === id ? updatedSession : s)
        );

        console.log(`Sessão ID ${id} encerrada com sucesso.`, updatedSession);

    } catch (error) {
        console.error("Erro técnico na API (PUT /end):", error);
        alert(`Erro ao encerrar sessão: ${error.message}`);
    }
};

    // ---------------------------------------------------------
    // RENDERIZAÇÃO
    // ---------------------------------------------------------
    return (
        <div className="session-manager">
            <div className="section-header">
                <h1>Gestão de Sessões</h1>
                <p>Registre e acompanhe suas sessões de trabalho</p>
            </div>

            <div className="session-actions">
                <button 
                    className="add-session-btn"
                    onClick={() => setShowCommentModal(true)} // Chama o POST
                >
                    <span>+</span>
                    Nova Sessão
                </button>
            </div>

          {/* NOVO: Formulário de Comentário (Modal) */}
{showCommentModal && (
    <div className="modal-overlay">
        <div className="modal-content">
            <h3>📝 Iniciar Nova Sessão</h3>
            <form onSubmit={handleSubmitNewSession}>
                <div className="form-group">
                    <label htmlFor="newComment">Comentário Inicial</label>
                    <textarea
                        id="newComment"
                        name="newComment"
                        value={newComment}
                        onChange={handleCommentChange}
                        placeholder="Descreva o foco do seu trabalho (Ex: Desenvolvimento da feature X)."
                        rows="4"
                    />
                </div>

                <div className="form-actions">
                    <button type="button" onClick={() => setShowCommentModal(false)}>
                        Cancelar
                    </button>
                    <button type="submit" className="primary">
                        Iniciar Sessão
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
                        <p>Carregando ou Nenhuma sessão registrada ainda</p>
                    </div>
                ) : (
                    <div className="sessions-grid">
                        {sessions.map(session => (
                            <div key={session.id} 
      className={`session-card ${session.fimSessao === null ? 'status-open' : 'status-closed'}`}>
    
    <div className="session-header">
        <span className="session-status">
            {/* LÓGICA FINAL REFORÇADA: Checa se o valor é Falsy (null, undefined, "") OU a string "null" */}
            {!session.fimSessao || session.fimSessao === "null" ? (
                // Se o campo for nulo (incluindo string vazia), está Em Andamento
                <strong>🟢 EM ANDAMENTO</strong> 
            ) : (
                <strong>⚫ Encerrada</strong> // Sessão Fechada
            )}
        </span>

        {/* BOTÃO DE ENCERRAR (Visível apenas se EM ANDAMENTO) */}
        {(!session.fimSessao || session.fimSessao === "null") && (
            <button 
                onClick={() => handleEndSession(session.id)} // Chama a função PUT
                className="end-session-btn"
            >
                Encerrar
            </button>
        )}
                                    
                                    <button 
                                        onClick={() => handleDeleteSession(session.id)}
                                        className="delete-btn"
                                    >
                                        🗑️
                                    </button>
                                </div>
                                
                                <div className="session-details">
                                    {/* Exibição da Data de Início */}
                                    <div className="detail">
                                        <span>Início da Sessão:</span>
                                        <strong>{formatDate(session.inicioSessao)}</strong>
                                    </div>
                                    
                                    {/* Exibição da Data de Fim/Status */}
                                    <div className="detail">
                                        <span>Fim da Sessão:</span>
                                       <strong>
                {session.fimSessao === null || session.fimSessao === "null" ? (
                    'N/A' // Opcional, ou poderia ser 'Em Andamento'
                ) : (
                    formatDate(session.fimSessao)
                )}
            </strong>
                                    </div>

                                    {/* Duração (Só exibe se a sessão estiver fechada) */}
                                    {session.fimSessao && (
                                        <div className="detail">
                                            <span>Duração:</span>
                                            <strong>{session.duracaoMinutos} min</strong>
                                        </div>
                                    )}

                                    {/* Pausas */}
                                    {session.pausaMinutos > 0 && (
                                        <div className="detail">
                                            <span>Pausas:</span>
                                            <strong>{session.pausaMinutos}m</strong>
                                        </div>
                                    )}
                                    
                                    {/* Cansaço */}
                                    <div className="detail">
                                        <span>Cansaço:</span>
                                        <strong className={`fatigue-${session.nivelCansaco}`}>
                                            {session.nivelCansaco || 0}/10
                                        </strong>
                                    </div>
                                </div>
                                
                                {/* Comentário (comentario || default) */}
                                <div className="session-comment">
                                    <p>
                                        **Comentário:** {session.comentario || 'Trabalhando na FIAP'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SessionManager;