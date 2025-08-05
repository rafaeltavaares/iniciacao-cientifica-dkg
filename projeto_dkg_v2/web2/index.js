
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const jwt = require("jsonwebtoken");
const axios = require("axios");

const app = express();

// Configuração do body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("./public"));
app.use(express.urlencoded({ extended: true }));

// Configuração da view engine EJS
app.set("view engine", "ejs");

// Configuração do express-session
app.use(session({
    secret: "minha-chave-segura",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // true apenas para HTTPS
}));

// Middleware global para disponibilizar usuário nas views
app.use((req, res, next) => {
    res.locals.usuario = req.session.user || null;
    console.log("teste")
    next();
});

// Middleware para verificar login
const verificarTokenSession = (req, res, next) => {
    if (!req.session.token) {
        req.session.notificacao = "Você não está logado!";
 
    }
    next();
};

// Rota para a página inicial
app.get('/', (req, res) => {
    res.render("index",{token:0});
});

app.get("/search",verificarTokenSession, (req, res) => {
    const searchValue = req.query["q"];
    const notificacao = req.session.notificacao || null;
    
     console.log(notificacao)


    if (searchValue) {
        const BASE_URL = `https://rafael-api.sa.ngrok.io/api/search?query=${searchValue}`;
        fetch(BASE_URL)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro na API: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                const busca = data['search_parameters'];
                const items = Array.isArray(data["organic_results"]) ? data["organic_results"] : [];
                const searchInformation = Array.isArray(data["related_searches"]) ? data["related_searches"] : [];
                const answer_box = data["answer_box"];
                const graph = data["knowledge_graph"];
                const search_info = data["search_information"];
                const related_searches = data["related_questions"] || [];
                const video = data['inline_videos'] || [];
                
                res.render("results", {
                    param: items,
                    final: searchInformation,
                    busca,
                    answer_box,
                    graph,
                    search_info,
                    related_searches,
                    notificacao:notificacao,
                    video:video
                });
            })
            .catch(error => {
                console.error("Erro ao buscar dados:", error);
                res.status(500).render("error", { message: "Erro ao processar a busca." });
            });
    } else {
        res.render("search", { valor: searchValue, notificacao });
    }
});

// Rota para exibir o formulário de login
app.get("/login", (req, res) => {
    res.render("login", { erros: false });
});
app.get("/register", (req, res) => {
    res.render("register", { erros: false });
});


app.post("/register", async (req, res) => {
    const { nome, email, senha, confirma_senha } = req.body;

    const erros = {
        erro_validar_email: false,
        erro_senha_invalida: false,
        erro_confirmar_senha: false,
        erro_email_existente: false
    };

    // Validação de e-mail
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        erros.erro_validar_email = true;
        return res.render("register", { erros });
    }

    // Validação de senha
    if (!senha || senha.length < 6) {
        erros.erro_senha_invalida = true;
        return res.render("register", { erros });
    }

    // Validação de confirmação de senha
    if (senha !== confirma_senha) {
        erros.erro_confirmar_senha = true;
        return res.render("register", { erros });
    }

    try {
        const BASE_CRIAR_URL = "https://rafael-api.sa.ngrok.io/api/user/criar";
        const USUARIO = { nome, email, senha };

        const response = await fetch(BASE_CRIAR_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(USUARIO)
        });

        const data = await response.json();

        if (!response.ok) {
            // Aqui você pode personalizar mais conforme os erros retornados da API
            if (response.status === 409) {
                erros.erro_email_existente = true;
                return res.render("register", { erros });
            }

            throw new Error("Erro ao criar usuário");
        }

        // Gera token e salva na sessão
        const token = jwt.sign({ email }, "minha-chave-segura", { expiresIn: "1h" });
        req.session.token = token;
        req.session.user = { nome: data.nome, email: data.email, id: data.id };

        return res.redirect("/search");

    } catch (error) {
        console.error("Erro ao registrar usuário:", error);
        return res.status(500).render("register", {
            erros,
            message: "Erro interno ao registrar usuário"
        });
    }
});


// Processamento do login
app.post("/login", async (req, res) => {
    const { email, senha } = req.body;

    const erros = {
        erro_validar_email: false,
        erro_credencial_invalida: false
    };

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        erros.erro_validar_email = true;
        return res.render("login", { erros:erros });
    }

    try {
        const BASE_CRIAR_URL = "https://rafael-api.sa.ngrok.io/api/user/login";
        const USUARIO = { email, senha };

        const response = await fetch(BASE_CRIAR_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(USUARIO)
        });

        const data = await response.json();

        if (!response.ok || !data.existe) {
            erros.erro_credencial_invalida = true;
            return res.render("login", { erros:erros });
        }

        // Gerar e armazenar o token na sessão
        const token = jwt.sign({ email }, "minha-chave-segura", { expiresIn: "1h" });

        req.session.token = token;
        req.session.user = { nome: data.nome, email: data.email,id:data.id };


        res.redirect("/search");

    } catch (error) {
        console.error("Erro ao autenticar:", error);
        return res.status(500).render("login", { erros:erros, message: "Erro interno ao autenticar" });
    }
});

// Rota para logout
app.get("/logout", (req, res) => {
    console.log(req)
    req.session.destroy(() => {
        res.redirect("/login");
    });
});

// Iniciar servidor
app.listen(3000, () => {
    console.log(`Servidor Express rodando em http://localhost:3000`);
});
