package ic.pesquisa.projeto.demo.Domain;
import ch.qos.logback.core.model.NamedModel;
import ic.pesquisa.projeto.demo.Domain.novo.Queries;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;


//@Entity
//@Table(name = "metricas")
//@EqualsAndHashCode
//@Getter
//@Setter
//public class Buscas {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @OneToOne
//    @JoinColumn(name = "usuario.id")
//    private Usuario usuario_id;
//
//    @Column(name = "query")
//    private String query;
//
//
//    @Column(name = "links")
//    private String link;
//
//    @Column(name = "data_sessao")
//    private Date data_sessao;
//
//    @Column(name = "resultado_metrica")
//    private float resultado_metrica;
//
//    @Column(name = "resultado_metrica_fim")
//    private float resultado_metrica_fim;
//
//    @Column(name = "coeficiente_de_similaridade")
//    private float coeficiente_de_similaridade;
//
//    @Column(name = "similaridade_total_sessao")
//    private float similaridade_total_sessao;
//    private float similaridade_total_sessao;
//
//    @Column(name = "probabilidade_detecção")
//    private float probabilidade_detecao;
//
//
//
//    public Buscas(Long id, Usuario usuario_id, String query,String links, float resultado_metrica) {
//        this.id = id;
//        this.usuario_id = usuario_id;
//        this.link = links;
//        this.data_sessao = new Date();
//        this.query = query;
//        this.resultado_metrica = resultado_metrica;
//    }
//    public Buscas() {}
//
//    @Override
//    public String toString() {
//        return "Buscas{" +
//                "id=" + id +
//                ", usuario_id=" + usuario_id +
//                ", query=" + query +
//                ", links=" + link +
//                ", data_sessao=" + data_sessao +
//                ", resultado_metrica=" + resultado_metrica +
//                '}';
//    }
//
//
//    public float getResultado_metrica_fim() {return resultado_metrica_fim;}
//
//    public void setResultado_metrica_fim(float resultado_metrica_fim) {this.resultado_metrica_fim = resultado_metrica_fim;}
//
//    public void setLink(String links) {this.link = links;}
//
//    public void setData_sessao(Date data_sessao) {this.data_sessao = data_sessao;}
//
//    public String getLinks() {return link;}
//
//    public Date getData_sessao() {return data_sessao;}
//
//    public float getProbabilidade_detecao() {return probabilidade_detecao;}
//
//    public void setProbabilidade_detecao(float probabilidade_detecao) {this.probabilidade_detecao = probabilidade_detecao;}
//
//    public float getCoeficiente_de_similaridade() {
//        return coeficiente_de_similaridade;
//    }
//
//    public void setCoeficiente_de_similaridade(float coeficiente_de_similaridade) {
//        this.coeficiente_de_similaridade = coeficiente_de_similaridade;
//    }
//
//    public float getSimilaridade_total_sessao() {
//        return similaridade_total_sessao;
//    }
//
//    public void setSimilaridade_total_sessao(float similaridade_total_sessao) {
//        this.similaridade_total_sessao = similaridade_total_sessao;
//    }
//
//    public Long getId() {
//        return id;
//    }
//
//    public void setId(Long id) {
//        this.id = id;
//    }
//
//    public Usuario getUsuario_id() {
//        return usuario_id;
//    }
//
//    public String getQuery() {
//        return this.query;
//    }
//
//    public float getResultado_metrica() {
//        return resultado_metrica;
//    }
//
//    public void setQuery(String query) {
//        this.query = query;
//    }
//
//    public void setResultado_metrica(float resultado_metrica) {
//        this.resultado_metrica = resultado_metrica;
//    }
//
//    public void setUsuario_id(Usuario usuario_id) {
//        this.usuario_id = usuario_id;
//    }
//
//
//
//}
import jakarta.persistence.*;
import lombok.EqualsAndHashCode;


@Entity
@Table(name = "metricas")
@EqualsAndHashCode

public class Buscas {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @Column(name = "session_id")
    private String sessionId;

    @ManyToOne
    @JoinColumn(name = "query_id")
    private Queries query;

    @Column(name = "links", columnDefinition = "TEXT")
    private String links;

    @Column(name = "data_sessao")
    private Date dataSessao;

    @Column(name = "resultado_metrica")
    private float resultadoMetrica;

    @Column(name = "resultado_metrica_fim")
    private float resultadoMetricaFim;

    @Column(name = "coeficiente_de_similaridade", columnDefinition = "TEXT")
    private String coeficienteDeSimilaridade;

    @Column(name = "similaridade_total_sessao")
    private float similaridadeTotalSessao;

    @Column(name = "probabilidade_detecção", columnDefinition = "TEXT")
    private String probabilidadeDetecao;

    @Column(name = "ranks", columnDefinition = "TEXT")
    private String ranks;

    @Column(name = "entropia")
    private float entropia;

    @Column(name = "dkg")
    private int dkg;

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }



    public void setQuery(Queries query) {
        this.query = query;
    }

    public String getLinks() {
        return links;
    }

    public void setLinks(String links) {
        this.links = links;
    }

    public Date getDataSessao() {
        return dataSessao;
    }

    public void setDataSessao(Date dataSessao) {
        this.dataSessao = dataSessao;
    }

    public float getResultadoMetrica() {
        return resultadoMetrica;
    }

    public void setResultadoMetrica(float resultadoMetrica) {
        this.resultadoMetrica = resultadoMetrica;
    }

    public float getResultadoMetricaFim() {
        return resultadoMetricaFim;
    }

    public void setResultadoMetricaFim(float resultadoMetricaFim) {
        this.resultadoMetricaFim = resultadoMetricaFim;
    }

    public String getCoeficienteDeSimilaridade() {
        return coeficienteDeSimilaridade;
    }

    public void setCoeficienteDeSimilaridade(String coeficienteDeSimilaridade) {
        this.coeficienteDeSimilaridade = coeficienteDeSimilaridade;
    }

    public float getSimilaridadeTotalSessao() {
        return similaridadeTotalSessao;
    }

    public void setSimilaridadeTotalSessao(float similaridadeTotalSessao) {
        this.similaridadeTotalSessao = similaridadeTotalSessao;
    }

    public String getProbabilidadeDetecao() {
        return probabilidadeDetecao;
    }

    public void setProbabilidadeDetecao(String probabilidadeDetecao) {
        this.probabilidadeDetecao = probabilidadeDetecao;
    }

    public String getRanks() {
        return ranks;
    }

    public void setRanks(String ranks) {
        this.ranks = ranks;
    }

    public float getEntropia() {
        return entropia;
    }

    public void setEntropia(float entropia) {
        this.entropia = entropia;
    }

    public int getDkg() {
        return dkg;
    }

    public void setDkg(int dkg) {
        this.dkg = dkg;
    }
}
