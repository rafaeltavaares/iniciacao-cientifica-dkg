package ic.pesquisa.projeto.demo.Domain.novo;

import ic.pesquisa.projeto.demo.Domain.novo.Session;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "queries")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class Queries {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;

    @Column(name = "query", columnDefinition = "TEXT", nullable = false)
    private String query;

    public Queries(Session session, String query) {
        this.session = session;
        this.query = query;
    }
}
