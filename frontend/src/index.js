// frontend/src/index.js
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './app';
import './services/fireBaseConfig';
import ErrorPage from './pages/errorPage';
import SplashPage from './pages/splashPage';
import LoginPage from './pages/loginPage';
import RegisterPage from './pages/registerPage';
import HomePage from './pages/homePage';
import MyComponentsPage from './pages/students/myComponentsPage';
import SearchComponentsPage from './pages/students/searchComponentsPage';
import AddComponentPage from './pages/adm/addComponentPage';
import ManageComponentsPage from './pages/adm/manageComponentsPage';
import BorrowReturnPage from './pages/adm/borrowReturnPage';

// Configuração das rotas
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // App será o layout principal
    errorElement: <ErrorPage />, // Página de erro
    children: [
      {
        path: '/',
        element: <HomePage />, // Rota padrão (login)
      },
      {
        path: '/login',
        element: <LoginPage />, // Rota da página inicial
      },
      {
        path: '/register',
        element: <RegisterPage />, // Rota de perfis
      },
      {
        path: '/home',
        element: <HomePage />, // Rota de perfis
      },
      {
        path: '/my-components',
        element: <MyComponentsPage />, // Rota de alunos
      },
      {
        path: '/search-components',
        element: <SearchComponentsPage />, // Rota de alunos
      },
      {
        path: '/add-components',
        element: <AddComponentPage />, // Rota de ADM
      },
      {
        path: '/manage-components',
        element: <ManageComponentsPage />, // Rota de ADM
      },
      {
        path: '/borrow-return',
        element: <BorrowReturnPage />, // Rota de ADM
      },
    ],
  },
]);

// Renderização do aplicativo
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);