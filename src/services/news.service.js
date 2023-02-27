import News from '../models/News.js';

export const createService = (body) => News.create(body);

// a funcao que carrega o metodo '.fin()' vai ser encadeada com o metodo '.sort()' 
//que retorna os registros ordenados do ultimo para o primeiro, ou seja, trás o mais
// recente primeiro e assim vai ate o mais antigo que foi o primeiro a ser guardado no
// banco, essa estratégia é pertinente pois nesse caso se trata de noticias entao a ultima 
//noticia a ser postada é a mais recente e relevante, entao dever aparacer em primeiro lugar.
// o banco de dados armazena as informacoes em forma de 'fila' portanto se fazemos uma query
// sem usar o parametro '-1' teremos o retorno do que chegou primeiro no banco de dados.
// 'offset' vai conter o valor de 'skip()', ou seja, a partir de que posicao que a busca vai começar.
// 'limit' vai conter o valor de 'limit()' que é a quantidade de registros que serao retornados. 
// 'populate()' é um metodo para composicao de queries que permite adicionar um 'document' de outra collection dentro do 'document' principal desde que os dois estejam ligados por relacionamento lo no 'model'
export const findAllService = (offset, limit) => News.find().sort({_id: -1}).skip(offset).limit(limit ).populate("user");

export const countNews = () => News.countDocuments(); // neste ponto estamos capturando a quantidade de documents que existe na collection 'News'.

// nesta funcao vamos buscar um item que é a postagem mais recente, vamos precisar do metodo 'sort()' passandod o parametro '_id: -1' para poder bucar pelo ultimo item que é o mais recente e por ultimo adicionamos um 'document' contento as informacoes do autor da postagem com o metodo 'populate()'
export const topNewsService = () => News.findOne().sort({ _id: -1 }).populate("user");

export const findByIdService = (id) => News.findById(id);

// 'query strings'
// esta funcao do service vai ser responsável por buscar no banco o titulo da noticia. Para isso vamos receber o titulo que o usuário enviar e vamos usar uma 'regex' diretamente na 'query' de pesquisa que vai validar se o conteudo do 'title' é uma string inteira ou parte de uma string, na sequecnia teremos teremos o parametro '$options' recebendo o valor "i" que significa que nao queremos que o mongo faça distincao entre maiusculo ou minusculo. Lógico que vamos encadear com os metodos que ja conhecemos '.sort()' e 'populate()'
export const searchByTitleService = (title) => News.find({
   title: { $regex: `${title || ""}`, $options: "i"},
})
    .sort({ _id: -1 }).populate("user");

// aqui estamos usando o 'id' do usuario que foi obtido no middleware de autenticacao
export const byUserService = (id) => News.find({ user: id}).sort({ _id: -1}).populate("user")

export const updateService = (id, title, text, banner) => News.findOneAndUpdate({_id: id}, {title, text, banner}, { rewResult: true});

export const eraseService = (id) => News.findByIdAndDelete({ _id: id});