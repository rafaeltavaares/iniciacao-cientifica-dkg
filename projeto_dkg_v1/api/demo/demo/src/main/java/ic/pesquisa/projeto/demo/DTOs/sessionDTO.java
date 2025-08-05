package ic.pesquisa.projeto.demo.DTOs;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;
import java.util.List;

public record sessionDTO(
        Long usuarioId,
        String sessionId,
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
        LocalDateTime dataSessao,
        Double resultadoMetricaFim,
        Double similaridadeTotalSessao,
        List<Double> probabilidadeDetecao,
        Double dkgMas,
        List<String> queries,
        List<Double> resultadosMetricas,
        List<Double> coeficientesSimilaridade,
        List<Double> ranks,
        List<Double> entropias,
        List<String> links
) { }