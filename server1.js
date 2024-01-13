const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

const connection = mysql.createConnection({
  host: 'monorail.proxy.rlwy.net', // Isso pode não ser apropriado para o host do banco de dados em nuvem
  user: 'root',
  password: 'DaAHccCfDC-BhaF3BEg363aBHe1h4dg-',
  database: 'ecomerce',
  port: 17931,
  connectTimeout: 60000,
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

app.get('/games', (req, res) => {
  const query = 'SELECT * FROM jogos';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao executar a query de jogos:', err);
      res.status(500).json({ error: 'Erro interno do servidor' });
    } else {
      res.json(results);
    }
  });
});

app.get('/consoles', (req, res) => {
  const query = 'SELECT * FROM console';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao executar a query de consoles:', err);
      res.status(500).json({ error: 'Erro interno do servidor' });
    } else {
      res.json(results);
    }
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${port}`);
});
