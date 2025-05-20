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
  
    it('deve permitir selecionar o usuário com matrícula 1 e curso GES', () => {
      cy.get('select').select('1 - GES');
      cy.get('select').should('have.value', '1');
      // Verifica que não há mensagem de erro após seleção
      cy.get('[style*="color: red"]').should('not.exist');
    });
  
    it('deve fazer login com sucesso usando matrícula 1 e senha 111', () => {
      // Mock da resposta de login bem-sucedido
      cy.intercept('POST', 'http://localhost:5000/auth/login', {
        statusCode: 200,
        body: {
          matricula: '1',
          curso: 'GES'
        }
      }).as('loginRequest');
      
      cy.get('select').select('1 - GES');
      cy.get('input[type="password"]').type('111');
      cy.contains('button', 'Entrar').click();
      
      cy.wait('@loginRequest');
      cy.url({ timeout: 10000 }) // Aumenta para 10 segundos
    .should('include', '/home')
    .then((url) => {
      console.log('URL atual:', url);
    });
    });
  
    it('deve exibir mensagem de erro quando a senha está incorreta', () => {
      // Mock da resposta de login falho
      cy.intercept('POST', 'http://localhost:5000/auth/login', {
        statusCode: 401,
        body: {
          message: 'Credenciais inválidas'
        }
      }).as('loginRequest');
      
      cy.get('select').select('1 - GES');
      cy.get('input[type="password"]').type('senhaerrada');
      cy.contains('button', 'Entrar').click();
      
      cy.wait('@loginRequest');
      // Verifica a mensagem de erro na tela (não mais no alert)
      cy.get('[style*="color: red"]')
        .should('be.visible')
        .and('contain', 'Matrícula ou senha incorretas');
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