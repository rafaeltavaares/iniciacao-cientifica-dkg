package ic.pesquisa.projeto.demo.Domain.novo;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
@Entity
@Table(name = "resultados_metricas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor


public class ResultadoMetrica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;

    @Column(name = "resultado_metrica", nullable = false)
    private Double resultadoMetrica;

    public ResultadoMetrica(Session session, Double resultadoMetrica) {
        this.session = session;
        this.resultadoMetrica = resultadoMetrica;
    }
}