import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// Por algum motivo o mongoose está exigindo que seja setado um objeto de validacao,
// vamos criar funcoes de validacao que serao nossa 'second layer' de validacao.
// dentro do Schema vamos setar o objeto 'validate' e dentro dele 
// vamos colocar a 'funcao de validacao' e a 'mensagem' caso haja erro. EX:
/*
validate: {
    funcao,
    menssgem
}
*/

/*
function validator(value) {
    if(!value){
        value = "";
    }
};
*/

// O problema real foi que a forma como os dados estavam chegando no Service nao estava sendo
// compatível com os dados esperados pelo schema, portanto os 'required' estavam retornando erro.
// agora esta sendo passada as propriedades já desestruturadas.

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowerCase: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    avatar: {
        type: String,
        required: true,
    },
    background: {
        type: String,
        required: true,
    }
})

// o metodo 'pré' é usado quando queremos executar um acao antes 
//de criar o model, este metodo recebe dois parametros, o primeiro 
//é o nome da acao que vai esperar ate que o 'pré' seja executado, 
//e o segundo parametro é uma funcao anonima que deve ser escrita 
//usanado a palavra reservada 'function(){}' contendo o que o metdo deve executar.

UserSchema.pre("save", async function(next) { // este parametro é igual ao do middleware e serve para dizer a funcao que deve presseguir.
    // O 'this' neste contexto faz referencia ao conteudo do 'UserSchema', mais precisamente est acessando o 'password'.
    // neste ponto estamos subescrevendo a senha pela sua versao encryptada para que seja mandada ao banco de deados.
    this.password = await bcrypt.hash(this.password, 10);
    next(); // aqui a aplicacao vai prosseguir
})

const User = mongoose.model("User", UserSchema);

export default User;