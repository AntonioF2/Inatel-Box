import React, { useEffect, useState } from 'react';
import { listComponents, deleteComponent } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../services/fireBaseConfig';

const ManageComponentsPage = () => {
  const navigate = useNavigate();
  const [components, setComponents] = useState([]);
  const [tipo, setTipo] = useState('');
  const [especificacao, setEspecificacao] = useState('');

  const fetchComponents = async (filters = {}) => {
    try {
      const data = await listComponents(filters);
      setComponents(data);
    } catch (error) {
      console.error('Erro ao buscar componentes:', error);
    }
  };

  useEffect(() => {
    fetchComponents();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/login');
  };

  const handleSearch = async () => {
    fetchComponents({ tipo, especificacao });
  };

  const handleDelete = async (componentId) => {
    try {
      await deleteComponent(componentId);
      setComponents(components.filter((component) => component.id !== componentId));
      alert('Componente removido com sucesso!');
    } catch (error) {
      alert('Erro ao remover componente: ' + error.message);
    }
  };

  const handleBorrow = async (componentId) => {
    try {
      await deleteComponent(componentId);
      setComponents(components.filter((component) => component.id !== componentId));
      alert('Componente removido com sucesso!');
    } catch (error) {
      alert('Erro ao remover componente: ' + error.message);
    }
  };

  return (
    <div style={styles.container}>

      <div style={styles.headerContainer}>
        <h2 style={styles.welcomeTitle}>Bem Vindo, ADM</h2>
        {}
      <div style={styles.buttonGroup}>
        <button onClick={() => navigate('/add-components')} style={styles.button}>
          Adicionar Componente
        </button>

        <button onClick={handleLogout} style={styles.logoutButton}>
          Sair
        </button>
      </div>
    </div>  

      <h2>Componentes</h2>

      <div style={styles.searchContainer}>
        <select
          style={styles.select}
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        >
          <option value="">Selecione o tipo do componente</option>
          <option value="Resistor">Resistor</option>
          <option value="Capacitor">Capacitor</option>
        </select>

        <input
          type="text"
          placeholder="Especificação"
          value={especificacao}
          onChange={(e) => setEspecificacao(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleSearch} style={styles.searchButton}>
          Buscar
        </button>
      </div>

      {components.length > 0 ? (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Tipo</th>
              <th style={styles.th}>Especificação</th>
              <th style={styles.th}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {components.map((component) => (
              <tr key={component.id}>
                <td>{component.tipo}</td>
                <td>{component.especificacao}</td>
                <td>
                  <button
                    onClick={() => navigate('/borrow-return')}
                    style={styles.borrowButton}
                  >
                    Emprestar
                  </button>
                  <button
                    onClick={() => handleDelete(component.id)}
                    style={styles.deleteButton}
                  >
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Nenhum componente encontrado.</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
  },
  headerContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '40%',  // espaço entre botão e título
    marginBottom: '20px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px', // espaço entre os botões
    marginBottom: '20px', // espaço abaixo dos botões
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  logoutButton: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#dc3545', // vermelho para logout
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  welcomeTitle: {
    margin: 0,
  },
  searchContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    alignItems: 'center',
  },
  select: {
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  input: {
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    flex: 1,
  },
  searchButton: {
    padding: '8px 16px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    alignItems: 'center',
  },
  borrowButton: {
    backgroundColor: '#229a00',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer',
    borderRadius: '4px',
    marginRight: '20px',
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer',
    borderRadius: '4px',
  },
  th: {
    borderBottom: '2px solid #ccc',
    padding: '15px 10px',
    textAlign: 'left',
  },
  td: {
    padding: '15px 10px',
    borderBottom: '1px solid #eee',
  },
};

export default ManageComponentsPage;