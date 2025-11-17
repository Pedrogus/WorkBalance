package br.com.fiap.resources;


import br.com.fiap.models.SessionWork;
import br.com.fiap.models.User;
import br.com.fiap.repository.JdbcSessionRepository;
import br.com.fiap.repository.JdbcUserRepository;
import br.com.fiap.repository.SessionRepository;
import br.com.fiap.repository.UserRepository;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.glassfish.grizzly.http.server.Session;

import java.util.ArrayList;
import java.util.List;

@Path("/api/users")
public class UserResource {

    private final UserRepository userRepository = new JdbcUserRepository();
    private final SessionRepository sessionRepository = new JdbcSessionRepository();

    //Pesquisa todos os usuarios.
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllUsers() {
        List<User> users = userRepository.findAll();
        return Response.ok(users).build();
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("{id}")
    public Response getUserById(@PathParam("id") Long id) {
        User user = userRepository.findById(id);
        if (user == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(user).build();
    }

    //Pesquisa todas as sessões de um usuario.
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/{id}/sessions")
    public Response getUserSessions(@PathParam("id") Long id) {
        List<SessionWork> sessions = sessionRepository.findAllById(id);
        return Response.ok(sessions).build();
    }

    //cria um usuario
    @POST
    public Response createUser(User user) {
        //Coloca as infos do usuario e adiciona a lista
        User newUser = userRepository.create(user);
        return Response.status(Response.Status.CREATED).entity(newUser).build();
    }

    //Cria a sessão de um usuario
    @POST
    @Path("{id}/sessions")
    public Response startSession(@PathParam("id") long idUser) {
            SessionWork sessionInput = new SessionWork(
                    null,
                    idUser,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null
            );

            try {
                SessionWork persistedSession = sessionRepository.create(sessionInput);

                if (persistedSession == null) {
                    return Response.status(Response.Status.NOT_FOUND).build();
                }

                return Response.status(Response.Status.CREATED).entity(persistedSession).build();
            } catch (RuntimeException e) {
                System.out.println(e.getMessage());
                return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
            }
    }

    //Atualiza um usuario
    @PUT
    @Path("{id}")
    public Response updateUser(@PathParam("id") int id) {
        return Response.status(Response.Status.ACCEPTED).build();
    }

    //Deleta um usuario
    @DELETE
    @Path("{id}")
    public Response deleteUser(@PathParam("id") int id) {
        return Response.status(204).build();
    }
}
