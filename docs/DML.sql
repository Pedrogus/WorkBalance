-- =============================================================================
-- WorkBalance Database
-- DML (Data Manipulation Language) Script
-- Inserção de dados de exemplo
-- =============================================================================

-- =============================================================================
-- Inserção de dados em TB_USERS
-- =============================================================================

INSERT INTO TB_USERS (ID_USER, NOME, EMAIL, SENHA, DEPARTAMENTO, CARGO, DATA_CADASTRO)
VALUES (1, 'João Silva', 'joao.silva@empresa.com', 'senha123', 'TI', 'Desenvolvedor', SYSDATE);

INSERT INTO TB_USERS (ID_USER, NOME, EMAIL, SENHA, DEPARTAMENTO, CARGO, DATA_CADASTRO)
VALUES (2, 'Maria Santos', 'maria.santos@empresa.com', 'senha456', 'RH', 'Gerente de RH', SYSDATE);

INSERT INTO TB_USERS (ID_USER, NOME, EMAIL, SENHA, DEPARTAMENTO, CARGO, DATA_CADASTRO)
VALUES (3, 'Pedro Oliveira', 'pedro.oliveira@empresa.com', 'senha789', 'TI', 'Analista de Sistemas', SYSDATE);

INSERT INTO TB_USERS (ID_USER, NOME, EMAIL, SENHA, DEPARTAMENTO, CARGO, DATA_CADASTRO)
VALUES (4, 'Ana Costa', 'ana.costa@empresa.com', 'senha101', 'Marketing', 'Especialista em Marketing', SYSDATE);

INSERT INTO TB_USERS (ID_USER, NOME, EMAIL, SENHA, DEPARTAMENTO, CARGO, DATA_CADASTRO)
VALUES (5, 'Carlos Mendes', 'carlos.mendes@empresa.com', 'senha202', 'Financeiro', 'Analista Financeiro', SYSDATE);

-- =============================================================================
-- Inserção de dados em TB_SESSIONS
-- =============================================================================

-- Sessões do usuário 1 (João Silva)
INSERT INTO TB_SESSIONS (ID_SESSION, ID_USER, INICIO_SESSAO, FIM_SESSAO, DURACAO_MINUTOS, PAUSA_MINUTOS, NIVEL_CANSACO, COMENTARIO)
VALUES (1, 1, TIMESTAMP '2025-11-14 08:00:00', TIMESTAMP '2025-11-14 12:30:00', 270, 30, 2, 'Trabalho de desenvolvimento');

INSERT INTO TB_SESSIONS (ID_SESSION, ID_USER, INICIO_SESSAO, FIM_SESSAO, DURACAO_MINUTOS, PAUSA_MINUTOS, NIVEL_CANSACO, COMENTARIO)
VALUES (2, 1, TIMESTAMP '2025-11-14 13:30:00', TIMESTAMP '2025-11-14 17:00:00', 210, 15, 3, 'Reunião de sprint + testes');

-- Sessões do usuário 2 (Maria Santos)
INSERT INTO TB_SESSIONS (ID_SESSION, ID_USER, INICIO_SESSAO, FIM_SESSAO, DURACAO_MINUTOS, PAUSA_MINUTOS, NIVEL_CANSACO, COMENTARIO)
VALUES (3, 2, TIMESTAMP '2025-11-14 09:00:00', TIMESTAMP '2025-11-14 12:00:00', 180, 20, 1, 'Análise de processos RH');

INSERT INTO TB_SESSIONS (ID_SESSION, ID_USER, INICIO_SESSAO, FIM_SESSAO, DURACAO_MINUTOS, PAUSA_MINUTOS, NIVEL_CANSACO, COMENTARIO)
VALUES (4, 2, TIMESTAMP '2025-11-14 13:00:00', TIMESTAMP '2025-11-14 18:00:00', 300, 30, 4, 'Recrutamento e entrevistas');

-- Sessões do usuário 3 (Pedro Oliveira)
INSERT INTO TB_SESSIONS (ID_SESSION, ID_USER, INICIO_SESSAO, FIM_SESSAO, DURACAO_MINUTOS, PAUSA_MINUTOS, NIVEL_CANSACO, COMENTARIO)
VALUES (5, 3, TIMESTAMP '2025-11-14 08:30:00', TIMESTAMP '2025-11-14 12:00:00', 210, 15, 2, 'Análise de requisitos');

INSERT INTO TB_SESSIONS (ID_SESSION, ID_USER, INICIO_SESSAO, FIM_SESSAO, DURACAO_MINUTOS, PAUSA_MINUTOS, NIVEL_CANSACO, COMENTARIO)
VALUES (6, 3, TIMESTAMP '2025-11-14 13:00:00', TIMESTAMP '2025-11-14 17:30:00', 270, 20, 3, 'Testes de sistema');

-- Sessões do usuário 4 (Ana Costa)
INSERT INTO TB_SESSIONS (ID_SESSION, ID_USER, INICIO_SESSAO, FIM_SESSAO, DURACAO_MINUTOS, PAUSA_MINUTOS, NIVEL_CANSACO, COMENTARIO)
VALUES (7, 4, TIMESTAMP '2025-11-14 09:00:00', TIMESTAMP '2025-11-14 12:30:00', 210, 25, 2, 'Campanha de marketing');

INSERT INTO TB_SESSIONS (ID_SESSION, ID_USER, INICIO_SESSAO, FIM_SESSAO, DURACAO_MINUTOS, PAUSA_MINUTOS, NIVEL_CANSACO, COMENTARIO)
VALUES (8, 4, TIMESTAMP '2025-11-14 14:00:00', TIMESTAMP '2025-11-14 18:00:00', 240, 30, 3, 'Análise de métricas');

-- Sessões do usuário 5 (Carlos Mendes)
INSERT INTO TB_SESSIONS (ID_SESSION, ID_USER, INICIO_SESSAO, FIM_SESSAO, DURACAO_MINUTOS, PAUSA_MINUTOS, NIVEL_CANSACO, COMENTARIO)
VALUES (9, 5, TIMESTAMP '2025-11-14 08:00:00', TIMESTAMP '2025-11-14 11:30:00', 210, 10, 2, 'Relatório financeiro');

INSERT INTO TB_SESSIONS (ID_SESSION, ID_USER, INICIO_SESSAO, FIM_SESSAO, DURACAO_MINUTOS, PAUSA_MINUTOS, NIVEL_CANSACO, COMENTARIO)
VALUES (10, 5, TIMESTAMP '2025-11-14 12:30:00', TIMESTAMP '2025-11-14 17:00:00', 270, 20, 4, 'Auditoria e conciliação');

-- Sessão em andamento (sem FIM_SESSAO)
INSERT INTO TB_SESSIONS (ID_SESSION, ID_USER, INICIO_SESSAO, DURACAO_MINUTOS, PAUSA_MINUTOS, NIVEL_CANSACO, COMENTARIO)
VALUES (11, 1, TIMESTAMP '2025-11-14 17:30:00', NULL, NULL, NULL, 'Sessão em andamento');

-- =============================================================================
-- Commit das transações
-- =============================================================================

COMMIT;

-- =============================================================================
-- Queries de verificação
-- =============================================================================

-- Listar todos os usuários
SELECT * FROM TB_USERS;

-- Listar todas as sessões
SELECT * FROM TB_SESSIONS;

-- Listar sessões por usuário com JOIN
SELECT u.NOME, s.INICIO_SESSAO, s.FIM_SESSAO, s.DURACAO_MINUTOS, s.NIVEL_CANSACO
FROM TB_USERS u
JOIN TB_SESSIONS s ON u.ID_USER = s.ID_USER
ORDER BY u.NOME, s.INICIO_SESSAO;

-- Total de sessões por usuário
SELECT u.NOME, COUNT(s.ID_SESSION) as TOTAL_SESSOES
FROM TB_USERS u
LEFT JOIN TB_SESSIONS s ON u.ID_USER = s.ID_USER
GROUP BY u.NOME
ORDER BY u.NOME;

-- Tempo total de trabalho por usuário
SELECT u.NOME, SUM(s.DURACAO_MINUTOS) as TOTAL_MINUTOS, 
       ROUND(SUM(s.DURACAO_MINUTOS) / 60, 2) as TOTAL_HORAS
FROM TB_USERS u
LEFT JOIN TB_SESSIONS s ON u.ID_USER = s.ID_USER
WHERE s.DURACAO_MINUTOS IS NOT NULL
GROUP BY u.NOME
ORDER BY TOTAL_HORAS DESC;
