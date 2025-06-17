// tests/cypress/e2e/register.cy.js
/// <reference types="cypress" />

describe('Página de Registro', () => {
    beforeEach(() => {
      cy.visit('/register');
    });
  
    it('deve carregar a página de registro corretamente', () => {
      cy.get('h2').should('contain', 'Cadastro');
      cy.get('select').should('be.visible');
      cy.get('input[type="text"]').should('be.visible');
      cy.get('input[type="password"]').should('be.visible');
      cy.contains('button', 'Cadastrar Usuário').should('be.visible');
    });
  
    it('deve exibir mensagem de erro quando campos não são preenchidos', () => {
      cy.contains('button', 'Cadastrar Usuário').click();
      
      // Verifica se o alerta foi exibido
      cy.on('window:alert', (str) => {
        expect(str).to.equal('Preencha todos os campos!');
      });
    });
  
    it('deve permitir selecionar um curso', () => {
      cy.get('select').select('GES');
      cy.get('select').should('have.value', 'GES');
    });
  
    it('deve permitir preencher matrícula e senha', () => {
      cy.get('input[type="text"]').type('54321').should('have.value', '54321');
      cy.get('input[type="password"]').type('novaSenha').should('have.value', 'novaSenha');
    });
  
    it('deve registrar um novo usuário e redirecionar para login', () => {
      cy.intercept('POST', 'http://localhost:5000/auth/register', {
        statusCode: 201,
        body: {
          message: 'Usuário cadastrado com sucesso'
        }
      }).as('registerRequest');
      
      cy.get('select').select('GES');
      cy.get('input[type="text"]').type('54321');
      cy.get('input[type="password"]').type('novaSenha');
      cy.contains('button', 'Cadastrar Usuário').click();
      
      cy.wait('@registerRequest');
      cy.url().should('include', '/login');
    });
  });