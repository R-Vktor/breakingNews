/*
temos dois tipos de sistema de importacao de arquivos, o 'CommonJS' - const express = require("express") e a exportacao 'module.exports = algumacoisa';
e o ecma trás em sua especificacao a indicaçao do uso do 'es module' 
que é a forma mais moderna de fazer importacao e exportacao aqui no node. Fica de seguinte forma 
'import express from "express" e a exportacao exports dafault algumacoisa ou quando temos mais de uma funcioanlidade para exportar tiramos o 'default' e colocamos dentro de chaves - export {}';
Contudo existe uma pequena mudança, temos agora que colocar a extencao do arquivo, os pacotes continua igual ao que era antes
IMPORTANTE: quando estamos trabalhando com o import e export do 'ES mudules' 
temos que nos atentar ao fato de quando exportamos funcionalidades desestruturadas 
usando 'export default' temos que necessáriamente importar no arquivo 
pertinente com "um nome só" e usar como se fosse uma classe acessando 
seus metodos com notacao de ponto.
Já se exportar-mos usando apenas 'export' podemos importar no arquivo pertinente desconstruindo e nomeando cada funcao para usar separadamente.   

*/


import express from "express";
import connectDatabase from "./database/db.js";
import dotenv from "dotenv";

import userRoute from "./routes/user.route.js";
import authRoute from "./routes/auth.route.js";
import newsRoute from "./routes/news.route.js";
import swaggerRoute from "./routes/swagger.route.cjs";

// como temos a conexao com o banco de dados usando 
// o dotenv e sendo executada aqui no 'index.js' 
// entao é aqui que devemos habilitar o 'dotenv', 
// assim dessa forma todo e qualquer arquivo que usar 
// o 'dotenv' desde que seja executado aqui em 'index.js'
//  poderá usar essa configuracao, nao sendo necessário
// adicionar ele individualmente em cada arquivo.
dotenv.config();


const app = express();

// e necessário habilitar o 'JSON' pois quando
// estamso trabalhando com o API RestFull o padrao é 
// receber e enviar informacoes no formato JSON e para 
// que o express posa interpretar os dados que chegam 
// em JSON é necessario habilitar;

// tem que habilitar o 'JSON' antes da habilitacao da arota 
// pois quando o express começa a ler e configurar ele começa 
// de cima para baixo, portanto ele ja temq que ter habilitado o parser 
// para JSON antes de internalizar as rotas.
connectDatabase();
app.use(express.json()) 
app.use("/user", userRoute) // tudo que for referente ao usuario a nradas das requisicoes serao por aqui e passadas para o controller pertinente.
app.use("/auth", authRoute) 
app.use("/news", newsRoute) 
app.use("/doc", swaggerRoute)

// desta forma ja deixamos pronto para que quando 
//formos subir para o servidor a aplicacao possa 
//definir o ambiente onde esta rodando. Por padrao 
// todo servidor vai disponibilizar uma porta dentro 
// da variável 'PORT', portanto fica a cargo do servidor 
// disponibilizar essa variável com o seu devido conteudo, nao criamos ela. 
const port = process.env.PORT || 3000;


let msg = "";

if (port === 3000) {
    msg = 3000;
} else {
    msg = process.env.PORT;
}

app.listen(port, () => {
    console.log(`Server is running on port ${msg}`)
}); 