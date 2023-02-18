import User from '../models/User.js';
import jwt from "jsonwebtoken";

const loginService = (email) => User.findOne({email: email}).select("+password"); // dessa forma subescrevemos a regra definida lá no schema de retorno do 'password' de false para verdadeiro apenas nessa consulta. Ou seja o password será retornado apenas aqui, no resto da aplicacao a regra pre definida continua valendo para nao retornar o password.

// o metodo sign recebe tres parametros o primeiro é o dado do uruário que queremos adicionar ao hash para que depois seja obtido na funcao de verificacao, o segundo é uma string, de preferencia uma string que seja um hash como 'md5' ou 'sha56'. O terceiro parametro é o tempo que esse token vai durar, neste caso vamos colocar de 24hs mas representaremos no metodo em segundos, que é 86400 segundos.
const generateToken = (id) => jwt.sign({id: id}, process.env.SECRET_JWT, {expiresIn: 86400} )

export { loginService, generateToken };