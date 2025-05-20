// backend/models/Component.js
class Component {
    constructor(id, tipo, especificacao, quantidade, emprestadoPara) {
      this.id = id;
      this.tipo = tipo;
      this.especificacao = especificacao;
      this.emprestadoPara = emprestadoPara; // Matrícula do aluno que pegou emprestado
    }
  }
  
  module.exports = Component;