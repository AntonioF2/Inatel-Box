import React, { useEffect, useState } from 'react';
import { listComponents } from '../../services/api';

const SearchComponentsPage = () => {
  const [components, setComponents] = useState([]);
  const [tipo, setTipo] = useState('');
  const [especificacao, setEspecificacao] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchComponents = async (filters = {}) => {
    setLoading(true);
    try {
      const data = await listComponents(filters);
      setComponents(data);
    } catch (error) {
      console.error('Erro ao buscar componentes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComponents();
  }, []);

  const handleSearch = () => {
    fetchComponents({ tipo, especificacao });
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Procurar Componentes</h2>

        <div style={styles.searchContainer}>
          <select
            style={styles.input}
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          >
            <option value="">Selecione o tipo do componente</option>
            <option value="Resistor">Resistor</option>
            <option value="Capacitor">Capacitor</option>
            <option value="Indutor">Indutor</option>
            <option value="Diodo">Diodo</option>
            <option value="Transistor">Transistor</option>
            <option value="CI">CI</option>
            <option value="LED">LED</option>
            <option value="Sensor">Sensor</option>
            <option value="Conector">Conector</option>
          </select>

          <input
            type="text"
            placeholder="Especificação"
            value={especificacao}
            onChange={(e) => setEspecificacao(e.target.value)}
            style={styles.input}
          />

          <button onClick={handleSearch} style={styles.button} disabled={loading}>
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>

        {components.length > 0 ? (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Tipo</th>
                <th style={styles.th}>Especificação</th>
              </tr>
            </thead>
            <tbody>
              {components.map((component, index) => (
                <tr
                  key={component.id}
                  style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}
                >
                  <td style={styles.td}>{component.tipo}</td>
                  <td style={styles.td}>{component.especificacao}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={styles.noResult}>
            {loading ? 'Carregando...' : 'Nenhum componente encontrado.'}
          </p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '80vh',
    backgroundColor: '#f0f2f5',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '30px 10px',
    fontFamily: 'Arial, sans-serif',
    background: 'linear-gradient(135deg, #e0f7fa, #ffffff)',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '30px 25px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '1000px',
    boxSizing: 'border-box',
  },
  title: {
    fontSize: '24px',
    color: '#333',
    marginBottom: '25px',
    textAlign: 'center',
  },
  searchContainer: {
    display: 'flex',
    gap: '15px',
    marginBottom: '25px',
  },
  input: {
    flex: 1,
    padding: '10px 15px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  button: {
    padding: '10px 25px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '16px',
    transition: 'background-color 0.3s',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '12px 15px',
    textAlign: 'left',
  },
  td: {
    padding: '12px 15px',
    borderBottom: '1px solid #eaeaea',
  },
  rowEven: {
    backgroundColor: '#f9f9f9',
  },
  rowOdd: {
    backgroundColor: '#fff',
  },
  noResult: {
    textAlign: 'center',
    color: '#666',
    fontSize: '16px',
  },
};

export default SearchComponentsPage;
