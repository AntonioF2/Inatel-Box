const admin = require('firebase-admin');
const serviceAccount = require('../config/serviceAccountKey.json');

// Inicialização do Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
const auth = admin.auth();

const generateCustomToken = async (uid, tipo) => {
  try {
    // Incluindo as claims extras, se quiser
    const additionalClaims = {
      tipo: tipo
    };

    const token = await auth.createCustomToken(uid, additionalClaims);
    console.log('Token gerado para:', uid, 'com tipo:', tipo);
    return token;
  } catch (error) {
    console.error('Erro ao gerar token personalizado:', error);
    throw error;
  }
};

const verificarUsuario = async (matricula, senha) => {
  try {
    const userRef = db.collection('usuarios').doc(matricula);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return null;
    }

    const userData = userDoc.data();

    // Comparação segura de senha (considerando que está em texto plano por enquanto)
    if (userData.senha === senha) {
      return {
        uid: userData.matricula,
        tipo: userData.tipo,
        curso: userData.curso || ''
      };
    }
    return null;
  } catch (error) {
    console.error('Erro ao verificar usuário:', error);
    throw error;
  }
};

// Função adicional para obter dados completos do usuário
const obterDadosUsuario = async (matricula) => {
  try {
    const userDoc = await db.collection('usuarios').doc(matricula).get();
    if (!userDoc.exists) {
      return null;
    }
    return userDoc.data();
  } catch (error) {
    console.error('Erro ao obter dados do usuário:', error);
    throw error;
  }
};

module.exports = { 
  generateCustomToken, 
  verificarUsuario, 
  obterDadosUsuario,
  auth 
};