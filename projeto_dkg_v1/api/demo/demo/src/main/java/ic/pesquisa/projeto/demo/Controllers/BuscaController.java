package ic.pesquisa.projeto.demo.Controllers;

import ic.pesquisa.projeto.demo.DTOs.BuscaDTO;
import ic.pesquisa.projeto.demo.DTOs.sessionDTO;
import ic.pesquisa.projeto.demo.Domain.Buscas;
import ic.pesquisa.projeto.demo.Domain.novo.Session;
import ic.pesquisa.projeto.demo.Repositories.BuscaRepository;
import ic.pesquisa.projeto.demo.Services.BuscasService;
import ic.pesquisa.projeto.demo.Services.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;




@RestController
@RequestMapping("/api")
public class BuscaController {

    @Autowired
    private BuscaRepository repository;

    @Autowired
    private BuscasService service;

    @Autowired
    private SessionService sessionService;

    //AIzaSyDjDC4sRPAofjlsLV5kpJdp73C-j2a66Ng
    private static final String API_KEY = "4ea6a20c06ab12509c8923d62822d316c914b956e2646617355122522c81f146";
    //private static final String CX = "0708e8db012094b1c";
    //private static final String SEARCH_URL = "https://www.googleapis.com/customsearch/v1";
    private static final String SEARCH_URL ="https://serpapi.com/search.json?engine=google";



    @GetMapping("/search")
    public String searchGoogle(@RequestParam String query) throws Exception {
        String encodedQuery = URLEncoder.encode(query, StandardCharsets.UTF_8);
        String requestUrl = SEARCH_URL + "&q=" + encodedQuery
                + "&google_domain=google.com&gl=br&hl=pt-br"
                + "&api_key=" + API_KEY;

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(requestUrl))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        return response.body();


    }
    @PostMapping("/salvar")
    public ResponseEntity<Session> criarSessaoComDados(@RequestBody sessionDTO data) {
        Session session = sessionService.salvarSessaoComDados(data);
        System.out.println("estou aqui");
        return ResponseEntity.ok(session);
    }
}
