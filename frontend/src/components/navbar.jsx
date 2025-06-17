// src/components/Navbar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const Navbar = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // volta para a página anterior
  };

  return (
    <nav style={styles.nav}>
      <button onClick={handleBack} style={styles.backButton}>
        <FiArrowLeft size={20} style={{ marginRight: 5 }} />
      </button>
      <h1 style={styles.title}>Inatel Box</h1>
      <div style={{ width: 75 }} /> {}
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
  },
  backButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: '20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    margin: 0,
    fontSize: '22px',
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '12px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    
  },
};

export default Navbar;