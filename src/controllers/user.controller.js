const create = (req, res) => {
    
    // para fins de validacao vamos desmembrar os campos que estao sendo recebidos,
    // fazemos isso usando o destructuring
   const {name, username, email, password, avatar, background} = req.body;

   if(!name || !username || !email || !password || !avatar || !background) {
    res.status(400).send({erroMessage: "Submit all fields for resgistration"})
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
   // aqui vamo sdevolver um array de objetos.
   // obviamente nao podemos devolver a informacao da 'SENHA'
   res.status(201).send({
       succcessMessage: "Register successfuly!!",
        user: {
            name, 
            username, 
            email,  
            avatar, 
            background,
        }, 
    });
    
}



module.exports = { create };