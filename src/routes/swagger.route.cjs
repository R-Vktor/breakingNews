const route = require("express").Router();


// quando usamos moduleJS com arquivos json precisamos colocar "assert { type: "json"}" que serve como um tipo de parse;

const swaggerUi = require ("swagger-ui-express");
//import swaggerDocument from "../swagger.json" assert { type: "json" };  quando o servidor de deploy rodar nodoe superior a versao 17 poderemos usar essa funcionalidade

const swaggerDocument = require ("../swagger.json");

route.use("/", swaggerUi.serve);
route.get("/", swaggerUi.setup(swaggerDocument));

module.exports = route;
