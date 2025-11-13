package br.com.fiap.resources;


import br.com.fiap.models.Usuario;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Response;

import java.util.ArrayList;
import java.util.List;

@Path("api/users")
public class UsuarioResource {


    @GET
    public Response getAllUsuario() {
        List<Usuario> usuarios = new ArrayList<>();
        return Response.ok(usuarios).build();
    }
}
