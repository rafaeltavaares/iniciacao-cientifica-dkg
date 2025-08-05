package ic.pesquisa.projeto.demo.Domain.novo;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
@Entity
@Table(name = "coeficientes_de_similaridade")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class CoeficienteSimilaridade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;

    @Column(name = "coeficiente_de_similaridade", nullable = false)
    private Double coeficienteDeSimilaridade;

    public CoeficienteSimilaridade(Session session, Double coeficienteDeSimilaridade) {
        this.session = session;
        this.coeficienteDeSimilaridade = coeficienteDeSimilaridade;
    }
}
