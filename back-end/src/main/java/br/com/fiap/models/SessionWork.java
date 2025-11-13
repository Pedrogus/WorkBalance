package br.com.fiap.models;

import java.sql.Timestamp;

public record SessionWork(
        Long id,
        Long idUser,
        Timestamp inicioSessao,
        Timestamp fimSessao,
        Integer duracaoMinutos,
        Integer pausaMinutos,
        Integer nivelCansaco,
        String comentario
) {}
