const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = process.env.PORT || 3000;

// Configuração para o serviço ClearDB no Heroku (ou outro serviço de banco de dados em nuvem)
const connection = mysql.createConnection({
  host: process.env.CLEARDB_HOST || 'seu-endpoint-do-cleardb.herokuapp.com',
  user: process.env.CLEARDB_USER || 'root',
  password: process.env.CLEARDB_PASSWORD || 'DaAHccCfDC-BhaF3BEg363aBHe1h4dg-',
  database: process.env.CLEARDB_DATABASE || 'usuarios_ecom',
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err);
  } else {
    console.log('Conectado ao MySQL!');
  }
});

app.use(cors());
app.use(express.json());

app.post('/api/gravar-dados', (req, res) => {
  const { nome, gmail, senha } = req.body;

  if (nome && gmail && senha) {
    const queryInsert = 'INSERT INTO usuarios (nome, gmail, senha) VALUES (?, ?, ?)';
    connection.query(queryInsert, [nome, gmail, senha], (err, results) => {
      if (err) {
        console.error('Erro ao gravar dados:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
      } else {
        console.log('Dados gravados com sucesso');
        res.status(200).json({ message: 'Dados gravados com sucesso' });
      }
    });
  } else {
    res.status(400).json({ error: 'Os campos nome, gmail e senha são obrigatórios' });
  }
});

app.get('/api/listar-usuarios', (req, res) => {
  const querySelect = 'SELECT * FROM usuarios';
  connection.query(querySelect, (err, results) => {
    if (err) {
      console.error('Erro ao listar usuários:', err);
      res.status(500).json({ error: 'Erro interno do servidor' });
    } else {
      console.log('Usuários listados com sucesso');
      res.status(200).json({ usuarios: results });
    }
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${port}`);
});
