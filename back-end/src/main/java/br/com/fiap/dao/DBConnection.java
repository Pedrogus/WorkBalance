package br.com.fiap.dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBConnection {

    //Connecta com a base de dados da faculdade e puxa as infos da tabela.
    private static final String URL = "jdbc:oracle:thin:@oracle.fiap.com.br:1521:orcl";

    //Variaveis esondidas devem ser colocadas no sistema
    private static final String USER = System.getenv("DB_USER");
    private static final String PASS = System.getenv("DB_PASS");

    public static Connection getConnection() throws SQLException {
        Connection conn = DriverManager.getConnection(URL, USER, PASS);
        System.out.println("Conectado com sucesso!");
        System.out.println(conn.getCatalog());
        return conn;
    }
}
