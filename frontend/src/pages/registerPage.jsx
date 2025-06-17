import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/api';

const RegisterPage = () => {
  const [matricula, setMatricula] = useState('');
  const [senha, setSenha] = useState('');
  const [curso, setCurso] = useState('');
  const [error, setError] = useState('');
  const [isHovering, setIsHovering] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!matricula || !senha || !curso) {
      alert('Preencha todos os campos!');
      return;
    }

    try {
      const response = await register(matricula, senha, curso);
      console.log('Usuário cadastrado:', response);
      navigate('/login');
    } catch (err) {
      setError('Erro ao cadastrar usuário: ' + err.message);
    }
  };

  const buttonStyle = {
    padding: '12px',
    fontSize: '16px',
    backgroundColor: isHovering ? '#0056b3' : '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    width: '100%',
    marginTop: '10px',
    transition: 'background-color 0.3s ease',
  };

  return (
    <div style={styles.container}>
      

      <div style={styles.card}>
        <h2 style={styles.subtitle}>Cadastro</h2>

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

        <button
          style={buttonStyle}
          onClick={handleRegister}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          Cadastrar Usuário
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "'Nunito', sans-serif",
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #e0f7fa, #ffffff)',
    padding: '20px',
    boxSizing: 'border-box',
  },
  title: {
    justifyContent: 'center',
    fontSize: '28px',
    marginBottom: '20px',
    textAlign: 'center',
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
  },
  subtitle: {
    fontSize: '25px',
    marginBottom: '30px',
    color: '#333',
    textAlign: 'center',
  },
  select: {
    padding: '12px',
    marginBottom: '15px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    backgroundColor: '#fff',
    boxSizing: 'border-box',
  },
  input: {
    padding: '12px',
    marginBottom: '15px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
  },
  error: {
    color: '#b00020',
    backgroundColor: '#f9d6d5',
    padding: '8px',
    borderRadius: '6px',
    marginBottom: '10px',
    textAlign: 'center',
  },
};

export default RegisterPage;
