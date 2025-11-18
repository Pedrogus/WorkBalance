package br.com.fiap.dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

public class DBConnection {

    //Connecta com a base de dados da faculdade e puxa as infos da tabela.
    private static final String URL = "jdbc:oracle:thin:@oracle.fiap.com.br:1521:orcl";

    //Variaveis esondidas devem ser colocadas no sistema
    private static final String USER = System.getenv("DB_USER");
    private static final String PASS = System.getenv("DB_PASS");


    private static final String BRASIL_TIMEZONE = "America/Sao_Paulo";

    public static Connection getConnection() throws SQLException {
        Properties props = new Properties();
        props.setProperty("user", USER);
        props.setProperty("password", PASS);
        props.setProperty("oracle.jdbc.timezoneAsRegion", "false"); // Boa prática com fuso fixo
        props.setProperty("sessionTimeZone", BRASIL_TIMEZONE);


        Connection conn = DriverManager.getConnection(URL, props);
        System.out.println("Conectado com sucesso!");

        return conn;
    }
}
