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
import java.util.Map;

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
    public Response startSession(@PathParam("id") long idUser, SessionWork sessionInput
    ) {

        // 1. Validar e Consolidar os Dados
        if (sessionInput == null) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Corpo da requisição ausente ou mal formatado.").build();
        }

        System.out.println("Comentário recebido na SessionWork (direto): " + sessionInput.comentario());

            SessionWork finalSession = new SessionWork(
                    null,
                    idUser,
                    null,
                    null,
                    null,
                    null,
                    null,
                    sessionInput.comentario()
            );

            try {
                SessionWork persistedSession = sessionRepository.create(finalSession);

                if (persistedSession == null) {
                    return Response.status(Response.Status.NOT_FOUND).build();
                }

                return Response.status(Response.Status.CREATED).entity(persistedSession).build();
            } catch (RuntimeException e) {
                System.out.println(e.getMessage());
                return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
            }
    }

    //Login
    // UserResource.java (ou novo AuthResource.java)
    @POST
    @Path("/login")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response authenticate(User userPayLoad) {

        Long userId = userRepository.findUserIdByCredentials(
                userPayLoad.email(),
                userPayLoad.senha()
        );

        if (userId == null) {
            // Falha na autenticação (unauthorized)
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity(Map.of("message", "Credenciais inválidas"))
                    .build();
        }

        // Sucesso na autenticação: Retorna o ID do usuário
        return Response.ok(Map.of("idUser", userId)).build();
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
