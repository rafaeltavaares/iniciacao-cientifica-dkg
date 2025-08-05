package ic.pesquisa.projeto.demo.Repositories;
import ic.pesquisa.projeto.demo.Domain.novo.Queries;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QueryRepository extends JpaRepository<Queries, Long> {
}
