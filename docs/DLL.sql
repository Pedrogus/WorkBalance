-- =============================================================================
-- WorkBalance Database Schema
-- DDL (Data Definition Language) Script
-- =============================================================================

DROP TABLE TB_BREAK_LOG;
DROP TABLE TB_SESSIONS;
DROP TABLE TB_USERS;



-- Tabela TB_USERS
-- Armazena informações dos usuarios do sistema
CREATE TABLE TB_USERS (
    ID_USER         NUMBER(10) GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    NOME            VARCHAR2(100) NOT NULL,
    EMAIL           VARCHAR2(100) UNIQUE NOT NULL,
    SENHA           VARCHAR2(100) NOT NULL,
    DEPARTAMENTO    VARCHAR2(50),
    CARGO           VARCHAR2(50)
);

-- Tabela TB_SESSIONS
-- Armazena os períodos de trabalho dos usuários
CREATE TABLE TB_SESSIONS (
    ID_SESSION      NUMBER(10) GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
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

CREATE TABLE TB_BREAK_LOG (
    ID_BREAK       NUMBER(10) GENERATED ALWAYS AS IDENTITY  PRIMARY KEY,
    ID_SESSION     NUMBER(10)      NOT NULL,
    INICIO_PAUSA   TIMESTAMP       NOT NULL,
    FIM_PAUSA      TIMESTAMP,
    PAUSA_MINUTOS  NUMBER(5),
    TIPO           VARCHAR2(50),      -- café, descanso, banheiro, distração
    COMENTARIO     VARCHAR2(255),
	
    CONSTRAINT FK_BREAK_SESSION FOREIGN KEY (ID_SESSION)
        REFERENCES TB_SESSIONS(ID_SESSION)
);

-- Índice para melhorar performance de buscas por usuário
CREATE INDEX IDX_SESSIONS_USER ON TB_SESSIONS(ID_USER);

-- =============================================================================
-- Relacionamento: Um USUARIO (1) pode ter várias SESSIONS (N)
-- Tipo: One-to-Many (1:N)
-- =============================================================================
