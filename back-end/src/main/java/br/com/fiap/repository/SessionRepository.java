package br.com.fiap.repository;

import br.com.fiap.models.SessionWork;
import br.com.fiap.models.User;
import org.glassfish.grizzly.http.server.Session;

import java.util.List;

public interface SessionRepository {

    //Retorna a lista de todos as sessões
    List<SessionWork> findAll();

    //Pesquisa as sessões de um usuario especifico.
    List<SessionWork> findAllById(Long idUser);

    SessionWork findOpenSessionById(Long idUser);

    //Cria e atualiza uma sessão
    SessionWork create(Session session);
    
    SessionWork update(Session session);

    //Deleta Sessão
    void delete(Long id);
    
}
