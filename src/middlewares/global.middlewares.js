import mongoose from "mongoose";
import userService from "../services/user.service.js";

/*
    A partir de agora feremos uso do 'try{}catch(){}' aqui e no controller.
*/

const validId = (req, res, next) => {
        
    try{
        const id = req.params.id;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).send({ message: "Invalid UserId"})
        };

        next();
    }catch(err) {
        res.status(500).send({message: err.message})
    }
};

const validUser = async (req, res, next) => {
        
    try{
        const id = req.params.id;

        const user = await userService.findByIdService(id);

        if(!user) {
            return res.status(400).send({ message: "User not found" });
        }

        /*
            Aqui vamos adicionar no corpo da requisicao o 'id' 
            que foi capturado e validado do middleware anterior e 
            o 'user' o user que ja foi buscado, dessa forma limpamos 
            mais ainda o nosso codigo  no controller, eliminando 
            repeticao no codigo e melhoramos a performance.
            Lá no controller vamos capturar essas informacoes pela requisicao.
        */
        req.id = id;
        req.user = user;

        next();
    }catch(err) {
        res.status(500).send({message: err.message})
    }
};

export { validId, validUser };