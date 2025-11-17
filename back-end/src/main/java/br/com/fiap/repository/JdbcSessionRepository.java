package br.com.fiap.repository;

import br.com.fiap.dao.DBConnection;
import br.com.fiap.models.SessionWork;
import org.glassfish.grizzly.http.server.Session;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class JdbcSessionRepository implements SessionRepository {

    private DBConnection db;

    public JdbcSessionRepository() {this.db = new DBConnection();}

    @Override
    public List<SessionWork> findAll() {
        //Impplementação do DBConnection para bter conexão
        // e execultar as querys SELECT * FROM TB_SESSIONS

        List<SessionWork> sessions = new ArrayList<>();

        String sql = "SELECT * FROM TB_SESSIONS";

        try (Connection conn = db.getConnection();
        PreparedStatement stmt = conn.prepareStatement(sql);
        ResultSet rs = stmt.executeQuery())
        {
            while (rs.next()) {
                SessionWork s = new SessionWork(
                        rs.getLong("ID_SESSION"),
                        rs.getLong("ID_USER"),
                        rs.getTimestamp("INICIO_SESSAO"),
                        rs.getTimestamp("FIM_SESSAO"),
                        rs.getInt("DURACAO_MINUTOS"),
                        rs.getInt("PAUSA_MINUTOS"),
                        rs.getInt("NIVEL_CANSACO"),
                        rs.getString("COMENTARIO")
                );

                sessions.add(s);
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

        return sessions;
    }

    @Override
    public List<SessionWork> findAllById(Long idUser) {
        String sql = "SELECT * FROM TB_SESSIONS WHERE ID_USER = ?";
        List<SessionWork> sessions = new ArrayList<>();

        try (Connection conn = db.getConnection();
        PreparedStatement stmt = conn.prepareStatement(sql))
        {
            stmt.setLong(1,idUser);


            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    SessionWork s = new SessionWork(
                            rs.getLong("ID_SESSION"),
                            rs.getLong("ID_USER"),
                            rs.getTimestamp("INICIO_SESSAO"),
                            rs.getTimestamp("FIM_SESSAO"),
                            // Colunas NUMBER(5) e NUMBER(1) são mapeadas como Integer.
                            rs.getInt("DURACAO_MINUTOS"),
                            rs.getInt("PAUSA_MINUTOS"),
                            rs.getInt("NIVEL_CANSACO"),
                            rs.getString("COMENTARIO")
                    );
                    sessions.add(s);
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

        return sessions;
    }

    @Override
    public SessionWork findOpenSessionById(Long idUser) {
        return null;
    }

    @Override
    public SessionWork create(SessionWork session) {
        // 1. DML: Usaremos CURRENT_TIMESTAMP e NULL para colunas não preenchidas.
        String sqlInsert =
                "INSERT INTO TB_SESSIONS (ID_USER, INICIO_SESSAO, FIM_SESSAO, DURACAO_MINUTOS, PAUSA_MINUTOS, NIVEL_CANSACO, COMENTARIO) " +
                        "VALUES (?, CURRENT_TIMESTAMP, NULL, NULL, NULL, NULL, NULL)";

        // 2. DML de Recuperação (SELECT): Recupera o ID_SESSION e o INICIO_SESSAO exato.
        // Usamos CURRENT_TIMESTAMP no WHERE para tentar garantir que pegamos o mais recente,
        // embora uma SEQUENCE fosse mais precisa. Para ID_IDENTITY, MAX(ID) é comum.
        String sqlSelect =
                "SELECT ID_SESSION, INICIO_SESSAO FROM TB_SESSIONS WHERE ID_USER = ? ORDER BY ID_SESSION DESC FETCH FIRST 1 ROW ONLY";

        SessionWork persistedSession = null;

        // O bloco try-with-resources aqui assegura o fechamento da conexão.
        try (Connection conn = db.getConnection()) {

            // Desligamos o autocommit para garantir que as duas operações sejam atômicas.
            conn.setAutoCommit(false);

            // 3. Execução do INSERT
            try (PreparedStatement stmtInsert = conn.prepareStatement(sqlInsert)) {
                stmtInsert.setLong(1, session.idUser());
                int affectedRows = stmtInsert.executeUpdate();

                if (affectedRows == 0) {
                    conn.rollback();
                    throw new SQLException("Falha na persistência: 0 linhas afetadas.");
                }
            }

            // 4. Execução do SELECT para recuperar o ID gerado e o Timestamp.
            try (PreparedStatement stmtSelect = conn.prepareStatement(sqlSelect)) {
                stmtSelect.setLong(1, session.idUser());

                try (ResultSet rs = stmtSelect.executeQuery()) {
                    if(rs.next()) {
                        // Mapeamento sem depender do problemático getGeneratedKeys().
                        long idSession = rs.getLong("ID_SESSION");
                        java.sql.Timestamp inicioSessao = rs.getTimestamp("INICIO_SESSAO");

                        persistedSession = new SessionWork(
                                idSession,
                                session.idUser(),
                                inicioSessao,
                                null, null, null, null, null
                        );
                    }
                }
            }

            // 5. Commit da Transação
            conn.commit();

        } catch (SQLException e) {
            // Em caso de erro, o rollback é implícito ou deve ser feito explicitamente
            // para transações manuais. Aqui, o try-with-resources + rollback implícito
            // ao fechar a conexão, mas é mais seguro:

            String msg = String.format("SQL Error: %s. Falha na persistência/recuperação do ID.", e.getMessage());
            System.err.println(msg);
            throw new RuntimeException(msg, e);
        }

        return persistedSession;
    }

    @Override
    public SessionWork update(Session session) {
        return null;
        //Usa para fechar ou pausar ou abrir uma sessão criada
    }

    @Override
    public void delete(Long id) {
        //Coloca a implementação de DELETE pelo id da sessão.
    }


}
