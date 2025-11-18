import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './App.css';

// Componentes
import Header from './components/Header/Header';
import Dashboard from './components/Dashboard/Dashboard';
import SessionManager from './components/SessionManager/SessionManager';
import Analytics from './components/Analytics/Analytics';
import WellnessTips from './components/WellnessTips/WellnessTips';

// Hook e Login
import useSessionStats from './components/useSessionsStats'; 
import Login from './components/Login/Login'; 
import AuthWrapper from './components/Login/AuthWrapper'; // Importação CRÍTICA

const API_BASE_URL = "http://localhost:8080/api";

// Função para buscar o ID persistido no localStorage
const getInitialUserId = () => {
    const storedId = localStorage.getItem('userId');
    // Garante que o ID é um número válido ou null
    if (storedId && storedId !== 'null' && storedId !== 'undefined') {
        return parseInt(storedId, 10);
    }
    return null; 
};

function App() {
    // ESTADO 1: Gerencia o ID do usuário (carrega do localStorage)
    const [userId, setUserId] = useState(getInitialUserId); 
    const [sessions, setSessions] = useState([]); 
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isLoading, setIsLoading] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false); // Estado CRÍTICO para o AuthWrapper

    // ********************************************
    // LÓGICA DE AUTENTICAÇÃO
    // ********************************************

    const handleLoginSuccess = (id) => {
        setUserId(id); 
        localStorage.setItem('userId', id.toString()); // Persiste o ID
        setShowLoginModal(false); // Fecha o modal
    };

    const handleLogout = useCallback(() => {
        setUserId(null); 
        localStorage.removeItem('userId'); // Limpa a sessão
        setSessions([]); // Limpa os dados da sessão anterior
        setActiveTab('dashboard'); // Volta para a tela principal
    }, []);
    
    // ********************************************
    // LÓGICA DE BUSCA (Agora depende do userId)
    // ********************************************

    const fetchSessions = useCallback(async () => {
        // Se não houver userId, apenas limpa e desliga o loading. ESSENCIAL.
        if (!userId) {
            setSessions([]); 
            setIsLoading(false); 
            return;
        }

        setIsLoading(true);
        // CRÍTICO: Usa o userId do estado, corrigindo o uso de CURRENT_USER_ID
        const url = `${API_BASE_URL}/users/${userId}/sessions`; 

        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Resposta não OK da API.' }));
                throw new Error(`Erro ${response.status}: ${errorData.message || 'Falha ao buscar.'}`);
            }

            const sessionsData = await response.json();
            setSessions(sessionsData);

        } catch (error) {
            console.error("Erro ao carregar sessões:", error);
            // Se for erro de autenticação (ex: 401), desloga
            if (error.message.includes("401")) {
                handleLogout(); 
            }
        } finally {
            // ESSENCIAL: Garante que o estado de loading seja desligado
            setIsLoading(false); 
        }
    }, [userId, handleLogout]); 

    // Chama a função de busca sempre que o userId mudar
    useEffect(() => {
        fetchSessions();
    }, [fetchSessions]);

    // ********************************************
    // LÓGICA DE CÁLCULO
    // ********************************************

    const stats = useMemo(() => {
        return useSessionStats(sessions);
    }, [sessions]);

    const handleSessionAction = () => {
        // Recarrega os dados após qualquer POST/PUT/DELETE
        fetchSessions(); 
    };

    // ********************************************
    // RENDERIZAÇÃO CONDICIONAL
    // ********************************************

    // 1. Não logado: Exibe o wrapper de login (BUG CORRIGIDO)
    if (!userId) {
        return (
            <AuthWrapper 
                showLoginModal={showLoginModal}
                setShowLoginModal={setShowLoginModal}
                handleLoginSuccess={handleLoginSuccess}
            />
        );
    }
    
    // 2. Logado e Carregando: Exibe o loading
    if (isLoading) {
        return (
            <div className="App loading-state min-h-screen flex items-center justify-center bg-indigo-50">
                <p className="p-4 bg-indigo-100 text-indigo-700 rounded-lg shadow-lg font-semibold">
                    Carregando dados do servidor para o ID {userId}...
                </p>
            </div>
        );
    }

    // 3. Logado e Pronto: Exibe o App principal
    return (
        <div className="App">
            {/* Passa o userId e o handler de logout para o Header */}
            <Header 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                userId={userId} 
                onLogout={handleLogout} 
            /> 
            
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
                        // Passa o userId para o SessionManager realizar as ações POST/PUT/DELETE
                        userId={userId} 
                        onUpdateSessions={handleSessionAction} // Recarrega o App após CRUD
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