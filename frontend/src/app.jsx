import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { auth } from './services/fireBaseConfig';
import Navbar from './components/navbar';

const App = () => {
  const location = useLocation();

  useEffect(() => {
    // ⚠️ Cuidado: Isso desloga o usuário toda vez que o app carrega
    // auth.signOut();
  }, []);

  // Verifica se a URL atual é /login
  const hideNavbar = location.pathname === '/login';

  return (
    <div>
      {!hideNavbar && <Navbar />}
      <Outlet />
    </div>
  );
};

export default App;