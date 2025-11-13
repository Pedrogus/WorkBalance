package br.com.fiap.resources;


import br.com.fiap.models.SessionWork;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Response;

import java.util.ArrayList;
import java.util.List;

@Path("/api/sessions")
public class SessionResource {

    @GET
    public  Response getAllSessions() {
        List<SessionWork> sessions = new ArrayList<>();
        return Response.ok(sessions).build();
    }

}
