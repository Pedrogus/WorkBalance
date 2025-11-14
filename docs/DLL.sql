-- =============================================================================
-- WorkBalance Database Schema
-- DDL (Data Definition Language) Script
-- =============================================================================

-- Tabela TB_USERS
-- Armazena informações dos usuarios do sistema
CREATE TABLE TB_USERS (
    ID_USER         NUMBER(10) PRIMARY KEY,
    NOME            VARCHAR2(100) NOT NULL,
    EMAIL           VARCHAR2(100) UNIQUE NOT NULL,
    SENHA           VARCHAR2(100) NOT NULL,
    DEPARTAMENTO    VARCHAR2(50),
    CARGO           VARCHAR2(50)
);

-- Tabela TB_SESSIONS
-- Armazena os períodos de trabalho dos usuários
CREATE TABLE TB_SESSIONS (
    ID_SESSION      NUMBER(10) PRIMARY KEY,
    ID_USER         NUMBER(10) NOT NULL,
    INICIO_SESSAO   TIMESTAMP NOT NULL,
    FIM_SESSAO      TIMESTAMP,
    DURACAO_MINUTOS NUMBER(5),
    PAUSA_MINUTOS   NUMBER(5),
    NIVEL_CANSACO   NUMBER(1),
    COMENTARIO      VARCHAR2(255),
    CONSTRAINT FK_SESSIONS_USERS FOREIGN KEY (ID_USER) 
        REFERENCES TB_USERS(ID_USER)
);

-- Índice para melhorar performance de buscas por usuário
CREATE INDEX IDX_SESSIONS_USER ON TB_SESSIONS(ID_USER);

-- =============================================================================
-- Relacionamento: Um USUARIO (1) pode ter várias SESSIONS (N)
-- Tipo: One-to-Many (1:N)
-- =============================================================================
