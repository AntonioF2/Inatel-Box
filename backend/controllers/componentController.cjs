const { db } = require('../services/fireBaseConfig.cjs');
const Component = require('../models/component.cjs');
const auth = require('../services/authService.cjs');

// Adicionar um novo componente (apenas ADM)
const addComponent = async (req, res) => {
  const { id, tipo, especificacao } = req.body;

  try {
    if (!id || typeof id !== 'string' || id.trim() === '') {
      console.log('❌ ID inválido:', id);
      return res.status(400).json({ error: 'ID inválido. O ID deve ser uma string não vazia!' });
    }

    if (!tipo || !especificacao ) {
      console.log('❌ Campos incompletos:', { tipo, especificacao });
      return res.status(400).json({ error: 'Preencha todos os campos, incluindo o ID!' });
    }

    if (req.user.tipo !== 'ADM') {
      console.log('❌ Usuário não é ADM:', req.user.tipo);
      return res.status(403).json({ error: 'Apenas administradores podem adicionar componentes' });
    }

    if (!/^[a-zA-Z0-9-_]+$/.test(id)) {
      console.log('❌ ID com caracteres inválidos:', id);
      return res.status(400).json({ error: 'O ID contém caracteres inválidos para o Firestore!' });
    }

    const componentRef = db.collection('componentes').doc(id.trim());
    console.log('📝 Gravando no Firestore:', { id, tipo, especificacao });

    await componentRef.set({ id, tipo, especificacao });

    console.log('✅ Componente salvo com sucesso!');
    res.json({ id, tipo, especificacao });
  } catch (error) {
    console.error('🔥 Erro ao adicionar componente:', error);
    res.status(500).json({ error: error.message });
  }
};

// Listar componentes disponíveis (todos os usuários)
const listComponents = async (req, res) => {
  try {
    let query = db.collection('componentes');

    const { tipo, especificacao, emprestadoPara } = req.query;

    if (tipo) {
      query = query.where('tipo', '==', tipo);
    }

    if (especificacao) {
      query = query.where('especificacao', '==', especificacao);
    }

    if (emprestadoPara) {
      query = query.where('emprestadoPara', '==', emprestadoPara);
    }

    const componentsSnapshot = await query.get();

    const components = [];

    componentsSnapshot.forEach((doc) => {
      const componentData = doc.data();
      const component = new Component(
        doc.id,
        componentData.tipo,
        componentData.especificacao,
        componentData.emprestadoPara
      );
      components.push(component);
    });

    res.json(components);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Emprestar componente (apenas ADM)
const borrowComponent = async (req, res) => {
  const { componentId, matricula } = req.body;

  try {
    const componentRef = db.collection('componentes').doc(componentId);
    await componentRef.update({ emprestadoPara: matricula });

    res.json({ message: 'Componente emprestado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Devolver componente (apenas ADM)
const returnComponent = async (req, res) => {
  const { componentId } = req.body;

  try {
    const componentRef = db.collection('componentes').doc(componentId);
    await componentRef.update({ emprestadoPara: null });

    res.json({ message: 'Componente devolvido com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Deletar componente (apenas ADM)
const deleteComponent = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id || typeof id !== 'string' || id.trim() === '') {
      console.log('❌ ID inválido para exclusão:', id);
      return res.status(400).json({ error: 'ID inválido. O ID deve ser uma string não vazia!' });
    }

    if (req.user.tipo !== 'ADM') {
      console.log('❌ Usuário não é ADM:', req.user.tipo);
      return res.status(403).json({ error: 'Apenas administradores podem deletar componentes' });
    }

    const componentRef = db.collection('componentes').doc(id.trim());
    const doc = await componentRef.get();

    if (!doc.exists) {
      console.log('❌ Componente não encontrado para exclusão:', id);
      return res.status(404).json({ error: 'Componente não encontrado' });
    }

    await componentRef.delete();

    console.log('✅ Componente deletado com sucesso:', id);
    res.json({ message: 'Componente deletado com sucesso' });
  } catch (error) {
    console.error('🔥 Erro ao deletar componente:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addComponent, listComponents, borrowComponent, returnComponent, deleteComponent  };
