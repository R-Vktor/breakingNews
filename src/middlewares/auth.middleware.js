import dotenv from "dotenv";
import userService from '../services/user.service.js'
import jwt from "jsonwebtoken";

dotenv.config();

/*
para a parte de autorização o frontend vai enviar o 'jwt token' junto da 
requisicao no header para que possamos verificar se o usuario é ou nao 
autenticado.
*/

export const authMiddleware  = (req, res, next) => {
    
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
        };

        // os nomes dados aos pedaçoes desestruturados ficam ao seu criterio.
        const [schema, token] = parts;

        // verificando se a variavel que deve conter o nome 'Bearer' foi preenchida com ele mesmo
        if(schema !== "Bearer") {
            return res.send(401);
        };

        // neste ponto vamos fazer a verificacao do conteudo do 'token' paa ver se é valido
        // para isso vamos fazer o uso do metodo do jwt 'verify()'. Este metodo tem 3 parametros
        // o primeiro é o 'token', o segundo é a 'chave secreta' que está no arquivo dotenv, o terceiro vai ser uma funcao que vai ter como  
        // parametro um 'error' que vai capturar um possivel erro, e o segundo parametro é o 'decoded' que vai 
        // conter o resultado da decodificacao, que vai ser o 'id' do usuario ou o dado que voce
        // escolher pra jogar no token ja decodificado, a 'data de criancao' e a 'data de expiracao'.
        jwt.verify(token, process.env.SECRET_JWT, async (error, decoded) => {
           
            if(error) {
                return res.status(401).send({message: "Invalid token!"});
            };

            // neste ponto já teremos o id ou o dado que foi inserido no 
            // token ja decodificado, neste caso colocamos o 'id'.
            // agora podemos enviar o 'id' para frente porém antes 
            // vamos validar ele para ver se é um 'id' valido, se for, a gente adiciona no 'req'.
            // vamos puxar a funcao de consulta do 'id' lá de 'services'
            const user = await userService.findByIdService(decoded.id);

            if(!user || !user.id) {
                return res.status(401).send({message: "Invalid Token!"})
            }

            // como o 'id' foi devidamente validado e verificado 
            // agora podemos enviar para o objeto do 'req' 
            // para que todo acao que precise do id para consultar 
            // o banco de dados esse 'id' possa ser capturado pela 
            // requisicao após ser decodificado do token. Ou seja, 
            //rotas como criacao de nticias vao precisar do 'id' 
            // ela teremos o id sendo capturado via 'req.userId'.
            req.userId = user._id; 

            return next(); // neste caso temos que colocar o 'next()' dentro do metodo 'verify()'
        });
        
    } catch(err) {
        res.status(500).send(err.message);
    };
    
};