import bcrypt from 'bcrypt';
import { loginService } from '../services/auth.service.js';

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
        
        res.send("Login ok ")

    } catch(err) {
        res.status(500).send(err.message)
    }
}

export { login };