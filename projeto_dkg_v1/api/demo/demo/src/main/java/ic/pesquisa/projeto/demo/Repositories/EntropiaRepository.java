package ic.pesquisa.projeto.demo.Repositories;

import ic.pesquisa.projeto.demo.Domain.novo.Entropia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EntropiaRepository extends JpaRepository<Entropia,Long> {
}
