package br.com.fiap.repository;

import br.com.fiap.models.User;

import java.util.ArrayList;
import java.util.List;

public class JdbcUserRepository implements UserRepository {

    //Simulação do ID para o metodo create
    private static long nextId = 3L;

    //Lista estatica para simular dados de memoria
    private static final List<User> MOCK_USERS = new ArrayList<>();

    static {
        MOCK_USERS.add(new User(1L, "Pedro", "pedro@fiap.com", "123456", "TI", "Aluno"));
    }

    @Override
    public List<User> findAll() {
        //Impplementação do DBConnection para bter conexão
        // e execultar as querys SELECT * FROM TB_USERS
        return MOCK_USERS; //retorna todos os usuarios do banco em lista
    }

    @Override
    public User findById(Long id) {
        // Na implementação real: SELECT * FROM TB_USERS WHERE ID = ?
        return MOCK_USERS.stream()
                .filter(u -> u.id().equals(id))
                .findFirst()
                .orElse(null);
    }

    @Override
    public User create(User user) {
        // Cria uma nova instância de User (Record) com o novo ID gerado.
        // Usamos os métodos acessores name() e email() do Record original.
        User newUserWithId = new User
                (nextId++, user.nome(), user.email(), user.senha(), user.Departamento(), user.Cargo());

        // 2. Adiciona a nova instância (com ID) à lista mock
        MOCK_USERS.add(newUserWithId);

        // executa um INSERT e retorne o objeto atualizado
        // System.out.println("Usuário criado no banco: " + newUserWithId.name());
        return newUserWithId;
    }

    //Atualiza
    @Override
    public User update(User user) {
        return user;
    }

    @Override
    public void deleteById(Long id) {
        // Na implementação real: DELETE FROM TB_USERS WHERE ID = ?
        MOCK_USERS.removeIf(u -> u.id().equals(id));
        System.out.println("Usuário deletado com ID: " + id);
    }
}
;