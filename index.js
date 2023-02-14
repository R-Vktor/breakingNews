import express from 'express';
const app = express();
import connectDatabase from './src/database/db.js'
import userRoute from './src/routes/user.route.js'

/*
temos dois tipos de sistema de importacao de arquivos, o 'CommonJS' - const express = require("express") e a exportacao 'module.exports = algumacoisa';
e o ecma trás em sua especificacao a indicaçao do uso do 'es module' 
que é a forma mais moderna de fazer importacao e exportacao aqui no node. Fica de seguinte forma 
    'import express from "express" e a exportacao exports dafault algumacoisa ou quando temos mais de uma funcioanlidade para exportar tiramos o 'default' e colocamos dentro de chaves - export {}';
Contudo existe uma pequena mudança, temos agora que colocar a extencao do arquivo, os pacotes continua igual ao que era antes
*/


connectDatabase();
// e necessário habilitar o 'JSON' pois quando
 // estamso trabalhando com o API RestFull o padrao é 
 // receber e enviar informacoes no formato JSON e para 
 // que o express posa interpretar os dados que chegam 
 // em JSON é necessario habilitar;

 // tem que habilitar o 'JSON' antes da habilitacao da arota 
 // pois quando o express começa a ler e configurar ele começa 
 // de cima para baixo, portanto ele ja temq que ter habilitado o parser 
 // para JSON antes de internalizar as rotas.
app.use(express.json()) 
app.use("/user", userRoute) // tudo que for referente ao usuario a nradas das requisicoes serao por aqui e passadas para o controller pertinente.



const msg = "localhost:3000";

const port = 3000;

app.listen(port, () => {
    console.log(`Servidor rodando em ${msg}`)
}); 


