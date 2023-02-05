const express = require("express");
const userRoute = require("./src/routes/user.route")

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
app.use(express.json()) 
app.use("/user", userRoute)



const msg = "localhost:3000";

const port = 3000;

app.listen(port, () => {
    console.log(`Servidor rodando em ${msg}`)
}); 


