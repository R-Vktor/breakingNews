import { createService, findAllService } from "../services/news.service.js";

/*
para a parte de autorização o frontend vai enviar o 'jwt token' junto da 
requisicao no header para que possamos verificar se o usuario é ou nao 
autenticado.
*/

const create = async(req, res) => {

    try{
        const {authorization} = req.headers;
        console.log(authorization);

        if(!authorization) {
            return res.status(401).send();
        }

        // fazendo destructuring para separar o 'Bearer' do restante do token,
        // pois ele vem separados por espaço.
        const parts = authorization.split(" ");

        if(parts.length !== 2) {
            return res.send(401)
        }

        // os nomes dados aos pedaçoes desestruturados ficam ao seu criterio.
        const [schema, token] = parts;

        // verificando se a variavel que deve conter o nome 'Bearer' foi preenchida com ele mesmo
        if(schema !== "Bearer") {
            return res.send(401);
        }

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
            user: { _id: "63ead0722a447bb4793eb9a9"} // este parametro esta sendo setado diretamente para fins de teste, mas como funcionalidade padrao é necessário capturar o dado vindo do 'req.body'
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