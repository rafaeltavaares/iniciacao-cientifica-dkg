/******/ (() => { // webpackBootstrap
/*!**********************************************!*\
  !*** ./src/content-script/content-script.ts ***!
  \**********************************************/
let escutaEstaAtiva = false;
let listenerRegistrado = false;
chrome.storage.local.get("escutando", (r) => {
    if (r.escutando) {
        escutaEstaAtiva = true;
        capturarCliques();
    }
});
chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.escutando) {
        escutaEstaAtiva = changes.escutando.newValue === true;
        if (escutaEstaAtiva) {
            capturarCliques();
        }
        else {
            chrome.storage.local.remove(["dkg"]);
        }
    }
});
function capturarCliques() {
    if (escutaEstaAtiva && !listenerRegistrado) {
        listenerRegistrado = true;
        document.addEventListener('click', (e) => { handleClick(e); });
    }
}
function handleClick(event) {
    const inputBusca = document.querySelector('input[name="q"]');
    if (!inputBusca)
        return;
    const valorAtual = inputBusca.value.trim();
    const valorAnterior = localStorage.getItem("valorAnterior") || "";
    const igualdade = valorAtual === valorAnterior;
    processarClique(event, igualdade, valorAtual);
    localStorage.setItem("valorAnterior", valorAtual);
}
function processarClique(event, igualdade, valorAtual) {
    const target = event.target;
    const linkClicado = target.closest('a');
    if (!linkClicado)
        return;
    event.preventDefault();
    const resultados = Array.from(document.querySelectorAll('div.b8lM7'))
        .map(div => div.querySelector('a'))
        .filter((a) => !!a && !a.closest('[jsname="yEVEwb"]'));
    const index = resultados.findIndex(a => a.href === linkClicado.href);
    if (index === -1 || index >= 10) {
        console.log('❌ Clique fora dos top 10 resultados orgânicos ou em seção desconsiderada.');
        return;
    }
    chrome.storage.local.get("dkg", (result) => {
        const dados = result.dkg || {};
        if (!dados[valorAtual])
            dados[valorAtual] = [];
        const jaExiste = dados[valorAtual].some(item => item.link === linkClicado.href);
        if (!jaExiste) {
            dados[valorAtual].push({
                link: linkClicado.href,
                rank: index + 1,
                horario: Date.now()
            });
            chrome.storage.local.set({ dkg: dados }, () => {
                // Espera ~100ms antes de redirecionar, garantindo que o storage foi escrito
                setTimeout(() => {
                    window.location.href = linkClicado.href;
                }, 100);
            });
        }
    });
    window.location.href = linkClicado.href;
}

/******/ })()
;
//# sourceMappingURL=content-script.js.map