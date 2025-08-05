package ic.pesquisa.projeto.demo.Repositories;
import ic.pesquisa.projeto.demo.Domain.novo.CoeficienteSimilaridade;
import ic.pesquisa.projeto.demo.Domain.novo.Rank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface RankRepository  extends JpaRepository<Rank,Long> {
}
