import React, { useEffect, useState } from 'react';
import { listComponents, deleteComponent } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../services/fireBaseConfig';

const ManageComponentsPage = () => {
  const navigate = useNavigate();
  const [components, setComponents] = useState([]);
  const [tipo, setTipo] = useState('');
  const [especificacao, setEspecificacao] = useState('');
  const [emprestadoPara, setempresta] = useState('');
  

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

  return (
    <div style={styles.pageContainer}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Gerenciar Componentes</h2>
          <div style={styles.buttonGroup}>
            <button onClick={() => navigate('/add-components')} style={styles.addButton}>
              Adicionar Componente
            </button>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Sair
            </button>
          </div>
        </div>

        <div style={styles.filters}>
          <select
            style={styles.input}
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          >
            <option value="">Tipo do componente</option>
            <option value="Resistor">Resistor</option>
            <option value="Capacitor">Capacitor</option>
            <option value="Indutor">Indutor</option>
            <option value="Diodo">Diodo</option>
            <option value="Transistor">Transistor</option>
            <option value="CI">Circuito Integrado (CI)</option>
            <option value="LED">LED</option>
            <option value="Potenciômetro">Potenciômetro</option>
            <option value="Conector">Conector</option>
            <option value="Sensor">Sensor</option>
            <option value="Relé">Relé</option>
            <option value="Fusível">Fusível</option>
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
                <th style={styles.th}>ID</th>
                <th style={styles.th}>EmprestadoPara</th>
                <th style={styles.th}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {components.map((component) => (
                <tr key={component.id} style={styles.tr}>
                  <td style={styles.td}>{component.tipo}</td>
                  <td style={styles.td}>{component.especificacao}</td>
                  <td style={styles.td}>{component.id}</td>
                  <td style={styles.td}>{component.emprestadoPara || "Não emprestado"}</td>
                  <td style={styles.td}>
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
          <p style={styles.noDataText}>Nenhum componente encontrado.</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: '20px',
    background: 'linear-gradient(135deg, #e0f7fa, #ffffff)',
  },
  card: {
    backgroundColor: 'white',
    padding: '40px 30px',
    borderRadius: '12px',
    boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '1250px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  title: {
    margin: 0,
    fontSize: '28px',
    color: '#333',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
  },
  addButton: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  logoutButton: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  filters: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  input: {
    padding: '10px 14px',
    border: '1.8px solid #ccc',
    borderRadius: '4px',
    fontSize: '15px',
    minWidth: '180px',
  },
  searchButton: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'center',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  th: {
    backgroundColor: '#f1f1f1',
    padding: '12px 10px',
    borderBottom: '2px solid #ddd',
    textAlign: 'center',
    fontSize: '16px',
  },
  td: {
    padding: '12px 10px',
    borderBottom: '1px solid #eee',
    textAlign: 'center',
    fontSize: '15px',
  },
  tr: {
    transition: 'background-color 0.2s ease',
  },
  borrowButton: {
    backgroundColor: '#17a2b8',
    color: '#fff',
    border: 'none',
    padding: '8px 14px',
    cursor: 'pointer',
    borderRadius: '4px',
    marginRight: '6px',
    fontSize: '14px',
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    color: '#fff',
    border: 'none',
    padding: '8px 14px',
    cursor: 'pointer',
    borderRadius: '4px',
    fontSize: '14px',
  },
  noDataText: {
    textAlign: 'center',
    color: '#888',
    marginTop: '15px',
  },
};

export default ManageComponentsPage;