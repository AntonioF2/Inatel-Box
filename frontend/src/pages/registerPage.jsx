import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/api'; // Importe a função de registro do serviço de API

const RegisterPage = () => {
  const [matricula, setMatricula] = useState('');
  const [senha, setSenha] = useState('');
  const [curso, setCurso] = useState(''); // Estado para armazenar o curso selecionado
  const [error, setError] = useState(''); // Estado para mensagens de erro

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      // Verifica se os dados foram preenchidos
      if (!matricula || !senha || !curso) {
        alert('Preencha todos os campos!');
        return;
      }

      // Faz a chamada ao backend para cadastrar o usuário
      const response = await register(matricula, senha, curso);

      console.log('Usuário cadastrado com sucesso:', response);
      navigate('/login'); // Redireciona para a tela de login
    } catch (error) {
      setError('Erro ao cadastrar usuário: ' + error.message);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Almoxarifado Inatel</h1>
      <h2 style={styles.title}>Cadastro</h2>
      <div style={styles.form}>
        <select
          style={styles.select}
          value={curso}
          onChange={(e) => setCurso(e.target.value)}
        >
          <option value="">Selecione um curso</option>
          <option value="GES">Engenharia de Software (GES)</option>
          <option value="GEC">Engenharia de Computação (GEC)</option>
          <option value="GET">Engenharia de Telecomunicações (GET)</option>
          <option value="GEA">Engenharia de Controle e Automação (GEA)</option>
          <option value="GEL">Engenharia Elétrica (GEL)</option>
          <option value="GEP">Engenharia de Produção (GEP)</option>
          <option value="GEB">Engenharia Biomédica (GEB)</option>
        </select>
        
        <input
          style={styles.input}
          type="text"
          placeholder="Matrícula"
          value={matricula}
          onChange={(e) => setMatricula(e.target.value)}
        />
        
        <input
          style={styles.input}
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        {error && <p style={styles.error}>{error}</p>}
        
        <button onClick={handleRegister} style={styles.button}>
          Cadastrar Usuário
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#f0f0f0',
    margin: 0,
    padding: 0,
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '400px',
    padding: '20px',
    backgroundColor: '#f0f0f0',
    boxSizing: 'border-box',
  },
  input: {
    marginBottom: '10px',
    padding: '12px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    width: '100%',
    boxSizing: 'border-box',
  },
  select: {
    marginBottom: '10px',
    padding: '12px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    width: '100%',
    backgroundColor: '#fff',
    boxSizing: 'border-box',
  },
  button: {
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    width: '100%',
    marginBottom: '10px',
    boxSizing: 'border-box',
  },
  error: {
    color: 'red',
    fontSize: '14px',
    marginBottom: '10px',
  },
};

export default RegisterPage;