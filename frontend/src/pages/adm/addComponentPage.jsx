import React, { useState } from 'react';
import { addComponent } from '../../services/api';
import { v4 as uuidv4 } from 'uuid';
import { getAuth } from "firebase/auth";

const AddComponentPage = () => {
  const [tipo, setTipo] = useState('');
  const [especificacao, setEspecificacao] = useState('');
  const [quantidade, setQuantidade] = useState('');

  const handleAddComponent = async () => {
    try {
      if (!tipo || !especificacao || !quantidade) {
        alert('Preencha todos os campos!');
        return;
      }

      const id = uuidv4();
      console.log("ID gerado no frontend:", id);

      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        alert('Usuário não autenticado');
        return;
      }

      const token = await user.getIdToken();
      console.log('Token do usuário:', token);

      const response = await addComponent(id, tipo, especificacao, quantidade, token);
      alert(`Componente adicionado com sucesso! ID: ${response.id}`);

      // Limpar campos após sucesso
      setTipo('');
      setEspecificacao('');
      setQuantidade('');
    } catch (error) {
      alert('Erro ao adicionar componente: ' + error.message);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.card}>
        <h2 style={styles.title}>Adicionar Componente</h2>

        <select
          style={styles.input1}
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        >
          <option value="">Selecione o tipo do componente</option>
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
          style={styles.input}
          type="text"
          placeholder="Especificação"
          value={especificacao}
          onChange={(e) => setEspecificacao(e.target.value)}
        />

        <input
          style={styles.input}
          type="number"
          placeholder="Quantidade"
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
          min="1"
          onKeyDown={(e) => {
            if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
          }}
        />

        <button onClick={handleAddComponent} style={styles.borrowButton}>
          Adicionar
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
  input1: {
    width: '98%',
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

// Efeitos de hover/focus (não aplicáveis diretamente com inline styles, mas pode-se usar CSS ou styled-components se quiser)
styles.input[':focus'] = {
  borderColor: '#5a4de1',
};
styles.borrowButton[':hover'] = {
  backgroundColor: '#453cbc',
};

export default AddComponentPage;
