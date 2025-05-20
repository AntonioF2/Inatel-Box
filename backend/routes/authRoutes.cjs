// backend/routes/authRoutes.js
const express = require('express');
const { login, register, listUsers } = require('../controllers/authController.cjs');

const router = express.Router();

router.post('/login', login); // Rota para login
router.post('/register', register); // Rota para registro
router.get('/usuarios', listUsers); // Rota para listar

module.exports = router;