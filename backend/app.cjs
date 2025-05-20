// backend/app.cjs
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes.cjs');
const componentRoutes = require('./routes/componentRoutes.cjs');

const app = express();

// Configura o CORS
app.use(cors({
  origin: 'http://localhost:3000', // Permite apenas requisições do frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos
  allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
}));

app.use(morgan('dev')); // Mostra logs das requisições no terminal
app.use(express.json());

// Rotas
app.use('/auth', authRoutes);
app.use('/components', componentRoutes);
app.use((req, res, next) => {
  console.log(`🔹 Rota acessada: ${req.method} ${req.url}`);
  next();
});

if (require.main === module) {
  const PORT = 5000;
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

module.exports = app;