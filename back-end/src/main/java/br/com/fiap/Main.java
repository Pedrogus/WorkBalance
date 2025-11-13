package br.com.fiap;

import org.glassfish.grizzly.http.server.HttpServer;
import org.glassfish.jersey.grizzly2.httpserver.GrizzlyHttpServerFactory;
import org.glassfish.jersey.jsonb.JsonBindingFeature;
import org.glassfish.jersey.server.ResourceConfig;


import java.net.URI;

public class Main {
    public static void main(String[] args) throws Exception {
        ResourceConfig rc = new ResourceConfig()
                .packages("br.com.fiap.resources")
                .register(JsonBindingFeature.class);

        URI uri = URI.create("http://localhost:8080");

        HttpServer server = GrizzlyHttpServerFactory.createHttpServer(uri, rc);


        System.out.println("Server started..." + uri);

        System.in.read();
        server.shutdownNow();
    }
}