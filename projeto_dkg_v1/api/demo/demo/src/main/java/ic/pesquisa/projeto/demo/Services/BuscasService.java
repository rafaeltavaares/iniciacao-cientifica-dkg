package ic.pesquisa.projeto.demo.Services;

import ic.pesquisa.projeto.demo.DTOs.BuscaDTO;
import ic.pesquisa.projeto.demo.Domain.Buscas;
import ic.pesquisa.projeto.demo.Domain.Usuario;
import ic.pesquisa.projeto.demo.Repositories.BuscaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Date;

@Service
public class BuscasService {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private BuscaRepository buscaRepository;

    private void salvarBusca(Buscas busca) {
        System.out.println(busca);
        buscaRepository.save(busca);
    }


}


