import { 
    createService, 
    findAllService, 
    countNews, 
    topNewsService,
    findByIdService,
    searchByTitleService,
    byUserService,
    updateService,
    eraseService,
    likeNewsService,
    deleteLikeNewsService
} from "../services/news.service.js";

/*
para a parte de autorização o frontend vai enviar o 'jwt token' junto da 
requisicao no header para que possamos verificar se o usuario é ou nao 
autenticado.
*/ 

export const create = async(req, res) => {

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

export const findAll = async(req, res) => {

    try {
        // para adicionar paginancao  precisamos receber dois 
        //pramentros, que sao a quantidade de registros que serao 
        //retornado e a partir de qual registro ocorrerá a captura e o retorno.
        // Esses valores sao obtido da chamada 'query params',
        // que nada mais sao que parametros da query. Note que 'query params'
        // é completamente diferente de 'req params'
        // esses valores serao enviados lá do frontend e conseguimos 
        //capturar eles aqui através de 'req.query'.
        // esses valores chegam em forma de string.
        let { limit, offset } = req.query
        console.log(`Os valore requeridos pelo usuário sao limit = ${limit} e offset = ${offset}`);

        limit = Number(limit);
        offset = Number(offset);

        // aqui estaremos definindo valores default, para quando os parametros nao receberem valores.

        if(!limit) {
            limit = 5;
        }

        if(!offset) {
            offset = 0
        }


        // esta query servirá para consumo interno, pois quando o a 
        // execuçao do codigo passar por esse ponto a consulta vai 
        // ser feita e postriormente no metodo de send lá em baixo 
        // vai ter um 'map()' itereando sobre o array retornado da query
        //  e pegando as informacoes importantes e retornando um array 
        // com elas e mandando para o frontEnd também.
        const news = await findAllService(offset, limit); 

        const total = await countNews(); // retornando o total de documents que a collection possui
        const currentUrl = req.baseUrl; // neste ponto capturamos a url que fez a requisicao
        

        const next = offset + limit; // esta soma faz parte da logica, pois como vamos retornar no minimo 5 e no maximo o valor que o usuario digitar. Entao depois da primeira paginacao, a segunda tem que necessariamente trazer os registros subsequentes na mesma quantidade da primeira paginacao, ou seja, se sao 5 resgistros por vez, entao na proxima paginacao tem que ser retornado so 5 proximos registros disponiveis
        
        // aqui estaremos verificando se a soma de offset e limit é menor que o total de registros, se for, entao nextUrl recebe a composicao da url com o 'query param' de paginacao com o parametro "offset" recebendo o conteudo da variável 'next'
        const nextUrl = next < total ?  `${currentUrl}?limit=${limit}&offset=${next}`: null;

        // agora vamos fazer a logica para voltar nos resgistros anteriores
        const previous = offset - limit < 0 ? null : offset - limit;
        const previousUrl = previous != null ? `${currentUrl}?limit=${limit}&offset=${previous}`: null;

        if(news.length === 0) {
            return res.status(400).send({ 
                message: "There are no registered News"
            });
        };

        // agora que criamos as funcionalidade e as propriedades pertinentes a paginacao, 
        // vamos mandar tudo para o frontEnd, pois lá que sera concluida a logica para implementar a paginacao de fato. 
        // vamos mandar tambem um array com as principais informacoes
        res.send({
            nextUrl,
            previousUrl,
            limit,
            offset,
            total,

            results: news.map((item) => ({
                id: item._id,
                title: item.title,
                text: item.text,
                banner: item.banner,
                likes: item.likes,
                comments: item.comments,
                name: item.user.name,
                username: item.user.username,
                userAvatar: item.user.avatar,
            }))
        });
    }catch(err){
        res.status(500).send({ message: err.message });
    };

};

// esta funcao vai ficar resposável por enviar a noticia postada mais recente
export const topNews = async(req, res) => {
    
    try {
        const news = await topNewsService();

        if(!news) {
            return res.status(400).send({ messag: "There is no registered post"})
        }

        // aqui mandamos o objeto contendo as informacoes do posta mais recente
        res.send({
            news: {
                id: news._id,
                title: news.title,
                text: news.text,
                banner: news.banner,
                likes: news.likes,
                comments: news.comments,
                name: news.user.name,
                username: news.user.username,
                userAvatar: news.user.avatar,
            },
        });
    } catch(err){
        res.status(500).send({ message: err.message });
    };
};

export const findById = async (req, res) => {
    try {
        const { id } = req.params;
    
        const news = await findByIdService(id);

        res.send({
            news: { 
                id: news._id,
                title: news.title,
                text: news.text,
                banner: news.banner,
                likes: news.likes,
                comments: news.comments,
                name: news.user.name,
                username: news.user.username,
                userAvatar: news.user.avatar,
            },
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    };
};

// a consulta no banco nos retorna semrpe um array de objetos, portanto 
//devemos percorrer ele com o 'map()' para pegar suas informacoes e poder 
//enviar para o cliente. Caso contrário o express nao vai conseguir enviar os dados
export const searchByTitle = async (req, res) => {
    try {
        const {title} = req.query;

        const news = await searchByTitleService(title);

        if(news.length === 0) {
            return res
                .status(400)
                .send({ message: "There are no news with this title"});
        }

        //vai ser através da contante 'news' que contem 
        //o retorno da busaca no banco que vamo percorrer com o 'map()' 
        return res.send({
            results: news.map((item) => ({
                id: item._id,
                title: item.title,
                text: item.text,
                banner: item.banner,
                likes: item.likes,
                comments: item.comments,
                name: item.user.name,
                username: item.user.username,
                userAvatar: item.user.avatar,
            }))
        })

    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}

export const byUser = async (req, res) => {
    try {
        // nesta estratégia da róta o 'id' que vai ser mandado para o service é justamente o 'id' obtido la no middleware, que já é retornadoe inserido na 'req', portnato toda rota que precisar de autenticacao por padrao depois de passar com sucesso pela autenticacao a requisicao vai receber o 'id' do proprio usuario e vi ficr armazenada na variável 'userId' dentro da requisicao!
        const id = req.userId;
        const news = await byUserService(id);

        return res.send({
            results: news.map((item) => ({
                id: item._id,
                title: item.title,
                text: item.text,
                banner: item.banner,
                likes: item.likes,
                comments: item.comments,
                name: item.user.name,
                username: item.user.username,
                userAvatar: item.user.avatar,
            }))
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}

//ATENCAO: verificar como  fazer para distinguir qual poostagem será editada, pois se um usuario possuir mais de uma postagem com a funcionalidade abaixo sendo geral, todas as postagem receberao a atualizada para aquele mesmo campo.
export const update = async(req, res) => {
    try {
        const { title, text, banner } = req.body;
        const { id } = req.params;

        if (!title && !banner && !text) {
            res.status(400).send({
                message: "Submit at least one field to update the post",
            }); 
        }

        const news = await findByIdService(id);

        // Aqui nos certificamos que quem está obtendo essa informacoes é o proprio usuário, pois so ele pode editá-las.
        // temos que converter o 'id' do usuario obtido do objeto 'news' para string pois o 'id' vindo do 'req.' vem no formato string
        if(String(news.user._id) !== req.userId) {
            return res.status(400).send({
                message: "You didn't update this post",
            });
        }

        // nao precisa atribuir a uma constante pois essa é uma operacao de atualizacao, neste ponto os dados novos sao enviados para o banco para substituir os antigos
        await updateService(id, title, text, banner);

        // Após o envio dos dados ao banco devolvemos apenas um menssagem dizendo que a operacao foi bem sucedida!
        return res.send({ message: "Post successfully updated!" })
        
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}

export const erase = async (req, res) => {
    try {
        const { id } = req.params;

        const news = await findByIdService(id);

        // esta validacao serve para saber se quemesta requisitando 
        // essa funcionalidade é o mesmo que está logado, 
        //sao nao for, entao será negado.
        if(String(news.user._id) !== req.userId) {
            return res.status(400).send({
                message: "You didn't delete this post",
            });
        }

        // novamente nao precisamos atribuir a uma constante pois se trata de uma operacao de exclusao, ou seja, se a execucao chegou nesse ponto significa que deu tudo certo, após essa funcao mandamos  uma mensagem informando ao usuário que deu certo a operacao.
        await eraseService(id);

        return res.send({ message: "Post successfully updated!" });

    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}

export const likeNews = async (req, res) => {

    try {
        const { id } = req.params; // este é o id da noticio que estará presente na requisicao atraves dos parametros enviados
        const userId = req.userId;

        const newsLiked = await likeNewsService(id, userId);
        
        // neste ponto vamos já adicionar a funcionalidade de, caso o like ja tenha sido dado pelo usuario vamso desfazer o like, masma logica do instagram!!! 
        // em javaScript 'null == false' e portanto poderemos usar a verificacao invertida com o 'if'.
        if (!newsLiked) {
            await deleteLikeNewsService(id, userId);
            return res.status(200).send({
                message: "LIke successfully removed"
            });
        }

        res.send({ message: "Like done successfuly" });
        
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}

//export { create, findAll, topNews, findBiId};