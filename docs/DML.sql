-- =============================================================================
-- WorkBalance Database
-- DML (Data Manipulation Language) Script
-- Inserção de dados de exemplo
-- =============================================================================

-- =============================================================================
-- Inserção de dados em TB_USERS
-- =============================================================================

INSERT INTO TB_USERS ( NOME, EMAIL, SENHA, DEPARTAMENTO, CARGO)
VALUES ('João Silva', 'joao.silva@empresa.com', 'senha123', 'TI', 'Desenvolvedor');

INSERT INTO TB_USERS ( NOME, EMAIL, SENHA, DEPARTAMENTO, CARGO)
VALUES ('Maria Santos', 'maria.santos@empresa.com', 'senha456', 'RH', 'Gerente de RH');

INSERT INTO TB_USERS ( NOME, EMAIL, SENHA, DEPARTAMENTO, CARGO)
VALUES ('Pedro Oliveira', 'pedro.oliveira@empresa.com', 'senha789', 'TI', 'Analista de Sistemas');

INSERT INTO TB_USERS ( NOME, EMAIL, SENHA, DEPARTAMENTO, CARGO)
VALUES ('Ana Costa', 'ana.costa@empresa.com', 'senha101', 'Marketing', 'Especialista em Marketing');

INSERT INTO TB_USERS ( NOME, EMAIL, SENHA, DEPARTAMENTO, CARGO)
VALUES ('Carlos Mendes', 'carlos.mendes@empresa.com', 'senha202', 'Financeiro', 'Analista Financeiro');

-- =============================================================================
-- Inserção de dados em TB_SESSIONS
-- =============================================================================

-- Sessões do usuário 1 (João Silva)
INSERT INTO TB_SESSIONS (ID_USER, INICIO_SESSAO, FIM_SESSAO, DURACAO_MINUTOS, PAUSA_MINUTOS, NIVEL_CANSACO, COMENTARIO)
VALUES (1, TIMESTAMP '2025-11-14 08:00:00', TIMESTAMP '2025-11-14 12:30:00', 270, 30, 2, 'Trabalho de desenvolvimento');

INSERT INTO TB_SESSIONS (ID_USER, INICIO_SESSAO, FIM_SESSAO, DURACAO_MINUTOS, PAUSA_MINUTOS, NIVEL_CANSACO, COMENTARIO)
VALUES (1, TIMESTAMP '2025-11-14 13:30:00', TIMESTAMP '2025-11-14 17:00:00', 210, 15, 3, 'Reunião de sprint + testes');

-- Sessões do usuário 2 (Maria Santos)
INSERT INTO TB_SESSIONS (ID_USER, INICIO_SESSAO, FIM_SESSAO, DURACAO_MINUTOS, PAUSA_MINUTOS, NIVEL_CANSACO, COMENTARIO)
VALUES (2, TIMESTAMP '2025-11-14 09:00:00', TIMESTAMP '2025-11-14 12:00:00', 180, 20, 1, 'Análise de processos RH');

INSERT INTO TB_SESSIONS (ID_USER, INICIO_SESSAO, FIM_SESSAO, DURACAO_MINUTOS, PAUSA_MINUTOS, NIVEL_CANSACO, COMENTARIO)
VALUES (2, TIMESTAMP '2025-11-14 13:00:00', TIMESTAMP '2025-11-14 18:00:00', 300, 30, 4, 'Recrutamento e entrevistas');

-- Sessões do usuário 3 (Pedro Oliveira)
INSERT INTO TB_SESSIONS (ID_USER, INICIO_SESSAO, FIM_SESSAO, DURACAO_MINUTOS, PAUSA_MINUTOS, NIVEL_CANSACO, COMENTARIO)
VALUES (3, TIMESTAMP '2025-11-14 08:30:00', TIMESTAMP '2025-11-14 12:00:00', 210, 15, 2, 'Análise de requisitos');

INSERT INTO TB_SESSIONS (ID_USER, INICIO_SESSAO, FIM_SESSAO, DURACAO_MINUTOS, PAUSA_MINUTOS, NIVEL_CANSACO, COMENTARIO)
VALUES (3, TIMESTAMP '2025-11-14 13:00:00', TIMESTAMP '2025-11-14 17:30:00', 270, 20, 3, 'Testes de sistema');

-- Sessões do usuário 4 (Ana Costa)
INSERT INTO TB_SESSIONS (ID_USER, INICIO_SESSAO, FIM_SESSAO, DURACAO_MINUTOS, PAUSA_MINUTOS, NIVEL_CANSACO, COMENTARIO)
VALUES (4, TIMESTAMP '2025-11-14 09:00:00', TIMESTAMP '2025-11-14 12:30:00', 210, 25, 2, 'Campanha de marketing');

INSERT INTO TB_SESSIONS (ID_USER, INICIO_SESSAO, FIM_SESSAO, DURACAO_MINUTOS, PAUSA_MINUTOS, NIVEL_CANSACO, COMENTARIO)
VALUES (4, TIMESTAMP '2025-11-14 14:00:00', TIMESTAMP '2025-11-14 18:00:00', 240, 30, 3, 'Análise de métricas');

-- Sessões do usuário 5 (Carlos Mendes)
INSERT INTO TB_SESSIONS (ID_USER, INICIO_SESSAO, FIM_SESSAO, DURACAO_MINUTOS, PAUSA_MINUTOS, NIVEL_CANSACO, COMENTARIO)
VALUES (5, TIMESTAMP '2025-11-14 08:00:00', TIMESTAMP '2025-11-14 11:30:00', 210, 10, 2, 'Relatório financeiro');

INSERT INTO TB_SESSIONS (ID_USER, INICIO_SESSAO, FIM_SESSAO, DURACAO_MINUTOS, PAUSA_MINUTOS, NIVEL_CANSACO, COMENTARIO)
VALUES (5, TIMESTAMP '2025-11-14 12:30:00', TIMESTAMP '2025-11-14 17:00:00', 270, 20, 4, 'Auditoria e conciliação');

-- Sessão em andamento (sem FIM_SESSAO)
INSERT INTO TB_SESSIONS (ID_USER, INICIO_SESSAO, DURACAO_MINUTOS, PAUSA_MINUTOS, NIVEL_CANSACO, COMENTARIO)
VALUES (1, TIMESTAMP '2025-11-14 17:30:00', NULL, NULL, NULL, 'Sessão em andamento');


-- Pausa das sessões
INSERT INTO TB_BREAK_LOG (ID_SESSION, INICIO_PAUSA, FIM_PAUSA, PAUSA_MINUTOS, TIPO, COMENTARIO)
VALUES ( 1, TIMESTAMP '2025-11-14 10:00:00', TIMESTAMP '2025-11-14 10:15:00', 15, 'Café', 'Pausa para café');

INSERT INTO TB_BREAK_LOG (ID_SESSION, INICIO_PAUSA, FIM_PAUSA, PAUSA_MINUTOS, TIPO, COMENTARIO)
VALUES ( 2, TIMESTAMP '2025-11-14 15:00:00', TIMESTAMP '2025-11-14 15:10:00', 10, 'Alongamento', 'Pausa rápida para esticar as pernas');

INSERT INTO TB_BREAK_LOG (ID_SESSION, INICIO_PAUSA, FIM_PAUSA, PAUSA_MINUTOS, TIPO, COMENTARIO)
VALUES ( 3, TIMESTAMP '2025-11-14 10:30:00', TIMESTAMP '2025-11-14 10:40:00', 10, 'Café', 'Pausa durante análise de processos');

INSERT INTO TB_BREAK_LOG (ID_SESSION, INICIO_PAUSA, FIM_PAUSA, PAUSA_MINUTOS, TIPO, COMENTARIO)
VALUES ( 4, TIMESTAMP '2025-11-14 15:30:00', TIMESTAMP '2025-11-14 15:50:00', 20, 'Banheiro', 'Pausa estendida');

INSERT INTO TB_BREAK_LOG (ID_SESSION, INICIO_PAUSA, FIM_PAUSA, PAUSA_MINUTOS, TIPO, COMENTARIO)
VALUES ( 5, TIMESTAMP '2025-11-14 10:00:00', TIMESTAMP '2025-11-14 10:12:00', 12, 'Café', 'Pausa curta entre análises');


-- Pausa em sessão em andamento
INSERT INTO TB_BREAK_LOG (ID_SESSION, INICIO_PAUSA, FIM_PAUSA, PAUSA_MINUTOS, TIPO, COMENTARIO)
VALUES ( 11, TIMESTAMP '2025-11-14 18:10:00', NULL, NULL, 'Descanso', 'Pausa ainda em andamento');

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

-- Listar todas as pausas
SELECT * FROM TB_BREAK_LOG;

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
