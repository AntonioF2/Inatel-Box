import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { signInWithCustomToken } from 'firebase/auth';
import { auth } from '../services/fireBaseConfig';

const LoginPage = () => {
  const [matricula, setMatricula] = useState('');
  const [senha, setSenha] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const carregarUsuarios = async () => {
      try {
        const response = await fetch('http://localhost:5000/auth/usuarios');
        const data = await response.json();
        setUsuarios(data);
      } catch (err) {
        console.error('Erro ao carregar usuários:', err);
      }
    };

    carregarUsuarios();
  }, []);

  const handleLogin = async () => {
  try {
    setError('');

    if (!usuarioSelecionado) {
      alert('Selecione um usuário!');
      return;
    }

    const response = await fetch('http://localhost:5000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matricula: usuarioSelecionado.matricula, senha }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro no login');
    }

    const dados = await response.json();
    console.log('✅ Token recebido da API:', dados.token);

    if (!dados.token) {
      throw new Error('Token ausente na resposta da API');
    }

    await signInWithCustomToken(auth, dados.token)
      .then((userCredential) => {
        console.log('✅ Login Firebase bem-sucedido:', userCredential.user);
      })
      .catch((firebaseError) => {
        console.error('❌ Erro no signInWithCustomToken:', firebaseError.code, firebaseError.message);
        throw new Error('Erro ao autenticar com o Firebase');
      });

    const user = auth.currentUser;
    if (user) {
      const refreshedToken = await user.getIdToken(true);
      console.log('🔄 Token atualizado com claims:', refreshedToken);
    }

    navigate('/home');
  } catch (error) {
    console.error('❌ Erro no login final:', error);
    setError(error.message || 'Matrícula ou senha incorretas');
  }
};

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Almoxarifado Inatel</h1>
      <h2 style={styles.title}>Login</h2>
      <div style={styles.form}>
        <select
          style={styles.select}
          value={usuarioSelecionado ? usuarioSelecionado.matricula : ''}
          onChange={(e) => {
            const usuario = usuarios.find((u) => u.matricula === e.target.value);
            setUsuarioSelecionado(usuario);
            setMatricula(usuario.matricula);
            setError(''); // Limpa erro ao selecionar novo usuário
          }}
        >
          <option value="">Selecione um usuário</option>
          {usuarios.map((usuario) => (
            <option key={usuario.matricula} value={usuario.matricula}>
              {usuario.matricula} - {usuario.curso}
            </option>
          ))}
        </select>

        <input
          style={styles.input}
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => {
            setSenha(e.target.value);
            setError(''); // Limpa erro ao digitar nova senha
          }}
        />

        {/* Exibe a mensagem de erro se existir */}
        {error && (
          <div style={styles.errorMessage}>
            {error}
          </div>
        )}

        <div style={{ height: '10px' }}></div>
        
        <button onClick={handleLogin} style={styles.button}>
          Entrar
        </button>

        <div style={{ height: '40px' }}></div>

        <button onClick={() => navigate('/register')} style={styles.button}>
          Novo Usuário
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
  errorMessage: {
    color: 'red',
    fontSize: '14px',
    marginBottom: '10px',
    textAlign: 'center',
  },
};

export default LoginPage;