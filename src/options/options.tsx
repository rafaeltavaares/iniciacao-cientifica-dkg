import React from 'react'
import {createRoot} from "react-dom/client"
import './options.css'


const test = (
   <div>
     <h1 >Olá mundo! com opções</h1>
   </div>
)


const conteiner = document.createElement("div")

document.body.appendChild(conteiner)
const root = createRoot(conteiner)
root.render(test)