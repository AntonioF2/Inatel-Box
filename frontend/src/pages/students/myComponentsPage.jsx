import React, { useEffect, useState } from 'react';
import { listComponents } from '../../services/api';
import { auth, db } from '../../services/fireBaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const MyComponentsPage = () => {
  const [myComponents, setMyComponents] = useState([]);
  const [matricula, setMatricula] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatriculaAndComponents = async () => {
      const user = auth.currentUser;
      if (!user) {
        console.log('Nenhum usuário logado');
        return;
      }

      try {
        const userDocRef = doc(db, 'usuarios', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const userMatricula = userData.matricula;
          setMatricula(userMatricula);
          console.log('Matrícula do usuário:', userMatricula);

          // Agora busca os componentes filtrando pela matrícula
          const data = await listComponents();
          const filteredComponents = data.filter(
            (component) => component.emprestadoPara === userMatricula
          );
          setMyComponents(filteredComponents);
        } else {
          console.log('Usuário não encontrado no banco');
        }
      } catch (error) {
        console.error('Erro ao buscar matrícula ou componentes:', error);
      }
    };

    fetchMatriculaAndComponents();
  }, []);

  const handleLogout = async () => {
      await auth.signOut();
      navigate('/login');
  };

  return (
  <div style={styles.container}>
    <div style={styles.header}>
      <h2>Bem Vindo, {matricula || 'Usuario'}</h2>
      {}
      <div style={styles.buttonGroup}>
        <button onClick={() => navigate('/search-components')} style={styles.button}>
          Procurar Componente
        </button>

        <button onClick={handleLogout} style={styles.logoutButton}>
          Sair
        </button>
      </div>
    </div>

    {!matricula && <p>Carregando informações do usuário...</p>}

    <ul>
      {myComponents.length > 0 ? (
        myComponents.map((component) => (
          <li key={component.id}>
            {component.nome} - Quantidade: {component.quantidade}
          </li>
        ))
      ) : (
        <p>Nenhum componente emprestado para sua matrícula.</p>
      )}
    </ul>
  </div>
)};

const styles = {
  container: { padding: '20px' },
  header: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '40%', 
    marginBottom: '20px' 
  },
   searchButton: {
    padding: '8px 16px',
    fontSize: '14px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px', // espaço entre os botões
    marginBottom: '20px', // espaço abaixo dos botões
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  welcomeTitle: {
    margin: 0,
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
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    alignItems: 'center',
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

export default MyComponentsPage;