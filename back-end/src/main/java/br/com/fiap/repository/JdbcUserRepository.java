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
        return null;
    }

    @Override
    public User create(User user) {
        // Cria uma nova instância de User (Record) com o novo ID gerado.
        // Usamos os métodos acessores name() e email() do Record original.

        // executa um INSERT e retorne o objeto atualizado
        // System.out.println("Usuário criado no banco: " + newUserWithId.name());
        return null;
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