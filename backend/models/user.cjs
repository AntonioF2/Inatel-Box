// backend/models/User.js
class User {
    constructor(matricula, senha, tipo, curso) {
      this.matricula = matricula;
      this.senha = senha; // Em um cenário real, a senha deve ser criptografada!
      this.tipo = tipo; // 'ADM' ou 'usuario'
      this.curso = curso;
    }
  }
  
  module.exports = User;