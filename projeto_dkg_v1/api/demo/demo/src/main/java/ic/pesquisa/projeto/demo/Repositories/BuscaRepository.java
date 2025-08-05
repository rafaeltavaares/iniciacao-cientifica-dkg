package ic.pesquisa.projeto.demo.Repositories;

import ic.pesquisa.projeto.demo.Domain.Buscas;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BuscaRepository extends JpaRepository<Buscas,Long> {
}
