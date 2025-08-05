package ic.pesquisa.projeto.demo.Domain.novo;


import ic.pesquisa.projeto.demo.DTOs.sessionDTO;
import ic.pesquisa.projeto.demo.Domain.Usuario;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class Session {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuarioId;

    @Column(name = "session_id", nullable = false)
    private String sessionId;

    @Column(name = "data_sessao", nullable = false)
    private LocalDateTime dataSessao;

    @Column(name = "resultado_metrica_fim")
    private Double resultadoMetricaFim;

    @Column(name = "similaridade_total_sessao")
    private Double similaridadeTotalSessao;

    @Column(name = "probabilidade_detecao")
    private Double probabilidadeDetecao;

    @Column(name = "dkg_mas")
    private Double dkgMas;


    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Queries> queries;

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ResultadoMetrica> resultadosMetricas;

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CoeficienteSimilaridade> coeficientesSimilaridade;

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Rank> ranks;

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Entropia> entropias;

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Link> link;


    public void setUsuarioId(Usuario usuario){ this.usuarioId = usuario;}

    public Session(sessionDTO dto){

        this.sessionId = dto.sessionId();
        this.dataSessao = dto.dataSessao();
        this.resultadoMetricaFim = dto.resultadoMetricaFim();
        this.similaridadeTotalSessao = dto.similaridadeTotalSessao();
        this.dkgMas = dto.dkgMas();
    }

}
