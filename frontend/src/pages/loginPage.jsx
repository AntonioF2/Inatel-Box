import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <div style={styles.page}>
      {/* NavBar */}
      <nav style={styles.navbar}>
        <div style={styles.navTitle}>Inatel Box</div>
      </nav>

      {/* Conteúdo do Login */}
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.subtitle}>Login</h2>

          <select
            style={styles.select}
            value={usuarioSelecionado ? usuarioSelecionado.matricula : ''}
            onChange={(e) => {
              const usuario = usuarios.find((u) => u.matricula === e.target.value);
              setUsuarioSelecionado(usuario);
              setMatricula(usuario.matricula);
              setError('');
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
              setError('');
            }}
          />

          {error && <div style={styles.errorMessage}>{error}</div>}

          <button onClick={handleLogin} style={styles.buttonPrimary}>
            Entrar
          </button>

          <button onClick={() => navigate('/register')} style={styles.buttonSecondary}>
            Novo Usuário
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    fontFamily: 'Nunito, sans-serif',
    height: '100vh',
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(135deg, #e0f7fa, #ffffff)',
  },
  navbar: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '12px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px',
    fontWeight: 'bold',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  navTitle: {
    color: '#fff',
  },
  container: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '40px 30px',
    borderRadius: '16px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
    transition: 'transform 0.3s ease',
  },
  subtitle: {
    fontSize: '24px',
    marginBottom: '30px',
    color: '#333',
  },
  select: {
    marginBottom: '15px',
    padding: '12px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    width: '100%',
    boxSizing: 'border-box',
  },
  input: {
    marginBottom: '15px',
    padding: '12px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    width: '100%',
    boxSizing: 'border-box',
  },
  buttonPrimary: {
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    width: '100%',
    marginBottom: '10px',
    transition: 'background-color 0.3s ease',
  },
  buttonSecondary: {
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#6c757d',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    width: '100%',
    transition: 'background-color 0.3s ease',
  },
  errorMessage: {
    color: 'red',
    fontSize: '14px',
    marginBottom: '15px',
    backgroundColor: '#ffe0e0',
    padding: '10px',
    borderRadius: '6px',
  },
};
export default LoginPage;