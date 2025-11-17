package br.com.fiap.resources;


import br.com.fiap.models.SessionWork;
import br.com.fiap.repository.JdbcSessionRepository;
import br.com.fiap.repository.SessionRepository;
import br.com.fiap.service.SessionService;
import jakarta.validation.ValidationException;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.glassfish.grizzly.http.server.Session;

import java.util.ArrayList;
import java.util.List;

@Path("/api/sessions")
public class SessionResource {

    private final SessionRepository sessionRepository = new JdbcSessionRepository();
    private SessionService sessionService = new SessionService(); // Ou injetar via construtor/framework

    @GET
    public  Response getAllSessions() {
        List<SessionWork> sessions = sessionRepository.findAll();
        return Response.ok(sessions).build();
    }


    @GET
    @Path("{id}")
    public  Response getSessionById(@PathParam("id") long id) {
        // Assumindo que sessionRepository está injetado/instanciado na classe SessionResource
        // private SessionRepository sessionRepository;

        try {
            // 2. Busca o objeto SessionWork no Repositório
            SessionWork session = sessionRepository.findSessionById(id);

            if (session == null) {
                // 3. Status 404 NOT FOUND se a sessão não existir
                return Response.status(Response.Status.NOT_FOUND)
                        .entity("Sessão com ID " + id + " não encontrada.")
                        .build();
            }

            // 4. Status 200 OK com o objeto SessionWork
            return Response.ok(session).build();

        } catch (RuntimeException e) {
            // Tratamento de erro da camada de persistência
            System.err.println("Erro ao buscar sessão por ID: " + e.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Erro interno ao consultar a base de dados.")
                    .build();
        }
    }

    //Atualiza sessão
    @PUT
    @Path("{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateSession(@PathParam("id") Long id) {

        SessionWork existingSession = sessionRepository.findSessionById(id);

        if (existingSession == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        try {
            SessionWork closedSession = sessionService.closeSession(existingSession, null);
            SessionWork updatedSession = sessionRepository.update(closedSession);


            if (updatedSession == null) {
                return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Falha na atualização.").build();
            }

            return Response.ok(updatedSession).build();
        } catch (ValidationException e) {
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
        } catch (RuntimeException e) {
            System.err.println("Erro ao finalizar sessão " + e.getMessage());
            return  Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
        }
    }

    @DELETE
    @Path("{id}")
    public Response deleteSession(@PathParam("id") Long id) {
        return Response.status(204).build();
    }

}
