import React from 'react';
import Login from './Login'; // Importa o componente de login

// Este componente é renderizado quando o usuário não está logado
const AuthWrapper = ({ showLoginModal, setShowLoginModal, handleLoginSuccess }) => {
    
    // Estilo simples de modal (pode ser movido para CSS)
    const modalStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(5px)'
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <h1 className="text-4xl font-extrabold text-indigo-600 mb-6">WorkBalance App</h1>
            <p className="text-lg text-gray-600 mb-8 text-center">
                Por favor, faça login para acessar suas estatísticas de sessão.
            </p>
            
            <button 
                onClick={() => setShowLoginModal(true)}
                className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-xl hover:bg-indigo-700 transition duration-300"
            >
                Acessar Login
            </button>
            
            {/* Modal de Login */}
            {showLoginModal && (
                <div style={modalStyle}>
                    <div className="relative">
                        <Login 
                            onLoginSuccess={handleLoginSuccess} 
                            onClose={() => setShowLoginModal(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AuthWrapper;