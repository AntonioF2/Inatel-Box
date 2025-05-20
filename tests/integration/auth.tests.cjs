const request = require('supertest');
const app = require('../../backend/app.cjs');
const { db } = require('../../backend/services/fireBaseConfig.cjs');

let testUser = {
  matricula: `teste`,
  senha: 'teste',
  curso: 'GES',
  tipo: 'aluno'
};

afterAll(async () => {
  await db.collection('usuarios').doc(testUser.matricula).delete();
});

describe('Usuarios', () => {

  it('Registrar novo usuario', async () => {
    jest.setTimeout(15000); //espera 15 segundos
    const response = await request(app)
      .post('/auth/register')
      .send(testUser);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      message: 'Usuário cadastrado com sucesso!',
    });
  });

  it('Rejeita matricula do mesmo curso duplicada', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        matricula: testUser.matricula,
        senha: 'qlq',
        curso: testUser.curso,
        tipo: 'aluno'
      });
    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/Já existe um usuário com essa matrícula e curso/);
  });

  it('Registra matricula igual de cursos diferentes', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        matricula: testUser.matricula,
        senha: 'qlq',
        curso: 'GEC',
        tipo: 'aluno'
      });
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({message: 'Usuário cadastrado com sucesso!'});
  });

  it('Loga usuario ja registrado', async () => {
    const registerResponse = await request(app)
      .post('/auth/register')
      .send(testUser);
  
    expect(registerResponse.status).toBe(200);
  
    const response = await request(app)
      .post('/auth/login')
      .send({
        matricula: testUser.matricula,
        senha: testUser.senha
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.matricula).toBe(testUser.matricula);
  });
  
  it('Rejeita Login de usuario nao registrado', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        matricula: 'nao_registrado',
        senha: '0'
      });
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Usuário não encontrado');
  });
});