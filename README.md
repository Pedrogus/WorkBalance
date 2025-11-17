## 📑 Projeto Global Solution: Documentação Técnica (README)

Este documento detalha a arquitetura, estrutura de dados e *endpoints* da API **Global Solution**, construída em **Java** utilizando **Jersey** (JAX-RS) e o servidor *embeddable* **Grizzly**, com persistência gerenciada via **JDBC** no banco de dados **Oracle**.

---

## 🏗️ 1. Arquitetura e Estrutura do Projeto Java (Maven)

O projeto segue a arquitetura tradicional em camadas (MVC estendido), facilitando a separação de responsabilidades e a manutenção do código.

| Camada | Pacote Java | Responsabilidade |
| :--- | :--- | :--- |
| **Acesso a Dados** | `dao/` | Conexão direta com o **Oracle** via JDBC (`DBConnection.java`). |
| **Model/DTO** | `model/` | Definição das entidades de dados (`User`, `SessionWork`). |
| **Persistência** | `repository/` | Interfaces e implementações para o **CRUD** (`UserRepository`, `SessionRepository`). Mapeamento JDBC-Objeto. |
| **Regras de Negócio** | `service/` | Lógica de aplicação (cálculos de duração, validações de sessão, etc.). |
| **API/REST** | `resource/` | Definição dos **Endpoints** JAX-RS (GET, POST, PUT). Ponte entre o HTTP e a camada Service. |
| **Inicialização** | `application/` | Inicialização do servidor **Grizzly** e registro dos *Resources* JAX-RS (`Main.java`). |

---

## 📦 2. Camada Model (Entidades de Negócio)

As classes de modelo representam os Data Transfer Objects (DTOs) que interagem diretamente com o banco de dados Oracle.

### 👥 `User` (Colaborador)

| Atributo | Tipo Java | Descrição |
| :--- | :--- | :--- |
| `id` | `Long` | Identificador único (PK). |
| `nome` | `String` | Nome completo. |
| `email` | `String` | E-mail de login (Único). |
| `departamento` | `String` | Setor ou área. |
| `cargo` | `String` | Cargo do colaborador. |
| `dataCadastro` | `Date` | Data de criação no sistema (DB *default*). |

### 🕒 `SessionWork` (Sessão de Trabalho)

| Atributo | Tipo Java | Descrição |
| :--- | :--- | :--- |
| `id` | `Long` | Identificador da sessão (PK). |
| `idUser` | `Long` | Chave estrangeira (FK) para o usuário. |
| `inicioSessao` | `Timestamp` | Data e hora de início (Não nulo). |
| `fimSessao` | `Timestamp` | Data e hora de término. |
| `duracaoMinutos` | `Integer` | Tempo total de foco (*calculado*). |
| `pausaMinutos` | `Integer` | Tempo total de pausas. |
| `nivelCansaco` | `Integer` | Escala de cansaço (1-5). |
| `comentario` | `String` | Observações opcionais. |

---

## 🗄️ 3. Estrutura de Dados do Banco Oracle (DDL)

As tabelas utilizam tipos nativos do Oracle e colunas `IDENTITY` para autogeração de chaves primárias.

### Tabela: `USUARIO`

| Coluna | Tipo Oracle | Restrições | Descrição Técnica |
| :--- | :--- | :--- | :--- |
| **ID\_USER** | `NUMBER(10)` | **PK**, `IDENTITY` | Identificador único. |
| **NOME** | `VARCHAR2(100)` | `NOT NULL` | Nome do colaborador. |
| **EMAIL** | `VARCHAR2(100)` | `UNIQUE`, `NOT NULL` | Chave de login. |
| **SENHA** | `VARCHAR2(100)` | `NOT NULL` | Senha criptografada. |
| **DEPARTAMENTO** | `VARCHAR2(50)` | `NULL` | Setor. |
| **CARGO** | `VARCHAR2(50)` | `NULL` | Função/cargo. |
| **DATA\_CADASTRO** | `DATE` | `DEFAULT SYSDATE` | Data de criação do registro. |

### Tabela: `SESSAO_TRABALHO`

| Coluna | Tipo Oracle | Restrições | Descrição Técnica |
| :--- | :--- | :--- | :--- |
| **ID\_SESSION** | `NUMBER(10)` | **PK**, `IDENTITY` | Identificador da sessão. |
| **ID\_USER** | `NUMBER(10)` | **FK** | Chave estrangeira para `USUARIO`. |
| **INICIO\_SESSAO** | `TIMESTAMP` | `NOT NULL` | Momento de início. |
| **FIM\_SESSAO** | `TIMESTAMP` | `NULL` | Momento de término (preenchido no `PUT`). |
| **DURACAO\_MINUTOS** | `NUMBER(5)` | `NULL` | Tempo total de foco (*cálculo*). |
| **PAUSA\_MINUTOS** | `NUMBER(5)` | `NULL` | Total de pausas. |
| **NIVEL\_CANSACO** | `NUMBER(1)` | `NULL` | Escala informada (1-5). |
| **COMENTARIO** | `VARCHAR2(255)` | `NULL` | Observação livre. |

### 🔗 Relacionamento

* **1:N (Um para Muitos):** Um `USUARIO` pode ter **várias** `SESSAO_TRABALHO`.
    * `USUARIO (1) ───< (N) SESSAO_TRABALHO`

---

## 💻 4. Endpoints da API REST (JAX-RS Resources)

Os *endpoints* são definidos nas classes `UserResource` e `SessionResource`. O contexto base da API é, geralmente, `/api`.

| Método | Endpoint | Recurso | Descrição da Operação |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/users` | `UserResource` | Lista **todos** os usuários cadastrados. |
| **GET** | `/api/users/{id}` | `UserResource` | Retorna um usuário específico pelo ID. |
| **GET** | `/api/sessions` | `SessionResource` | Lista todas as sessões registradas no sistema. |
| **GET** | `/api/users/{id}/sessions` | `SessionResource` | Lista todas as sessões de trabalho de um **único usuário**. |
| **POST** | `/api/users` | `UserResource` | **Cria** um novo usuário no sistema. |
| **POST** | `/api/users/{id}/sessions` | `SessionResource` | **Inicia** uma nova sessão de trabalho para o usuário `{id}` (registra `INICIO_SESSAO`). |
| **PUT** | `/api/sessions/{idSessao}` | `SessionResource` | **Encerra** a sessão de trabalho `{idSessao}` (registra `FIM_SESSAO` e dispara os cálculos). |
| **PUT/PATCH** | `/api/users/{id}` | `UserResource` | Atualiza os dados de um usuário específico. |

---

## 💼 5. Regras de Negócio Básicas (`SessionService`)

A camada `Service` é responsável por aplicar as seguintes regras essenciais ao interagir com as sessões:

1.  **Cálculo da Duração Total:**
    $$DURACAO\_MINUTOS = (FIM\_SESSAO - INICIO\_SESSAO) - PAUSA\_MINUTOS$$
2.  **Validação Temporal:** Garantir que `INICIO_SESSAO` seja sempre anterior a `FIM_SESSAO`.
3.  **Conflito de Sessão:** Implementar a lógica para evitar que um usuário inicie uma nova sessão se já houver uma sessão aberta (`FIM_SESSAO IS NULL`) para o mesmo `ID_USER`.
4.  **Funcionalidade de Consulta:** Permitir a filtragem e agregação de sessões por período (`últimos 7 dias`, `mês atual`, etc.).