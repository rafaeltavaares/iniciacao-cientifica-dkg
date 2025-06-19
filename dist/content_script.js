/******/ (() => { // webpackBootstrap
/*!**********************************************!*\
  !*** ./src/content-script/content-script.ts ***!
  \**********************************************/
console.log("Content script ativo!");

const div = document.createElement("div");
div.textContent = "Esta página foi modificada pela extensão!";
div.style.position = "fixed";
div.style.top = "10px";
div.style.right = "10px";
div.style.padding = "10px";
div.style.backgroundColor = "yellow";
div.style.zIndex = "9999";

document.body.appendChild(div);

/******/ })()
;
//# sourceMappingURL=content_script.js.map