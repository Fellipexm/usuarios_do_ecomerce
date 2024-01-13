const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = 3080;

// Configuração do banco de dados
const connection = mysql.createConnection({
  host: 'monorail.proxy.rlwy.net',
  user: 'root',
  password: 'DaAHccCfDC-BhaF3BEg363aBHe1h4dg-',
  database: 'ecomerce',
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

// Rota para obter dados dos usuários
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

// Rota para atualizar senha
app.post('/api/atualizar-senha', (req, res) => {
  const { userId, newPassword } = req.body;

  if (userId && newPassword) {
    const queryUpdate = 'UPDATE usuarios SET senha = ? WHERE id = ?';
    connection.query(queryUpdate, [newPassword, userId], (err, results) => {
      if (err) {
        console.error('Erro ao atualizar senha:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
      } else {
        if (results.affectedRows > 0) {
          console.log('Senha atualizada com sucesso');
          res.status(200).json({ success: true, message: 'Senha atualizada com sucesso' });
        } else {
          console.log('Usuário não encontrado');
          res.status(404).json({ error: 'Usuário não encontrado' });
        }
      }
    });
  } else {
    res.status(400).json({ error: 'Os campos userId e newPassword são obrigatórios' });
  }
});

// Modificação para escutar em todos os IPs disponíveis
const server = app.listen(port, '0.0.0.0', () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log(`Servidor rodando em http://${host}:${port}`);
});
