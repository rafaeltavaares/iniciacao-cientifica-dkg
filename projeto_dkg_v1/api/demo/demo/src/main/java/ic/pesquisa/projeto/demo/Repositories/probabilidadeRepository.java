package ic.pesquisa.projeto.demo.Repositories;

import ic.pesquisa.projeto.demo.Domain.novo.ProbabilidadeDeteccao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface probabilidadeRepository extends JpaRepository<ProbabilidadeDeteccao,Long> {
}
