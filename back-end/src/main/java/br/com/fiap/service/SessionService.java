package br.com.fiap.service;

import br.com.fiap.models.SessionWork;

import java.sql.Timestamp;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;

public class SessionService {

    // Serviço de alertas das sessões, horas.

    /**
     * Regra de Negócio principal: Encerra a sessão, calcula a duração e valida dados.
     * Retorna um novo SessionWork Record com os campos de encerramento (FIM_SESSAO, DURACAO_MINUTOS, etc.) preenchidos.
     * * @param existingSession Sessão carregada do banco (com INICIO_SESSAO).
     * @param updateDetails   Detalhes informados pelo usuário (NIVEL_CANSACO, COMENTARIO).
     * @return SessionWork Record pronto para ser atualizado no banco.
     */

    public static SessionWork closeSession(SessionWork existingSession, SessionWork updateDetails) {

        // Tratamento de NULL: Se o updateDetails for null, usa-se null/0 como padrão.
        Integer nivelCansaco = updateDetails != null ? updateDetails.nivelCansaco() : null;
        String comentario = updateDetails != null ? updateDetails.comentario() : null;

        Integer nivelCansacoFinal = nivelCansaco != null ? nivelCansaco : null;

        Timestamp fimSessao = new Timestamp(System.currentTimeMillis());

        if (fimSessao.before(existingSession.inicioSessao())) {
            throw new IllegalArgumentException("FIM_SESSAO não pode ser anterior a INICIO_SESSAO.");
        }

        int pausaMinutos = existingSession.pausaMinutos() != null ? existingSession.pausaMinutos(): 0;

        Instant inicio = existingSession.inicioSessao().toInstant();
        Instant fimSessaoInstant= fimSessao.toInstant();

        long duracaoMilli = Duration.between(inicio, fimSessaoInstant).toMillis();

        long duracaoMinutosBrutos = duracaoMilli / (1000 * 60);

        int duracaoFinalMinutos = (int) (duracaoMinutosBrutos - pausaMinutos);


        return new SessionWork(
                existingSession.id(),
                existingSession.idUser(),
                existingSession.inicioSessao(),
                fimSessao, // FIM_SESSAO preenchido
                duracaoFinalMinutos, // DURACAO_MINUTOS
                pausaMinutos,
                nivelCansacoFinal, // NIVEL_CANSACO (null se não enviado)
                comentario    // COMENTARIO (null se não enviado)
        );

    }

}
