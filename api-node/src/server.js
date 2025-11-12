require('dotenv').config();
const express = require('express');
const cors = require('cors');

const livrosRoutes = require('./routes/livrosRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ mensagem: 'API da biblioteca online está ativa.' });
});

app.use('/livros', livrosRoutes);

// Middleware de tratamento de erros
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err);

  const status = err.status || 500;
  const mensagem = err.message || 'Erro interno no servidor.';

  res.status(status).json({ mensagem });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Servidor iniciado na porta ${PORT}`);
});

