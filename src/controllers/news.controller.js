import { createService, findAllService } from "../services/news.service.js";

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