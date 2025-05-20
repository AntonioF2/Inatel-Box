const { db } = require('../services/fireBaseConfig.cjs');
const { auth } = require('../services/authService.cjs');

const authenticate = async (req, res, next) => {
  console.log('Header Authorization:', req.headers.authorization);
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const token = header.replace('Bearer ', '');

  try {
    const decodedToken = await auth.verifyIdToken(token);
    console.log(decodedToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

const isAdmin = (req, res, next) => {
  console.log('🛡️ Checando se o usuário é ADM');
  const { tipo } = req.user || {};

  if (tipo !== 'ADM') {
    console.log('❌ Acesso negado: tipo do usuário:', tipo);
    return res.status(403).json({ error: 'Acesso negado. Apenas administradores.' });
  }

  console.log('✅ Usuário autorizado como ADM');
  next();
};

module.exports = { authenticate, isAdmin };