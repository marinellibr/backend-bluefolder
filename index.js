const express = require('express');
const app = express();         
const bodyParser = require('body-parser');
const port = 3000; //porta padrão
const sql = require('mssql');
const connStr = "Server=localhost;Database=bluefolder;User Id=sa;Password=luiz0508;";

//fazendo a conexão global
sql.connect(connStr)
   .then(conn => global.conn = conn)
   .catch(err => console.log(err));

//configurando o body parser para pegar POSTS mais tarde
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//definindo as rotas
const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'Funcionando!' }));
app.use('/', router);

//inicia o servidor
app.listen(port);
console.log('API funcionando!');

function execSQLQuery(sqlQry, res){
   global.conn.request()
              .query(sqlQry)
              .then(result => res.json(result.recordset))
              .catch(err => res.json(err));
}

router.get('/clientes', (req, res) =>{
   execSQLQuery('SELECT * FROM Clientes', res);
})

//clientes por ID
router.get('/clientes/:id?', (req, res) =>{
   let filter = '';
   if(req.params.id) filter = ' WHERE ID=' + parseInt(req.params.id);
   execSQLQuery('SELECT * FROM Clientes' + filter, res);
})

//deletar cliente por ID
router.delete('/clientes/:id', (req, res) =>{
   execSQLQuery('DELETE Clientes WHERE ID=' + parseInt(req.params.id), res);
})

//adicionando um cliente
router.post('/clientes', (req, res) =>{
   const id = parseInt(req.body.id);
   const nome = req.body.nome.substring(0,150);
   const cpf = req.body.cpf.substring(0,11);
   execSQLQuery(`INSERT INTO Clientes(ID, Nome, CPF) VALUES(${id},'${nome}','${cpf}')`, res);
})

//atualizando um cliente
router.patch('/clientes/:id', (req, res) =>{
   const id = parseInt(req.params.id);
   const nome = req.body.nome.substring(0,150);
   const cpf = req.body.cpf.substring(0,11);
   execSQLQuery(`UPDATE Clientes SET Nome='${nome}', CPF='${cpf}' WHERE ID=${id}`, res);
})

//vagas
router.get('/vagas', (req, res) =>{
   execSQLQuery('SELECT * FROM Vagas', res);
})

//vagas por ID
router.get('/vagas/:id?', (req, res) =>{
   let filter = '';
   if(req.params.id) filter = ' WHERE ID=' + parseInt(req.params.id);
   execSQLQuery('SELECT * FROM Vagas' + filter, res);
})

//vagas por titulos
router.get('/titulo', (req, res) =>{
   execSQLQuery('SELECT * FROM Vagas ORDER BY titulo', res);
})