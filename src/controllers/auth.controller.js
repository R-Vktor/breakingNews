import bcrypt from 'bcrypt';
import { loginService, generateToken } from '../services/auth.service.js';

const login = async (req, res) => {
    const { email, password} = req.body;

    // é sempre necessario verificar as informaçoes que retornam, portanto a cada acao devemoso verificar.

    try{
        const user = await loginService(email);

        if(!user) {
            return res.status(404).send({message: "User or Password not found"})
        }

        const passwordIsValid = bcrypt.compare(password, user.password)

        if(!passwordIsValid){
            return res.status(404).send({message: "User or Password not found"})
        }

        // entao depois de obter o 'user' neste ponto pegamo o 'id' do user e mandamos para a geracao do token
        // neste ponto podemos ter a geracao do token de forma 'sincrona' pois é uma funcionalidade interna
        const token = generateToken(user.id);
        
        // colocando entre chaves - { } o conteudo se torna um objeto, e lembrando, como a chave e o valor temo mesmo nome entao so colocamos uma vez
        res.send({token})

    } catch(err) {
        res.status(500).send(err.message)
    }
}

export { login };