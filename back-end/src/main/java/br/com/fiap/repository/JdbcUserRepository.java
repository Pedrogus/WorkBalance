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
        // e execultar as querys SELECT * FROM USERS

        return MOCK_USERS;
    }

    @Override
    public User create(User user) {
        // 1. Cria uma nova instância de User (Record) com o novo ID gerado.
        // Usamos os métodos acessores name() e email() do Record original.
        User newUserWithId = new User(nextId++, user.nome(), user.email(), user.senha(), user.Departamento(), user.Cargo());

        // 2. Adiciona a nova instância (com ID) à lista mock
        MOCK_USERS.add(newUserWithId);

        // Na implementação real, execute um INSERT e retorne o objeto atualizado
        // System.out.println("Usuário criado no banco: " + newUserWithId.name());
        return newUserWithId;
    }

    // MÉTODO IMPLEMENTADO PARA RESOLVER O ERRO
    @Override
    public User findById(Long id) {
        // Na implementação real: SELECT * FROM USERS WHERE ID = ?
        return MOCK_USERS.stream()
                .filter(u -> u.id().equals(id))
                .findFirst()
                .orElse(null);
    }

    // MÉTODO IMPLEMENTADO PARA RESOLVER O ERRO
    @Override
    public User update(User user) {
        // Simulação de UPDATE: Localiza o item, remove e adiciona o novo (imutabilidade do Record)
        MOCK_USERS.removeIf(u -> u.id().equals(user.id()));
        MOCK_USERS.add(user);

        // Na implementação real: UPDATE USERS SET ... WHERE ID = ?
        return user;
    }

    // MÉTODO IMPLEMENTADO PARA RESOLVER O ERRO
    @Override
    public void deleteById(Long id) {
        // Na implementação real: DELETE FROM USERS WHERE ID = ?
        MOCK_USERS.removeIf(u -> u.id().equals(id));
        System.out.println("Usuário deletado com ID: " + id);
    }
}
;