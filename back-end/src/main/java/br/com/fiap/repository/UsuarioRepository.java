package br.com.fiap.repository;

import br.com.fiap.models.Usuario;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepository {
    List<Usuario> findAll();
    Optional<Usuario> findById(long id);
}
