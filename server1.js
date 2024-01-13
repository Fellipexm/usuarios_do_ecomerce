const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = 3080;

// Configuração do banco de dados
const connection = mysql.createConnection({
  host: 'monorail.proxy.rlwy.net', // Isso pode não ser apropriado para o host do banco de dados em nuvem
  user: 'root',
  password: 'DaAHccCfDC-BhaF3BEg363aBHe1h4dg-',
  database: 'usuarios_ecom',
  port: 17931,
  connectTimeout: 60000,
});

// Conectar ao banco de dados
connection.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err);
  } else {
    console.log('Conectado ao MySQL');
  }
});

// Middleware CORS
app.use(cors());

// Middleware para análise de corpos de solicitação JSON
app.use(express.json());

// Rota para gravar dados
app.post('/api/gravar-dados', (req, res) => {
  const { nome, gmail, senha } = req.body;

  // Verificar se os campos obrigatórios estão presentes e não são nulos ou vazios
  if (nome && gmail && senha) {
    // Lógica para verificar duplicatas e realizar a inserção no banco de dados
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

// Rota para obter dados dos usuários
app.get('/api/listar-usuarios', (req, res) => {
  // Lógica para recuperar dados dos usuários do banco de dados
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

// Modificação para escutar em todos os IPs disponíveis
const server = app.listen(port, '0.0.0.0', () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log(`Servidor rodando em http://${host}:${port}`);
});
