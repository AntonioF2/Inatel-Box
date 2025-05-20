import React, { useEffect, useState } from 'react';
import { listComponents, borrowComponent, returnComponent } from '../../services/api';

const BorrowReturnPage = () => {
  const [components, setComponents] = useState([]);
  const [matricula, setMatricula] = useState('');
  const [componentId, setComponentId] = useState(''); // Novo estado

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const data = await listComponents();
        setComponents(data);
      } catch (error) {
        console.error('Erro ao buscar componentes:', error);
      }
    };

    fetchComponents();
  }, []);

  const handleBorrow = async () => {
    if (!matricula || !componentId) {
      alert('Preencha a matrícula e o ID do componente.');
      return;
    }

    try {
      await borrowComponent(componentId, matricula);
      alert('Componente emprestado com sucesso!');
    } catch (error) {
      alert('Erro ao emprestar componente: ' + error.message);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Emprestar/Devolver Componentes</h2>
      <input
        type="text"
        placeholder="Matrícula do Aluno"
        value={matricula}
        onChange={(e) => setMatricula(e.target.value)}
        style={styles.input}
      />
      <input
        type="text"
        placeholder="ID do Componente"
        value={componentId}
        onChange={(e) => setComponentId(e.target.value)}
        style={styles.input}
      />
      <button onClick={handleBorrow} style={styles.borrowButton}>
        Emprestar
      </button>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
  },
  input: {
    marginBottom: '10px',
    marginRight: '10px',
    padding: '8px',
    width: '300px',
  },
  borrowButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    cursor: 'pointer',
  },
};

export default BorrowReturnPage;