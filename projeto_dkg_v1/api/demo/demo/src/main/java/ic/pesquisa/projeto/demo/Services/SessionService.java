package ic.pesquisa.projeto.demo.Services;
import ic.pesquisa.projeto.demo.DTOs.sessionDTO;
import ic.pesquisa.projeto.demo.Domain.Usuario;
import ic.pesquisa.projeto.demo.Domain.novo.*;
import ic.pesquisa.projeto.demo.Repositories.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SessionService {

    @Autowired
    private  SessionRepository sessionRepository;
    @Autowired
    private  QueryRepository queryRepository;
    @Autowired
    private  ResultadoMetricaRepository resultadoMetricaRepository;
    @Autowired
    private probabilidadeRepository probabilidadeRepository;
    @Autowired
    private  CoeficienteSimilaridadeRepository coeficienteSimilaridadeRepository;
    @Autowired
    private  RankRepository rankRepository;
    @Autowired
    private  EntropiaRepository entropiaRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private LinkRepository linkRepository;

    @Transactional
    public Session salvarSessaoComDados(sessionDTO dto) {
        // 1. Criar e salvar a sessão principal
        Session session = new Session(dto);
        Usuario usuario = userRepository.findById(dto.usuarioId()).orElseThrow();
        System.out.println(usuario);
        session.setUsuarioId(usuario);
        Session se = sessionRepository.save(session);

        if (dto.queries() != null) {
            List<Queries> queries = dto.queries().stream()
                    .map(q -> new Queries(se, q)) // Cria o objeto Queries passando a session e o valor da query
                    .collect(Collectors.toList());
            queryRepository.saveAll(queries);
        }

        // 3. Salvar resultados métricos
        if (dto.resultadosMetricas() != null) {
            List<ResultadoMetrica> resultados = dto.resultadosMetricas().stream()
                    .map(r -> new ResultadoMetrica(se,r))
                    .collect(Collectors.toList());
            resultadoMetricaRepository.saveAll(resultados);
        }

        if (dto.resultadosMetricas() != null) {
            List<ResultadoMetrica> resultados = dto.resultadosMetricas().stream()
                    .map(r -> new ResultadoMetrica(se,r))
                    .collect(Collectors.toList());
            resultadoMetricaRepository.saveAll(resultados);
        }
        if (dto.probabilidadeDetecao() != null) {
            List<ProbabilidadeDeteccao> resultados = dto.probabilidadeDetecao().stream()
                    .map(r -> new ProbabilidadeDeteccao(se,r))
                    .collect(Collectors.toList());
            probabilidadeRepository.saveAll(resultados);
        }

        // 4. Salvar coeficientes de similaridade
        if (dto.links() != null) {
            List<Link> links = dto.links().stream()
                    .map(c -> new Link(se,c))
                    .collect(Collectors.toList());
            linkRepository.saveAll(links);
        }

        // 5. Salvar ranks
        if (dto.ranks() != null) {

            List<Rank> ranks = dto.ranks().stream()
                    .map(r -> new Rank(se,r))
                    .collect(Collectors.toList());
            rankRepository.saveAll(ranks);
        }

        // 6. Salvar entropias
        if (dto.entropias() != null) {

            List<Entropia> entropias = dto.entropias().stream()
                    .map(e -> new Entropia(se,e))
                    .collect(Collectors.toList());
            entropiaRepository.saveAll(entropias);
        }

        return session;
    }
}
