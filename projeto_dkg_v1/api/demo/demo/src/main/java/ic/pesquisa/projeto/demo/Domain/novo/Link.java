package ic.pesquisa.projeto.demo.Domain.novo;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
@Entity
@Table(name = "link")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Link {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;

    @Column(name = "link",columnDefinition = "TEXT", nullable = false)
    private String Link;

    public Link(Session session, String link) {
        this.session = session;
        this.Link = link;
    }
}
