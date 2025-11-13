package br.com.fiap.resources;


import br.com.fiap.models.User;
import br.com.fiap.repository.JdbcUserRepository;
import br.com.fiap.repository.UserRepository;
import jakarta.ws.rs.*;
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
    public Response getUserSessions(@PathParam("id") int id) {
        List<User> users = new ArrayList<>();
        return Response.ok(users).build();
    }

    @POST
    public Response createUser(User user) {
        //Coloca as infos do usuario e adiciona a lista
        User newUser = userRepository.create(user);
        return Response.status(Response.Status.CREATED).entity(newUser).build();
    }

}
