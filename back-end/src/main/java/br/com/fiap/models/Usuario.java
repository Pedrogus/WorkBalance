package br.com.fiap.models;

import java.sql.Timestamp;

public record Usuario(
        Long id,
        String nome,
        String email,
        String Departamento,
        String Cargo,
        Timestamp DataAdimisao
) {}
