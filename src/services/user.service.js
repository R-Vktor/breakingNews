import User from "../models/User.js";

/*
        !!!!!!!!!!!!!!!! Atencao !!!!!!!!!!!!!!!!!
    Aqui em services teremos a chamada dos 'metodos do mongoose', 
    lá no controller teremos apenas os nomes das funcoes 
    fazendo referencia aos metodos que eles chamam aqui no service.
*/


// este metodo vai ser usado lá no controller e ele vai receber o 'body' da requisicao.

const createService = (body) => User.create(body);

const findAllService = () => User.find();

const findByIdService = (id) => User.findById(id);

const updateService = (
    id,
    name,
    username,
    email,
    password,
    avatar,
    background
) => User.findOneAndUpdate( // neste metodo temos que passar dois parametros, o primeiro é o objeto que vai ser usado para achar a collection e no segundo parametro teremos os campos que poderao ser atualizados. O mongoose vai saber em qual campo vai ter o dado a ser atualizado.
    {_id: id}, 
    {
        name,
        username,
        email,
        password,
        avatar,
        background
    })

export default {
    createService,
    findAllService,
    findByIdService,
    updateService

};