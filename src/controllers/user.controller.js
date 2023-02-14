import userService from'../services/user.service.js';

/*
    Para tornar o codigo mais proficional precisamos fazer uso do 'try{}catch(){}'.
    Vamos implementar ele em todas as funcoes, principalmente àquelas que fazem 
    operacoes dependendo de funcionalidades externas. Lá no fronteEnd é necessário 
    envolver no 'try{}catch(){}' tanto as chamadas a api quanto no parse das respostas.
*/


const create = async (req, res) => {
    
    try{
        // para fins de validacao vamos desmembrar os campos que estao sendo recebidos,
        // fazemos isso usando o destructuring
        const {name, username, email, password, avatar, background} = req.body;

        if(!name || !username || !email || !password || !avatar || !background) { // aqui vamos verificar se em algum dos campos enviados for null o 'if' vai retornar uma mesagem de erro
            res.status(400).send({erroMessage: "Submit all fields for registration"})
        }

        // depois de verificado vamos adicionar as informacoes no banco e a variável 'user' vai receber o usuario recem criado já com o '_id'
        // por algum motivo passar o objeto 'req.body' nao estava dando certo, pois aso passar para dentro do service chagava lá como 'null'
        // portanto aproveitei a desestruturacao e passei um array com as variaveis.
        const user = await userService.createService({
            name,
            username,
            email,
            password,
            avatar,
            background,
        });


        // depois de passar pelo processo de criacao do dado lá no atlas esse  'if' vai verificar se tudo esta certo com a criacao do usuario, caso por algum motivo o 'user' esta null ou undefined o 'if' retorna um erro. CAso contrário a execussao passa para o trecho em que os dados serao retornados para o usuário lá no front
        // lembrando que quando a gente quer que a execussao do programa se encesserre usamos um 'return'
        if(!user) {
            return res.status(400).send({ message: "Error creating User" });
        }
        

        // quando vamos enviar respostas fazemos isso em forma de JSON, 
        // da seguinte forma, ao invés de colocar 'json()' colocamos 
        // apenas o metodo '.send({})' com a mensagem dentro das chaves, 
        // dessa forma a nossa resposta é enviada em formato json e
        //  poderá ser manipulada mais facilmente no 'frontEnd'.

        //É necessário enviar os dados do usuario caso ele 
        // exista na base de dados para que o front possa 
        // utilizálos, pois o front nao tem acesso a esse 
        // tipo de informacao é necessario enviar sempre.
        // aqui vamos devolver um array de objetos.
        // obviamente nao podemos devolver a informacao da 'SENHA'
        // quando temos chave e valor com mesmo nome podemos dexar somente o nome
        res.status(201).send({
            succcessMessage: "Register successfuly!!",
            user: {
                id: user._id,
                name, 
                username, 
                email,  
                avatar, 
                background,
            }, 
        });
    }catch(err) { // o erro do 'try{}catch(){}' é um obejto
        res.status(500).send({message: err.message});
    }

};

const findAll = async (req, res) => {
        
    try{
        const users = await userService.findAllService();

        if(users.length === 0) {
            return res.status(400).send({ message: "There are no registered users"});
        }

        res.send(users)
    } catch(err) {
        res.status(500).send({message: err.message})
    }
};

const findById = async (req, res) => {
    
    try{
        // nao precisamos do 'id' aqui pois ele neste contexto so serve para buscar o usuario, como ja temos o middleaware fazendo isso
        // e ja mandando o usuario, exclui a necessidade de obter-lo
        // O 'usuario' foi buscado lá no middleware e adicionado no corpo da requisicao para ser capturado aqui.
        const user = req.user;

        res.send(user)
    }catch(err){
        res.status(500).send({message: err.message})
    }
};

const update = async (req, res) => {

    try{
        const {name, username, email, password, avatar, background} = req.body;


        if(!name && !username && !email && !password && !avatar && !background) { // aqui vamos verificar se alguma coisa foi enviada em algum dos campos do destructure, se nada for enviado vai retornar um erro
            res.status(400).send({erroMessage: "Submit at list field for update"})
        }

        // Estamos usando a estratégia de destructuring justamente para economizar linha de codigo
        const {id, user} = req

        await userService.updateService(
            id,
            name,
            username,
            email,
            password,
            avatar,
            background
        );

        res.send({ message: "user successfully updated!"});
    }catch(err) {
        res.status(500).send({message: err.message})
    }
    
};

export default { create, findAll, findById, update };