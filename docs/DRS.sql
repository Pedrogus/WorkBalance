-- =============================================================================
-- WorkBalance Database
-- DRS (Data Recovery and Security) Script
-- Operações de recuperação, limpeza e segurança de dados
-- =============================================================================

-- =============================================================================
-- 1. BACKUP E RECUPERAÇÃO
-- =============================================================================

-- Criar tabela de backup para TB_USERS
CREATE TABLE TB_USERS_BACKUP AS SELECT * FROM TB_USERS;

-- Criar tabela de backup para TB_SESSIONS
CREATE TABLE TB_SESSIONS_BACKUP AS SELECT * FROM TB_SESSIONS;

-- =============================================================================
-- 2. LIMPEZA E MANUTENÇÃO DE DADOS
-- =============================================================================

-- Deletar sessões antigas (mais de 1 ano)
DELETE FROM TB_SESSIONS
WHERE INICIO_SESSAO < ADD_MONTHS(SYSDATE, -12);

-- Deletar usuários inativos (sem sessões nos últimos 6 meses)
DELETE FROM TB_USERS
WHERE ID_USER NOT IN (
    SELECT DISTINCT ID_USER FROM TB_SESSIONS
    WHERE INICIO_SESSAO > ADD_MONTHS(SYSDATE, -6)
);

-- Limpar comentários vazios ou nulos
UPDATE TB_SESSIONS
SET COMENTARIO = 'Sem comentário'
WHERE COMENTARIO IS NULL OR COMENTARIO = '';

-- =============================================================================
-- 3. VALIDAÇÃO E INTEGRIDADE DE DADOS
-- =============================================================================

-- Verificar registros órfãos (sessões sem usuário)
SELECT s.ID_SESSION, s.ID_USER, s.INICIO_SESSAO
FROM TB_SESSIONS s
WHERE s.ID_USER NOT IN (SELECT ID_USER FROM TB_USERS);

-- Verificar data de fim anterior à data de início
SELECT ID_SESSION, INICIO_SESSAO, FIM_SESSAO
FROM TB_SESSIONS
WHERE FIM_SESSAO < INICIO_SESSAO;

-- Verificar durações inconsistentes (duracao_minutos não corresponde ao intervalo)
SELECT ID_SESSION, INICIO_SESSAO, FIM_SESSAO, DURACAO_MINUTOS,
       ROUND((FIM_SESSAO - INICIO_SESSAO) * 24 * 60) as DURACAO_CALCULADA
FROM TB_SESSIONS
WHERE DURACAO_MINUTOS IS NOT NULL 
AND FIM_SESSAO IS NOT NULL
AND ABS(DURACAO_MINUTOS - ROUND((FIM_SESSAO - INICIO_SESSAO) * 24 * 60)) > 5;

-- Verificar emails duplicados
SELECT EMAIL, COUNT(*) as TOTAL
FROM TB_USERS
GROUP BY EMAIL
HAVING COUNT(*) > 1;

-- =============================================================================
-- 4. RESTAURAÇÃO DE DADOS
-- =============================================================================

-- Restaurar TB_USERS a partir do backup (se necessário)
-- TRUNCATE TABLE TB_USERS;
-- INSERT INTO TB_USERS SELECT * FROM TB_USERS_BACKUP;
-- COMMIT;

-- Restaurar TB_SESSIONS a partir do backup (se necessário)
-- TRUNCATE TABLE TB_SESSIONS;
-- INSERT INTO TB_SESSIONS SELECT * FROM TB_SESSIONS_BACKUP;
-- COMMIT;

-- =============================================================================
-- 5. AUDITORIA E RELATÓRIOS
-- =============================================================================

-- Relatório de atividades por período
SELECT 
    u.ID_USER,
    u.NOME,
    COUNT(s.ID_SESSION) as TOTAL_SESSOES,
    SUM(s.DURACAO_MINUTOS) as TOTAL_MINUTOS_TRABALHO,
    AVG(s.NIVEL_CANSACO) as NIVEL_CANSACO_MEDIO,
    MAX(s.INICIO_SESSAO) as ULTIMA_SESSAO
FROM TB_USERS u
LEFT JOIN TB_SESSIONS s ON u.ID_USER = s.ID_USER
GROUP BY u.ID_USER, u.NOME
ORDER BY TOTAL_SESSOES DESC;

-- Usuários mais cansados (nível médio de cansaço acima de 3)
SELECT 
    u.NOME,
    ROUND(AVG(s.NIVEL_CANSACO), 2) as NIVEL_CANSACO_MEDIO,
    COUNT(s.ID_SESSION) as TOTAL_SESSOES
FROM TB_USERS u
JOIN TB_SESSIONS s ON u.ID_USER = s.ID_USER
GROUP BY u.NOME
HAVING AVG(s.NIVEL_CANSACO) > 3
ORDER BY NIVEL_CANSACO_MEDIO DESC;

-- Padrão de pausas por usuário
SELECT 
    u.NOME,
    ROUND(AVG(s.PAUSA_MINUTOS), 2) as PAUSA_MEDIA,
    MIN(s.PAUSA_MINUTOS) as PAUSA_MINIMA,
    MAX(s.PAUSA_MINUTOS) as PAUSA_MAXIMA
FROM TB_USERS u
JOIN TB_SESSIONS s ON u.ID_USER = s.ID_USER
WHERE s.PAUSA_MINUTOS IS NOT NULL
GROUP BY u.NOME
ORDER BY PAUSA_MEDIA DESC;

-- =============================================================================
-- 6. OPERAÇÕES DE SEGURANÇA
-- =============================================================================

-- Mascarar senhas antes de exports (exemplo)
SELECT 
    ID_USER,
    NOME,
    SUBSTR(EMAIL, 1, 2) || '****' || SUBSTR(EMAIL, INSTR(EMAIL, '@')) as EMAIL_MASCARADO,
    '***' as SENHA_MASCARADA,
    DEPARTAMENTO,
    CARGO,
    DATA_CADASTRO
FROM TB_USERS;

-- Resetar senha de um usuário (exemplo)
-- UPDATE TB_USERS 
-- SET SENHA = 'temp_password_123'
-- WHERE ID_USER = 1;
-- COMMIT;

-- =============================================================================
-- 7. OTIMIZAÇÃO E ANÁLISE
-- =============================================================================

-- Analisar espaço utilizado pelas tabelas
SELECT 
    table_name,
    ROUND(num_rows * avg_row_len / 1024 / 1024, 2) as TAMANHO_MB
FROM user_tables
WHERE table_name IN ('TB_USERS', 'TB_SESSIONS', 'TB_USERS_BACKUP', 'TB_SESSIONS_BACKUP');

-- Listar índices e seu status
SELECT 
    index_name,
    table_name,
    status
FROM user_indexes
WHERE table_name IN ('TB_USERS', 'TB_SESSIONS');

-- Recriar estatísticas das tabelas (para otimização de queries)
-- ANALYZE TABLE TB_USERS COMPUTE STATISTICS;
-- ANALYZE TABLE TB_SESSIONS COMPUTE STATISTICS;

-- =============================================================================
-- 8. LIMPEZA DE BACKUP (OPCIONAL)
-- =============================================================================

-- Deletar tabelas de backup após confirmação de recuperação bem-sucedida
-- DROP TABLE TB_USERS_BACKUP;
-- DROP TABLE TB_SESSIONS_BACKUP;
