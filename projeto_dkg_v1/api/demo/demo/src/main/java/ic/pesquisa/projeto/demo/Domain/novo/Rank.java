package ic.pesquisa.projeto.demo.Domain.novo;
import jakarta.persistence.*;
import lombok.*;
@Entity
@Table(name = "ranks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class Rank {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;

    @Column(name = "ranks", nullable = false)
    private Double rank;

    public Rank(Session session, Double rank) {
        this.session = session;
        this.rank = rank;
    }
}
