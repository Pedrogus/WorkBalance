package br.com.fiap.models;

import java.sql.Timestamp;

public record BreakLog(

        Long id,
        Long idSession,
        Timestamp inicioPausa,
        Timestamp fimPausa,
        Integer pausaMinutos,
        String tipo,
        String comentario
) {}
