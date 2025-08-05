package ic.pesquisa.projeto.demo.Repositories;

import ic.pesquisa.projeto.demo.Domain.novo.ResultadoMetrica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResultadoMetricaRepository extends JpaRepository<ResultadoMetrica,Long> {
}
