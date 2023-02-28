import { Router } from "express";
const router = Router();

import { create, findAll, topNews, findById, searchByTitle, byUser, update, erase, likeNews } from "../controllers/news.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"


// NOTA: quando temos muitas rotas temos que deixar as que 
//possuem 'params' por ultimo pois o express se perde na 
//hora de direcionar para a rota certa. 
//Devemos fazer sempre isso!
router.post("/", authMiddleware, create);
router.get("/", findAll);
router.get("/top", topNews); // esta rota nao precisa de altenticacao pois ela executa acoes que qualquer pessoa que entrar no site possa fazer.
router.get("/search", searchByTitle); // // esta rota nao precisa de altenticacao pois ela executa acoes que qualquer pessoa que entrar no site possa fazer.
router.get("/byUser", authMiddleware, byUser); // a logica vai ser a seguinte esta rota vai ser acessada pelo proprio usuario para ver seu proprio perfil, como temos um middleware que devolve o 'id' do usuario que estava mesclado na altenticacao nao precisaremos que receber o id por 'req.params'. Nao serve para um usuário ver o perfil de um terceiro, justamente porque vamos dar um 'find()' lá no 'service' através do 'id' obtido no 'midlleware'



// params sempre por ultimo
router.get("/:id", authMiddleware, findById);
router.patch("/:id", authMiddleware, update);
router.delete("/:id", authMiddleware, erase);
router.patch("/like/:id", authMiddleware, likeNews);

export default router;