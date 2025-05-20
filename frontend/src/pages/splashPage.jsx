import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SplashPage = () => {
  const navigate = useNavigate();

  // Redireciona para a tela de login após 1 segundo
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login'); // Redireciona para a tela de login
    }, 1000); // 1000ms = 1 segundo

    return () => clearTimeout(timer); // Limpa o timer ao desmontar o componente
  }, [navigate]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Almoxarifado Inatel</h1>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#084c9c', // Fundo azul
    color: '#fff', // Texto branco
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
  },
};

export default SplashPage;