package ic.pesquisa.projeto.demo.Repositories;
import ic.pesquisa.projeto.demo.Domain.novo.CoeficienteSimilaridade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CoeficienteSimilaridadeRepository extends JpaRepository<CoeficienteSimilaridade,Long>{
}
