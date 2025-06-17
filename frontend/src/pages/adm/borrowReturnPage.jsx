import React, { useEffect, useState } from 'react';
import { listComponents, borrowComponent, returnComponent } from '../../services/api';

const BorrowReturnPage = () => {
  const [components, setComponents] = useState([]);
  const [matricula, setMatricula] = useState('');
  const [componentId, setComponentId] = useState('');

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
      setMatricula('');
      setComponentId('');
    } catch (error) {
      alert('Erro ao emprestar componente: ' + error.message);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.card}>
        <h2 style={styles.title}>Emprestar/Devolver Componentes</h2>
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
    </div>
  );
};

const styles = {
  pageContainer: {
    height: '90vh',
    background: 'white', 
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    background: 'linear-gradient(135deg, #e0f7fa, #ffffff)',
  },
  card: {
    backgroundColor: 'white',
    padding: '40px 50px',
    borderRadius: '12px',
    boxShadow: '0 15px 30px rgba(0, 0, 0, 0.2)',
    minWidth: '360px',
    maxWidth: '400px',
    textAlign: 'center',
  },
  title: {
    marginBottom: '30px',
    color: '#333',
    fontWeight: '700',
  },
  input: {
    width: '90%',
    padding: '12px 14px',
    marginBottom: '20px',
    borderRadius: '4px',
    border: '1.8px solid #ccc',
    fontSize: '16px',
    transition: 'border-color 0.3s ease',
    outline: 'none',
  },
  borrowButton: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#007bff',
    color: 'white',
    fontSize: '16px',
    fontWeight: '600',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};

// Efeito para os inputs ao focar e botão ao passar o mouse
styles.input[':focus'] = {
  borderColor: '#5a4de1',
};
styles.borrowButton[':hover'] = {
  backgroundColor: '#453cbc',
};

export default BorrowReturnPage;
