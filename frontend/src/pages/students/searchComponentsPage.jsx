import React, { useEffect, useState } from 'react';
import { listComponents } from '../../services/api';

const SearchComponentsPage = () => {
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

  const handleSearch = () => {
    fetchComponents({ tipo, especificacao });
  };

  return (
    <div style={styles.container}>
      <h2>Procurar Componentes</h2>

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
            </tr>
          </thead>
          <tbody>
            {components.map((component) => (
              <tr key={component.id}>
                <td style={styles.td}>{component.tipo}</td>
                <td style={styles.td}>{component.especificacao}</td>
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

export default SearchComponentsPage;