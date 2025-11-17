WorkBalance -> Projeto Global Solution
Feito em JAVA (Jersey + Grizzly)

E Banco de dados Oracle.

1. Estrutura do Projeto Java

Java + API REST (MAVEN), a separação de camadas fica assim:

src/
 ├── dao/
 │    ├── DBConnection.java         → Conecta banco Oracle com JDBC
 │
 ├── model/
 │    ├── User.java               → Representa o colaborador
 │    └── SessionWork.java        → Representa uma sessão de trabalho
 │
 ├── repository/
 │    ├── UserRepository.java     → Interface para CRUD no banco
 │    └── SessionRepository.java
 │
 ├── service/
 │    └── SessionService.java         → Regras de negócio (cálculo de horas, etc.)
 │
 │
 ├── resource/
 │    ├── UserResource.java     	→ Endpoint do CRUD (GET, POST, PUT, DELETE)
 │    └── SessionResource.java
 │
 └── application/
      └── Main.java → Classe principal


2. Camada Model – Estrutura conceitual das classes

Essas são as entidades (modelos) que representam o que será armazenado no banco Oracle.

Classe User

Representa o colaborador que está utilizando o sistema.

Atributo	Tipo			Descrição
id		Long			Identificador único
nome		String			Nome completo do colaborador
email		String			E-mail de login
departamento	String			Setor ou área
cargo		String			Cargo do colaborador
dataCadastro	Date			Quando foi criado no sistema

Classe SessionWork

Representa uma sessão de foco/trabalho registrada pelo colaborador.

Atributo	Tipo			Descrição
id		Long			Identificador da sessão
idUser		Long (FK)		Relacionamento com o usuário
inicioSessao	Timestamp		Data e hora de início
fimSessao	Timestamp		Data e hora de término
duracaoMinutos	Integer			Tempo total de foco (calculado)
pausaMinutos	Integer			Tempo total de pausas
nivelCansaco	Integer			Escala simples (1–5) informada pelo usuário
comentario	String			Observações opcionais (“Dia produtivo”, “Cansado”, etc.)

3. Estrutura conceitual do banco de dados Oracle

Vocês terão duas tabelas principais (e podem expandir depois se quiserem).

Tabela USUARIO

Coluna		Tipo 		restrições			Descrição
ID_USER		NUMBER(10)	PK, NOT NULL			Identificador
NOME		ARCHAR2(100)	NOT NULL			Nome do colaborador
EMAIL		ARCHAR2(100)	UNIQUE, NOT NULL		E-mail de login
DEPARTAMENTO	VARCHAR2(50)	NULL				Setor
CARGO		ARCHAR2(50)	NULL				Função/cargo
DATA_CADASTRO	DATE		DEFAULT SYSDATE			Data de criação

Tabela SESSAO_TRABALHO

Coluna		Tipo 		Restrições			Descrição
ID_SESSION	NUMBER(10)	PK, NOT NULL			Identificador
ID_USER		NUMBER(10)	FK → USUARIO.ID_USUARIO		Usuário dono da sessão
INICIO_SESSAO	TIMESTAMP	NOT NULL			Início do período de trabalho
FIM_SESSAO	TIMESTAMP	NULL				Fim do período (pode ser null se estiver em andamento)
DURACAO_MINUTOS	NUMBER(5)	NULL				Tempo total calculado
PAUSA_MINUTOS	NUMBER(5)	NULL				Total de pausas
NIVEL_CANSACO	NUMBER(1)	NULL				Escala de 1 a 5
COMENTARIO	VARCHAR2(255)	NULL				Observação livre

4. Relacionamento

Um USUARIO pode ter várias SESSAO_TRABALHO.
→ Relacionamento 1:N entre as tabelas.

USUARIO (1) ───< (N) SESSAO_TRABALHO

5. Funcionalidades possíveis com essa estrutura

Funcionalidade	Dados usados
Registrar início/fim de sessão	SESSAO_TRABALHO.INICIO_SESSAO, FIM_SESSAO
Calcular tempo total de trabalho	DURACAO_MINUTOS
Visualizar histórico semanal	Consulta por ID_USUARIO + agrupamento por data
Mostrar gráfico no dashboard	Somar DURACAO_MINUTOS por semana
Alertas e dicas (sem IA)	Regras simples: se DURACAO_MINUTOS > X, exibir aviso

6. Regras de negócio básicas (para a camada Service)

Ao encerrar uma sessão:

calcular DURACAO_MINUTOS = (FIM_SESSAO - INICIO_SESSAO) - PAUSA_MINUTOS

Validar que INICIO_SESSAO < FIM_SESSAO.

Evitar mais de uma sessão aberta simultaneamente por usuário.

Permitir consultas por período (ex: “últimos 7 dias”).

* Endpoints

GET -> Lita de todos os usuários /api/users
GET -> Listar todas as sessões de trabalho /api/sessions
GET -> Lista as sessões de um único usuário (id) /api/users/{id}/sessions


POST -> /api/users/{id}/sessions

Cria uma nova sessão de trabalho para o usuário cujo ID é informado na URL.
Esse endpoint é chamado quando o usuário inicia uma sessão (exemplo: clicou em "Iniciar Trabalho" no front-end).

PUT -> Encerra a sessão de trabalho /api/sessions/{idSessao}

