import React, { useState } from 'react';
import './Login.css';

const API_BASE_URL = "http://localhost:8080/api";

const Login = ({ onLoginSuccess, onClose }) => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState(''); // CRÍTICO: Deve ser 'senha' para o backend
    const [error, setError] = useState(null);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoggingIn(true);

        const url = `${API_BASE_URL}/users/login`; 

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Usa o Record User: { "email": "...", "senha": "..." }
                body: JSON.stringify({ email, senha }), 
            });

            const data = await response.json();

            if (!response.ok) {
                // Trata 401 Unauthorized ou outros erros
                throw new Error(data.message || 'Credenciais inválidas. Tente novamente.');
            }

            // Sucesso: Recebe o ID do usuário (data deve ser { idUser: Long })
            const { idUser } = data; 
            
            if (idUser) {
                onLoginSuccess(idUser); 
            } else {
                // Caso a API retorne 200, mas sem idUser
                throw new Error('Autenticação bem-sucedida, mas ID do usuário não retornado.');
            }

        } catch (err) {
            console.error("Erro no Login:", err);
            setError(err.message);
        } finally {
            setIsLoggingIn(false);
        }
    };

    return (
        // Substituindo classes Tailwind por .login-card
        <div className="login-card"> 
            <h2 className="login-title">Acesso WorkBalance</h2>
            
            {error && (
                <p className="login-error-message">{error}</p>
            )}
            
            <form onSubmit={handleSubmit} className="login-form">
                <input 
                    type="email" 
                    placeholder="E-mail" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    className="login-input" // Nova classe
                />
                <input 
                    type="password" 
                    placeholder="Senha" 
                    value={senha} 
                    onChange={(e) => setSenha(e.target.value)} 
                    required 
                    className="login-input" // Nova classe
                />
                <button 
                    type="submit"
                    disabled={isLoggingIn}
                    // Nova classe com lógica condicional
                    className={`login-button ${isLoggingIn ? 'loading' : ''}`}
                >
                    {isLoggingIn ? 'Autenticando...' : 'Entrar'}
                </button>
            </form>

            <button 
                onClick={onClose} 
                className="login-cancel-button" // Nova classe
            >
                Cancelar
            </button>
        </div>
    );
};

export default Login;