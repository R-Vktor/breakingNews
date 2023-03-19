import { Router } from "express";
const route = Router();

// quando usamos moduleJS com arquivos json precisamos colocar "assert { type: "json"}" que serve como um tipo de parse;

import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json" assert { type: "json" }; 

route.use("/", swaggerUi.serve);
route.get("/", swaggerUi.setup(swaggerDocument));

export default route;
