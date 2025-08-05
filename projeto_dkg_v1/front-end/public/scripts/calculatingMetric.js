


const distancia = [
    [1, 0.98, 1, 1, 1, 1, 1, 1, 1, 1],
    [null, 1, 0.62, 0.77, 0.92, 0.96, 0.99, 1, 1, 1],
    [null, null, 1, 0.95, 0.42, 0.55, 0.63, 0.73, 0.89, 0.95],
    [null, null, null, 1, 0.82, 0.31, 0.40, 0.46, 0.52, 0.68],
    [null, null, null, null, 1, 0.69, 0.22, 0.29, 0.35, 0.40],
    [null, null, null, null, null, 1, 0.54, 0.17, 0.24, 0.29],
    [null, null, null, null, null, null, 1, 0.47, 0.14, 0.19],
    [null, null, null, null, null, null, null, 1, 0.43, 0.12],
    [null, null, null, null, null, null, null, null, 1, 0.41],
    [null, null, null, null, null, null, null, null, null, 1]
  ]

class Metric {
    constructor(sessionid) {
        this.userid = 2
        this.sessionid = sessionid;
        this.query = [];
        this.resultado_metrica = [];
        this.links = [];
        this.coeficiente_similaridadeTotal = 0;
        this.coeficiente_similaridade = [];
        this.probabilidade_detecção = [];
        this.resultado_metrica_fim = 0;
        this.registro = 0;
        this.ranks = [];
        this.entropia = 0;
    }
    calcularInterseção(){
        let query1 = this.query[this.query.length - 1];
        let query2 = this.query[this.query.length - 2];
        const palavras1 = query1.toLowerCase().split(/\s+/);
        const palavras2 = query2.toLowerCase().split(/\s+/);
    
        const setPalavras1 = new Set(palavras1);
    
        const interseção = palavras2.filter(palavra => setPalavras1.has(palavra));
        
        return interseção.length;   
    }

    calcularUniao() {
        let query1 = this.query[this.query.length - 1];
        let query2 = this.query[this.query.length - 2];
        const palavras1 = query1.toLowerCase().split(/\s+/);
        const palavras2 = query2.toLowerCase().split(/\s+/);
    
        const uniao = new Set([...palavras1, ...palavras2]);

        return uniao.size;
    }
    calcularSimilaridade(){
        let resultadoUniao = this.calcularUniao();
        let resultadoInderseção = this.calcularInterseção();
        
        let qsim = resultadoInderseção/resultadoUniao;
        this.coeficiente_similaridadeTotal += qsim;
        let result = (1+qsim)/(this.coeficiente_similaridadeTotal + 1)
        
        this.addcoeficiente_similaridade(result)
        return result;
    }

    calcularDistancia(){
        let penulultimo = this.ranks[this.ranks.length - 1]
        let ultimo = this.ranks[this.ranks.length - 2]
        
        return Math.abs(ultimo-penulultimo)

    }

    procurarProbabilidade(dist,ranking){

       if(distancia[dist][ranking] === null){
            return 0.01
       }else{
        return distancia[dist][ranking]
       }
    }
    getEntropia(){
        return this.entropia;
    }
    calcularEntropia(){
        let pi = this.procurarProbabilidade(this.calcularDistancia(),this.ranks[this.ranks.length - 1])
        this.addprobabilidade_detecção(pi);
        let ent = this.getEntropia()
        let mi = this.calcularSimilaridade()
        
        this.setEntropia(ent + pi * (Math.log(mi/pi)))
         
        let dkg = (1 - this.entropia ) * 0.01 
        this.resultado_metrica.push(dkg)
        console.log(this.resultado_metrica)



    }
    // Getters
    getSessionid() {
        return this.sessionid;
    }

    getQuery() {
        return this.query;
    }
    getRanks(){
        return this.ranks;
    }
    getresultado_metrica() {
        return this.resultado_metrica;
    }

    getLinks() {
        return this.links;
    }

    getcoeficiente_similaridade() {
        return this.coeficiente_similaridade;
    }

    getprobabilidade_detecção() {
        return this.probabilidade_detecção;
    }

    getresultado_metrica_fim() {
        return this.resultado_metrica_fim;
    }

    getcoeficiente_similaridadeTotal() {
        return this.coeficiente_similaridadeTotal;
    }

    getRegistro() {
        return this.registro;
    }

    // Setters
    setSessionid(sessionid) {
        this.sessionid = sessionid;
    }

    setresultado_metrica_fim(resultado) {
        this.resultado_metrica_fim = resultado;
    }

    setcoeficiente_similaridadeTotal(valor) {
        this.coeficiente_similaridadeTotal = valor;
    }

    setRegistro(valor) {
        this.registro = valor;
    }
    setEntropia(valor) {
        this.entropia = valor;
    }
    // Methods to add elements to arrays
    addQuery(query) {
        this.query.push(query);
    }

    addresultado_metrica(resultado) {
        this.resultado_metrica.push(resultado);
    }

    addLink(link) {
        this.links.push(link);
    }

    addcoeficiente_similaridade(coeficiente) {
        this.coeficiente_similaridade.push(coeficiente);
    }

    addprobabilidade_detecção(probabilidade) {
        this.probabilidade_detecção.push(probabilidade);
    }
    addRanks(rank){
        this.ranks.push(rank)
    }
}


const queryBar = document.getElementById("searchbar-query");
const metric = new Metric("session123");

// Recupera os dados do localStorage e recria a instância de Metric
let historyMetricData = JSON.parse(localStorage.getItem('metric-data'));
let historyMetric = historyMetricData ? Object.assign(new Metric("session123"), historyMetricData) : metric;

let tamanho = JSON.parse(localStorage.getItem('clone-google-history')).length - 1;
queryBar.value = JSON.parse(localStorage.getItem('clone-google-history'))[tamanho];

let uniqueQueries = new Set(); // Conjunto para armazenar queries únicas
let i = 0;
// Selecionando todos os links com o evento click
function dkg() {
    const links = document.querySelectorAll('[id^="search-item-"] a');


    links.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Evita que a navegação aconteça imediatamente

           

            const index = link.dataset.index;
            const linkhref = link.href;
            const query = document.querySelector('#searchbar-query')?.value || ""; // Garante que a query seja obtida corretamente

            
            if (typeof historyMetric !== 'undefined') {
                historyMetric.addLink(linkhref);
                historyMetric.addRanks(index);
                historyMetric.setRegistro((window.i = (window.i || 0) + 1));
                historyMetric.addQuery(query);
                historyMetric.calcularEntropia();

                localStorage.setItem("metric-data", JSON.stringify(historyMetric));
            } else {
                console.warn("historyMetric não está definido.");
            }

            // Agora, seguir para o link após o processamento
            window.location.href = linkhref;
        });
    });
}


async function enviarDados(id) {
    const metricData = JSON.parse(localStorage.getItem("metric-data"));
    id = Number(id)

    const body = {  
        "usuarioId": id,
        "sessionId": String(metricData['sessionid']),
        "dataSessao": new Date().toISOString().split('.')[0], // Converte para "yyyy-MM-ddTHH:mm:ss"
        "resultadoMetricaFim": metricData.resultado_metrica.length ? parseFloat(metricData.resultado_metrica.at(-1)) : 0,
        "similaridadeTotalSessao": parseFloat(metricData['coeficiente_similaridadeTotal']),
        "probabilidadeDetecao": metricData['probabilidade_detecção'] ? metricData['probabilidade_detecção'].map(parseFloat) : [],
        "dkgMas": metricData.resultado_metrica.length ? parseFloat(metricData.resultado_metrica.at(-1)) : 0,
        "queries": Array.isArray(metricData['query']) ? metricData['query'] : [],
        "resultadosMetricas": Array.isArray(metricData['resultado_metrica']) ? metricData['resultado_metrica'].map(parseFloat) : [],
        "coeficientesSimilaridade": Array.isArray(metricData['coeficiente_similaridade']) ? metricData['coeficiente_similaridade'].map(parseFloat) : [],
        "ranks": Array.isArray(metricData['ranks']) ? metricData['ranks'].map(parseFloat) : [],
        "entropias": Array.isArray(metricData['entropia']) ? metricData['entropia'].map(parseFloat) : [],
        "links": Array.isArray(metricData['links']) ? metricData['links'] : []
    };
    console.log(body)
    try {
        const response = await fetch("http://127.0.0.1:8080/api/salvar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body) 
        });

        if (response.ok) {
            const data = await response.json();
           
        } else {
            console.error("Erro na requisição:", response);
        }
    } catch (error) {
        console.error("Erro ao conectar com o servidor:", error);
    }
}
dkg()