package ic.pesquisa.projeto.demo.Repositories;
import ic.pesquisa.projeto.demo.Domain.novo.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ic.pesquisa.projeto.demo.Domain.novo.Session;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {
}

