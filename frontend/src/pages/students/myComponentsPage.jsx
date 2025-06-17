import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../services/fireBaseConfig';
import { useNavigate } from 'react-router-dom';

const MyComponentsPage = () => {
  const [myComponents, setMyComponents] = useState([]);
  const [matricula, setMatricula] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndComponents = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.error('Usuário não autenticado');
          navigate('/login');
          return;
        }

        const userDocRef = doc(db, 'usuarios', user.uid);
        const userSnapshot = await getDoc(userDocRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          const userMatricula = userData?.matricula;
          setMatricula(userMatricula);

          const componentsRef = collection(db, 'componentes');
          const q = query(componentsRef, where('emprestadoPara', '==', userMatricula));
          const querySnapshot = await getDocs(q);

          const components = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));

          setMyComponents(components);
        } else {
          console.error('Usuário não encontrado no Firestore');
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndComponents();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const handleGoToSearch = () => {
    navigate('/search-components');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Bem-vindo, {matricula || 'Usuário'}</h1>

        <div style={styles.buttonGroup}>
          <button onClick={handleGoToSearch} style={styles.primaryButton}>
            Procurar Componente
          </button>
          <button onClick={handleLogout} style={styles.secondaryButton}>
            Sair
          </button>
        </div>

        {loading ? (
          <p style={styles.noResult}>Carregando seus componentes...</p>
        ) : myComponents.length === 0 ? (
          <p style={styles.noResult}>Nenhum componente emprestado.</p>
        ) : (
          <>
            <h2 style={styles.title}>Meus Componentes Emprestados</h2>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Tipo</th>
                  <th style={styles.th}>Especificação</th>
                </tr>
              </thead>
              <tbody>
                {myComponents.map((component, index) => (
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
          </>
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
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    marginBottom: '25px',
  },
  primaryButton: {
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
  secondaryButton: {
    padding: '10px 25px',
    backgroundColor: '#e74c3c',
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
    marginTop: '15px',
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

export default MyComponentsPage;