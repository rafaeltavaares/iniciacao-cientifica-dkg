package ic.pesquisa.projeto.demo.DTOs;

import ic.pesquisa.projeto.demo.Domain.Usuario;


public record BuscaDTO(
        Long usuario_id,
        String session_id,
        String query,
        Float resultado_metrica,
        Float resultado_metrica_fim,
        String links,
        Float coeficiente_similaridade,
        Float coeficiente_similaridadeTotal,
        Float probabilidade_detecção,
        Integer registros,
        String ranks,
        Float entropia,
        Integer dkg
) {
}

