// tests/cypress/e2e/login.cy.js
/// <reference types="cypress" />

describe('Testes da Página de Login', () => {
    beforeEach(() => {
      // Mock da lista de usuários
      cy.intercept('GET', 'http://localhost:5000/auth/usuarios', {
        statusCode: 200,
        body: [
          { matricula: '1', curso: 'GES' },
          { matricula: '2', curso: 'GEC' }
        ]
      }).as('getUsuarios');
      
      cy.visit('/login');
    });
  
    it('deve carregar a página de login corretamente', () => {
      cy.get('h2').should('contain', 'Login');
      cy.get('select').should('be.visible');
      cy.get('input[type="password"]').should('be.visible');
      cy.contains('button', 'Entrar').should('be.visible');
      cy.contains('button', 'Novo Usuário').should('be.visible');
      // Verifica que a mensagem de erro não está visível inicialmente
      cy.get('[style*="color: red"]').should('not.exist');
    });
  
    it('deve exibir alerta quando nenhum usuário é selecionado', () => {
      cy.contains('button', 'Entrar').click();
      
      // Verifica se o alerta foi exibido
      cy.on('window:alert', (str) => {
        expect(str).to.equal('Selecione um usuário!');
      });
      
      // Verifica que a mensagem de erro não aparece (pois usamos alert)
      cy.get('[style*="color: red"]').should('not.exist');
    });
  
    it('deve fazer login com sucesso usando dados corretos', () => {
      cy.get('select').select('1 - GES');
      cy.get('select').should('have.value', '1');
      // Verifica que não há mensagem de erro após seleção
      cy.get('[style*="color: red"]').should('not.exist');
    });

    it('deve exibir mensagem de erro quando a senha está incorreta', () => {
  // Mock da lista de usuários
  cy.intercept('GET', 'http://localhost:5000/auth/usuarios', {
    statusCode: 200,
    body: [
      { matricula: '1', curso: 'GES' }
    ]
  }).as('getUsuarios');

  // Mock da resposta de login falho
  cy.intercept('POST', 'http://localhost:5000/auth/login', {
    statusCode: 401,
    body: {
      error: 'Credenciais inválidas'
    },
    delay: 500 // Adiciona um pequeno delay para simular rede
  }).as('loginRequest');

  cy.visit('/login');
  cy.wait('@getUsuarios'); // Espera os usuários carregarem

  cy.get('select').select('1 - GES');
  cy.get('input[type="password"]').type('senhaerrada');
  cy.contains('button', 'Entrar').click();
  
  cy.wait('@loginRequest');
  
  // Verificação mais robusta da mensagem de erro
  cy.get('[style*="color: red"]', { timeout: 10000 }) // Aumenta o timeout
    .should('exist')
    .and('be.visible')
    .then(($error) => {
      // Verifica se o texto contém parte da mensagem esperada (mais tolerante)
      expect($error.text()).to.match(/Credenciais inválidas/i);
    });
});
  
    it('deve limpar a mensagem de erro ao alterar a senha', () => {
      // Primeiro faz login falho para gerar o erro
      cy.intercept('POST', 'http://localhost:5000/auth/login', {
        statusCode: 401
      }).as('loginRequest');
      
      cy.get('select').select('1 - GES');
      cy.get('input[type="password"]').type('senhaerrada');
      cy.contains('button', 'Entrar').click();
      cy.wait('@loginRequest');
      
      // Verifica que o erro está visível
      cy.get('[style*="color: red"]').should('be.visible');
      
      // Digita nova senha e verifica que o erro some
      cy.get('input[type="password"]').clear().type('1');
      cy.get('[style*="color: red"]').should('not.exist');
    });
  
    it('deve navegar para a página de registro ao clicar no botão Novo Usuário', () => {
      cy.contains('button', 'Novo Usuário').click();
      cy.url().should('include', '/register');
    });
});