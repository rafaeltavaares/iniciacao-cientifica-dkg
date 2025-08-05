package ic.pesquisa.projeto.demo.Domain.novo;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "probabilidade_deteccao")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProbabilidadeDeteccao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;

    @Column(name = "probabilidade", nullable = false)
    private Double probabilidade_deteccao;

    public ProbabilidadeDeteccao(Session session, Double probabilidade) {
        this.session = session;
        this.probabilidade_deteccao = probabilidade;
    }
}
