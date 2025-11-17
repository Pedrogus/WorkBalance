package br.com.fiap.resources;


import br.com.fiap.models.SessionWork;
import br.com.fiap.repository.JdbcSessionRepository;
import br.com.fiap.repository.SessionRepository;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Response;
import org.glassfish.grizzly.http.server.Session;

import java.util.ArrayList;
import java.util.List;

@Path("/api/sessions")
public class SessionResource {

    private final SessionRepository sessionRepository = new JdbcSessionRepository();

    @GET
    public  Response getAllSessions() {
        List<SessionWork> sessions = sessionRepository.findAll();
        return Response.ok(sessions).build();
    }

    @GET
    @Path("{id}")
    public  Response getSessionById(@PathParam("id") String id) {
        return Response.status(Response.Status.ACCEPTED).build();
    }

    //Atualiza sessão
    @PUT
    @Path("{id}")
    public Response updateSession(@PathParam("id") Long id, Session session) {
        return Response.status(Response.Status.ACCEPTED).build();
    }

    @DELETE
    @Path("{id}")
    public Response deleteSession(@PathParam("id") Long id) {
        return Response.status(204).build();
    }

}
