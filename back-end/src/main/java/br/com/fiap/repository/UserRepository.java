package br.com.fiap.repository;

import br.com.fiap.models.User;

import java.util.List;

public interface UserRepository {

        //Retorna a lista de todos os usuarios
        List<User> findAll();

        //Retorna um usuario por id
        User findById(Long id);

        //Cria novo usuário no banco de dados.
        User create(User user);
        
        //Atualiza um usuario existente
        User update(User user);

        //Deleta um usuário pelo ID
        void deleteById(Long id);
}
