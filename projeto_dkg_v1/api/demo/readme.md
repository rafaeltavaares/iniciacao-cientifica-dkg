
  # 📡 API DKG v1.0

  API desenvolvida com o objetivo de consumir uma API externa que retorna resultados de busca, além de salvar sessões dos usuários para registrar a trilha de navegação durante essas buscas. O intuito é criar uma base de dados com o caminho percorrido pelos participantes ao longo de suas interações.

  ---

  ## 🚀 Tecnologias utilizadas

  - Java 17+
  - Spring Boot
  - MySQL

  ---

  ## ⚙️ Como executar localmente

  1. **Clone o repositório:**
    ```bash
    git clone https://github.com/rafaeltavaares/iniciacao-cientifica-dkg.git
    cd seu-repositorio
    ```

  2. **Configure o `application.properties` (ou `application.yml`) com suas credenciais do MySQL:**
    ```properties
    spring.datasource.url=jdbc:mysql://localhost:3306/nome_do_banco
    spring.datasource.username=seu_usuario
    spring.datasource.password=sua_senha
    spring.jpa.hibernate.ddl-auto=update
    ```

  3. **Execute o projeto:**
    - Via terminal:
      ```bash
      ./mvnw spring-boot:run
      ```
    - Ou rode diretamente pela sua IDE (IntelliJ, Eclipse, etc).

  ---

  ## 📌 Endpoints da API

  ### 🔍 Buscas

  - `GET /search?query={termo}`
    - Realiza uma busca via API externa (SerpAPI / Google).
    - **Parâmetros:** `query` – termo de busca.
    - **Retorno:** JSON com resultados da busca.

  - `POST /salvar`
    - Salva uma sessão de busca com todos os dados do usuário.
    - **Body (JSON):**
      ```json
      {
        "usuarioId": 1,
        "sessionId": "abc123",
        "dataSessao": "2025-08-05T14:30:00",
        "resultadoMetricaFim": 0.85,
        "similaridadeTotalSessao": 0.92,
        "probabilidadeDetecao": [0.1, 0.5, 0.9],
        "dkgMas": 0.75,
        "queries": ["termo 1", "termo 2"],
        "resultadosMetricas": [0.5, 0.6],
        "coeficientesSimilaridade": [0.7, 0.8],
        "ranks": [1, 2],
        "entropias": [0.2, 0.3],
        "links": ["http://exemplo.com"]
      }
      ```

  ### 👤 Usuários

  - `POST /api/user/criar`
    - Cria um novo usuário.

  - `POST /api/user/login`
    - Verifica se o login está correto.

  - `GET /api/user/verificar?email=...`
    - Verifica se o e-mail já está cadastrado.

  - `GET /api/user/teste`
    - Endpoint de teste simples.

  ---

  ## 🧪 DTOs

  - `sessionDTO`: DTO que carrega todos os dados de uma sessão de busca.
  - `UsuarioDTO`: usado para cadastro.
  - `loginDTO`: usado no login.
  - `ExisteLoginDTO`: resposta ao login (dados do usuário + flag).
  - `ExisteDTO`: indica existência de e-mail.

  ---

  ## 📄 Licença

  Este projeto está sob a licença MIT.

  ---
