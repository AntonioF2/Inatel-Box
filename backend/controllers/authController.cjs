// backend/controllers/authController.js
const { db } = require('../services/fireBaseConfig.cjs');
const { generateCustomToken, verificarUsuario, obterDadosUsuario } = require('../services/authService.cjs');

const login = async (req, res) => {
  const { matricula, senha } = req.body;

  try {
    // 1. Verifica as credenciais
    const usuarioVerificado = await verificarUsuario(matricula, senha);
    
    if (!usuarioVerificado) {
      return res.status(401).json({ error: 'Matrícula ou senha incorretas' });
    }

    // 2. Gera o token JWT
    const customToken = await generateCustomToken(usuarioVerificado.uid, usuarioVerificado.tipo);

    // 3. Obtém dados completos do usuário (sem a senha)
    const userData = await obterDadosUsuario(matricula);
    if (!userData) {
      return res.status(404).json({ error: 'Dados do usuário não encontrados' });
    }

    // Remove a senha antes de enviar a resposta
    const { senha: _, ...dadosSeguros } = userData;

    // 4. Retorna resposta completa
    res.json({
      token: customToken,
      usuario: {
        matricula: dadosSeguros.matricula,
        tipo: dadosSeguros.tipo,
        curso: dadosSeguros.curso || ''
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ 
      error: 'Erro interno no servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const register = async (req, res) => {
  const { matricula, senha, curso } = req.body;

  try {
    if (!matricula || !senha || !curso) {
      return res.status(400).json({ error: 'Preencha todos os campos!' });
    }

    // Verifica se já existe um usuário com mesma matrícula e curso
    const snapshot = await db.collection('usuarios')
      .where('matricula', '==', matricula)
      .where('curso', '==', curso)
      .get();

    if (!snapshot.empty) {
      return res.status(400).json({ error: 'Já existe um usuário com essa matrícula e curso.' });
    }

    // Agora salva normalmente com o ID da matrícula (ou você pode usar .add())
    const userRef = db.collection('usuarios').doc(matricula);
    await userRef.set({
      matricula,
      senha,
      curso,
      tipo: 'aluno',
    });

    res.json({ message: 'Usuário cadastrado com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const listUsers = async (req, res) => {
  try {
    const usersSnapshot = await db.collection('usuarios').get();
    const users = [];

    usersSnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { login, register, listUsers };