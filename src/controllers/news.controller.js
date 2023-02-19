import { createService, findAllService } from "../services/news.service.js";

/*
para a parte de autorização o frontend vai enviar o 'jwt token' junto da 
requisicao no header para que possamos verificar se o usuario é ou nao 
autenticado.
*/

const create = async(req, res) => {

    try{
        const { title, text, banner } = req.body;

        if(!title || !banner || !text) {
            res.status(404).send({
                message: "Submit all fields for registration",
            });
        }; 

        await createService({
            title,
            text,
            banner,
            // agora que temos autenticacao e autorizacao, e o middleware 
            // de verificacao da authorization colocando o 'id' 
            // decodificado no objeto do 'req' podemo capturálo aqui 
            // para poder completar o campo de 'id',  pois dessa forma
            // signifca que o usuário foi devidamente autenticado para 
            // poder fazer essa ascao de insersao no banco.
            user: req.userId,
        })

        res.send(201);

    }catch(err){
        res.status(500).send({ message: err.message });
    };
};

const findAll = async(req, res) => {
    const news = await findAllService();

    if(news.length === 0) {
        return res.status(400).send({ 
            message: "There are no registered users"
        });
    };

    res.send(news);
};

export { create, findAll };