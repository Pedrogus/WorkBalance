package br.com.fiap.resources;


import br.com.fiap.models.User;
import br.com.fiap.repository.JdbcUserRepository;
import br.com.fiap.repository.UserRepository;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.ArrayList;
import java.util.List;

@Path("/api/users")
public class UserResource {

    private final UserRepository userRepository = new JdbcUserRepository();

    //Pesquisa todos os usuarios.
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllUsers() {
        List<User> users = userRepository.findAll();
        return Response.ok(users).build();
    }

    //Pesquisa todas as sessões de um usuario.
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/{id}/sessions")
    public Response getUserSessions(@PathParam("id") int id) {
        List<User> users = new ArrayList<>();
        return Response.ok(users).build();
    }

}
