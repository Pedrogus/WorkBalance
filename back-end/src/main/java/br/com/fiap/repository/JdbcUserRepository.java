package br.com.fiap.repository;

import br.com.fiap.dao.DBConnection;
import br.com.fiap.models.User;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class JdbcUserRepository implements UserRepository {

    /*
    //Simulação do ID para o metodo create
    private static long nextId = 3L;

    //Lista estatica para simular dados de memoria
    private static final List<User> MOCK_USERS = new ArrayList<>();

    static {
        MOCK_USERS.add(new User(1L, "Pedro", "pedro@fiap.com", "123456", "TI", "Aluno"));
    }
    */

    private DBConnection db;

    public JdbcUserRepository() {
        this.db = new DBConnection();
    }


    @Override
    public List<User> findAll() {

        List<User> users = new ArrayList<>();

        //Impplementação do DBConnection para bter conexão
        // e execultar as querys SELECT * FROM TB_USERS
        String sql = "SELECT * FROM TB_USERS";

        try (Connection conn = db.getConnection();
            PreparedStatement stmt = conn.prepareStatement(sql);
            ResultSet rs = stmt.executeQuery()){

            while (rs.next()) {
                User u = new User(
                        rs.getLong("ID_USER"),
                        rs.getString("NOME"),
                        rs.getString("EMAIL"),
                        rs.getString("SENHA"),
                        rs.getString("DEPARTAMENTO"),
                        rs.getString("CARGO")
                );

                users.add(u);

            }
        } catch (SQLException e) {
            throw new RuntimeException("Erro ao execultar findAll()" +  e.getMessage());
        }

        return users; //retorna todos os usuarios do banco em lista
    }

    @Override
    public User findById(Long id) {
        // Na implementação real: SELECT * FROM TB_USERS WHERE ID = ?
        String sql = "SELECT * FROM TB_USERS WHERE ID_USER = ?";

        User u = null;

        try (Connection conn = db.getConnection(); PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setLong(1,id);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    u = new User(
                            rs.getLong("ID_USER"),
                            rs.getString("NOME"),
                            rs.getString("EMAIL"),
                            rs.getString("SENHA"),
                            rs.getString("DEPARTAMENTO"),
                            rs.getString("CARGO")
                    );
                }
            }
        } catch (SQLException e) {
            System.out.println("Erro ao execultar findById()" +  e.getMessage());
            throw new RuntimeException("Erro ao execultar findById()" +  e.getMessage());
        }

        return u;
    }

    @Override
    public User create(User user) {
        // DML Statement: Insere em 5 colunas (ID_USER é autogerado).
        // A ordem dos '?' deve corresponder à ordem dos setString abaixo.
        String sql =
                "INSERT INTO TB_USERS (NOME, EMAIL, SENHA, DEPARTAMENTO, CARGO) " +
                        "VALUES (?, ?, ?, ?, ?)";

        User persistedUser = null;

        try (Connection conn = db.getConnection(); // Obtém a conexão
             // Configuração essencial para Oracle/JDBC para recuperar o ID autogerado.
             PreparedStatement stmt = conn.prepareStatement(sql, new String[]{"ID_USER"}))
        {
            // 1. Bind dos 5 parâmetros: NOME, EMAIL, SENHA, DEPARTAMENTO, CARGO
            stmt.setString(1, user.nome());
            stmt.setString(2, user.email());
            stmt.setString(3, user.senha());
            // Trata campos VARCHAR2 que podem ser null (DEPARTAMENTO, CARGO)
            stmt.setString(4, user.departamento());
            stmt.setString(5, user.cargo());

            // 2. Execução da DML.
            int affectedRows = stmt.executeUpdate();

            if (affectedRows == 0) {
                throw new SQLException("Falha de persistência: Nenhuma linha afetada (SQL: " + sql + ").");
            }

            // 3. Recuperação do ID (Chave Primária).
            try (ResultSet rs = stmt.getGeneratedKeys()) {
                if (rs.next()) {
                    // ID_USER (NUMBER(10)) é lido como long.
                    long idUser = rs.getLong(1);

                    // 4. Criação do novo Record User com o ID persistido.
                    persistedUser = new User(
                            idUser,               // ID gerado
                            user.nome(),
                            user.email(),
                            user.senha(),
                            user.departamento(),
                            user.cargo()
                    );
                } else {
                    throw new SQLException("Usuário persistido, mas ID gerado não foi recuperado pelo driver.");
                }
            }
        } catch (SQLException e) {
            // Exceções como violação da UNIQUE constraint (EMAIL) serão capturadas aqui.
            String msg = String.format("Erro de persistência (CREATE): %s", e.getMessage());
            System.err.println(msg);
            throw new RuntimeException(msg, e);
        }

        System.out.println("Usuário criado com sucesso. ID: " + persistedUser.id());
        return persistedUser;
    }



    //Atualiza
    @Override
    public User update(User user) {
        return user;
    }

    @Override
    public void deleteById(Long id) {
        // Na implementação real: DELETE FROM TB_USERS WHERE ID = ?
    }
}
;