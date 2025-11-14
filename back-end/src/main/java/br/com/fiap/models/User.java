package br.com.fiap.models;

public record User(
        Long id,
        String nome,
        String email,
        String senha,
        String Departamento,
        String Cargo
) {}
