import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/fireBaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import SplashPage from './splashPage';

const HomePage = () => {
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // 🔄 Atualiza token para pegar claims mais recentes
          await user.getIdToken(true);
          const idTokenResult = await user.getIdTokenResult();
          const userType = idTokenResult.claims.tipo || 'ALUNO';

          // ✅ Redireciona conforme o tipo
          if (userType === 'ADM') {
            navigate('/manage-components', { replace: true });
          } else {
            navigate('/my-components', { replace: true });
          }
        } catch (error) {
          console.error('Erro ao obter claims:', error);
          navigate('/login', { replace: true });
        }
      } else {
        // 🔐 Se não estiver logado, manda pro login
        navigate('/login', { replace: true });
      }

      setCheckingAuth(false);
    });

    return unsubscribe;
  }, [navigate]);

  // Enquanto verifica a autenticação, exibe SplashPage
  return checkingAuth ? <SplashPage /> : null;
};

export default HomePage;