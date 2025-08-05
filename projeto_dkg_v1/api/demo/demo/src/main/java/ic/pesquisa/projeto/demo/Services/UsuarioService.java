package ic.pesquisa.projeto.demo.Services;

import ic.pesquisa.projeto.demo.DTOs.ExisteLoginDTO;
import ic.pesquisa.projeto.demo.DTOs.MensagemDTO;
import ic.pesquisa.projeto.demo.DTOs.UsuarioDTO;
import ic.pesquisa.projeto.demo.DTOs.ExisteDTO;
import ic.pesquisa.projeto.demo.Domain.Usuario;
import ic.pesquisa.projeto.demo.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UserRepository userRepository;


    public Usuario criarUsuario(UsuarioDTO data) {
        Usuario user = new Usuario(data);

        return salvarUsuario(user);
    }

    private Usuario salvarUsuario(Usuario usuario) {
        return userRepository.save(usuario);
    }

    public Usuario findUserById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("Usuario não encontrado"));
    }

    public ExisteLoginDTO ExistUsuario(String email, String senha){
        if(userRepository.existsByEmail(email)) {
            Usuario u = userRepository.findByEmail(email).get();
            if(u.getSenha().equals(senha)) return new ExisteLoginDTO(true,u.getEmail(),u.getNome(),u.getId());

        }
        return new ExisteLoginDTO(false,null,null,null);
    }

    public ExisteDTO ExistsByEmail(String email){
        if(userRepository.existsByEmail(email)) return new ExisteDTO(true);

        return new ExisteDTO(false);

    }


}
