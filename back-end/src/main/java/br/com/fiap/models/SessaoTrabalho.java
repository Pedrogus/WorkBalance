package br.com.fiap.models;

import java.security.Timestamp;

public class SessaoTrabalho {
    private long idSessao;
    private long idUsuario; // FK para Usuario
    private Timestamp inicioSessao;
    private Timestamp fimSessao;
    private Integer duracaoMinutos;
    private Integer pausaMinutos;
    private Integer nivelCansaco;
    private String comentario;

    // Getter e Setter para idSessao
    public long getIdSessao() {
        return idSessao;
    }

    public void setIdSessao(long idSessao) {
        this.idSessao = idSessao;
    }

    // Getter e Setter para idUsuario
    public long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(long idUsuario) {
        this.idUsuario = idUsuario;
    }

    // Getter e Setter para inicioSessao
    public Timestamp getInicioSessao() {
        return inicioSessao;
    }

    public void setInicioSessao(Timestamp inicioSessao) {
        this.inicioSessao = inicioSessao;
    }

    // Getter e Setter para fimSessao
    public Timestamp getFimSessao() {
        return fimSessao;
    }

    public void setFimSessao(Timestamp fimSessao) {
        this.fimSessao = fimSessao;
    }

    // Getter e Setter para duracaoMinutos
    public Integer getDuracaoMinutos() {
        return duracaoMinutos;
    }

    public void setDuracaoMinutos(Integer duracaoMinutos) {
        this.duracaoMinutos = duracaoMinutos;
    }

    // Getter e Setter para pausaMinutos
    public Integer getPausaMinutos() {
        return pausaMinutos;
    }

    public void setPausaMinutos(Integer pausaMinutos) {
        this.pausaMinutos = pausaMinutos;
    }

    // Getter e Setter para nivelCansaco
    public Integer getNivelCansaco() {
        return nivelCansaco;
    }

    public void setNivelCansaco(Integer nivelCansaco) {
        this.nivelCansaco = nivelCansaco;
    }

    // Getter e Setter para comentario
    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }

}
