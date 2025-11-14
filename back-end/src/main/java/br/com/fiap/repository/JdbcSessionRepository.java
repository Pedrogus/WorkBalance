package br.com.fiap.repository;

import br.com.fiap.models.SessionWork;
import org.glassfish.grizzly.http.server.Session;

import java.util.List;

public class JdbcSessionRepository implements SessionRepository {

    @Override
    public List<SessionWork> findAll() {
        //Impplementação do DBConnection para bter conexão
        // e execultar as querys SELECT * FROM TB_SESSIONS
        return null;
    }

    @Override
    public List<SessionWork> findAllById(Long idUser) {
        return List.of();
    }

    @Override
    public SessionWork create(Session session) {
        return null;
        //Cria uma sessão nova.
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
