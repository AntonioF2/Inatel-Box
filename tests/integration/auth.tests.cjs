const request = require('supertest');
const app = require('../../backend/app.cjs');
const { db } = require('../../backend/services/fireBaseConfig.cjs');

const user = {
  matricula: 'testUserAuth',
  senha: '1234',
  curso: 'GES',
  tipo: 'aluno',
};

afterAll(async () => {
  await db.collection('usuarios').doc(user.matricula).delete();
});

describe('Autenticação', () => {
  it('Remove usuário antes de registrar', async () => {
    await db.collection('usuarios').doc(user.matricula).delete(); // <-- garante que o usuário não existe
    const res = await request(app).post('/auth/register').send(user);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Usuário cadastrado com sucesso!');
  });

  it('Impede registro de matricula duplicado', async () => {
    const res = await request(app).post('/auth/register').send(user);
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Já existe um usuário/);
  });

  it('Faz login com sucesso', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ matricula: user.matricula, senha: user.senha });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('Rejeita login de usuário inexistente', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ matricula: 'usuarioInexistente', senha: 'qualquer' });

    expect(res.status).toBe(401); // <-- código de erro do seu backend ao errar senha/matrícula
  });
});