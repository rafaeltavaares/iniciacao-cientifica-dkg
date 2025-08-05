package ic.pesquisa.projeto.demo.Domain.novo;
import jakarta.persistence.*;
import lombok.*;
@Entity
@Table(name = "entropias")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class Entropia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;

    @Column(name = "entropia", nullable = false)
    private Double entropia;

    public Entropia(Session session, Double entropia){
        this.entropia = entropia;
        this.session = session;
    }
}
