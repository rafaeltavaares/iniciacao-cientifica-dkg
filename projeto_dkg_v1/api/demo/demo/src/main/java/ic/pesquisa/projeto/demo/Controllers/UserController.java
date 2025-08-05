package ic.pesquisa.projeto.demo.Controllers;

import ic.pesquisa.projeto.demo.DTOs.ExisteDTO;
import ic.pesquisa.projeto.demo.DTOs.ExisteLoginDTO;
import ic.pesquisa.projeto.demo.DTOs.UsuarioDTO;
import ic.pesquisa.projeto.demo.DTOs.loginDTO;
import ic.pesquisa.projeto.demo.Domain.Usuario;
import ic.pesquisa.projeto.demo.Repositories.UserRepository;
import ic.pesquisa.projeto.demo.Services.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/criar")
    public ResponseEntity<Usuario> criarUsuario(@RequestBody UsuarioDTO usuario) {
        return new ResponseEntity<>(usuarioService.criarUsuario(usuario), HttpStatus.CREATED);
    };

    @PostMapping("/login")
    public ResponseEntity<ExisteLoginDTO> logar(@RequestBody loginDTO login){
        return new ResponseEntity<>(usuarioService.ExistUsuario(login.email(),login.senha()),HttpStatus.OK);
    }

    @GetMapping("/verificar")
    public ResponseEntity<ExisteDTO> verificarUsuario(@RequestParam String email){
        System.out.println("Verificando usuário com email: " + email);
        return new ResponseEntity<>(usuarioService.ExistsByEmail(email),HttpStatus.OK);
    }

    @GetMapping("/teste")
    public String teste(){
        return "ok";
    }

}
