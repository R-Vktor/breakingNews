import User from '../models/User.js'

const loginService = (email) => User.findOne({email: email}).select("+password"); // dessa forma subescrevemos a regra definida lá no schema de retorno do 'password' de false para verdadeiro apenas nessa consulta. Ou seja o password será retornado apenas aqui, no resto da aplicacao a regra pre definida continua valendo para nao retornar o password.

export {loginService};