import express from 'express';
import userController from '../controllers/user.controller.js';
import { validId, validUser } from "../middlewares/global.middlewares.js";

const route = express.Router(); // com s mudança de padrao de modulos para o 'es module' é necessario instanciar as classes e adicionar os metodos a constantes

route.post("/", userController.create);
route.get("/", userController.findAll);
route.get("/:id", validId, validUser, userController.findById); // depois de " : " passamos o nome que vai conter o que a gente passar lá no 'endPoint'
route.patch("/:id", validId, validUser, userController.update);

export default route; 