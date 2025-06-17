// ✅ Mocks devem vir antes de tudo
jest.mock('../../backend/services/authService.cjs', () => {
  const original = jest.requireActual('../../backend/services/authService.cjs');

  return {
    ...original,
    auth: {
      verifyIdToken: jest.fn().mockResolvedValue({
        uid: 'ADMTESTE',
        tipo: 'ADM'
      }),
    },
    generateCustomToken: async (uid, tipo) => `fake-token-for-${uid}`,
  };
});

const request = require('supertest');
const app = require('../../backend/app.cjs');
const { db } = require('../../backend/services/fireBaseConfig.cjs');

let admToken = '';

beforeAll(async () => {
  await db.collection('usuarios').doc('ADMTESTE').set({
    matricula: 'ADMTESTE',
    senha: 'ADMTESTE',
    tipo: 'ADM',
  });

  admToken = 'fake-token-for-ADMTESTE'; // não importa o valor, o middleware está mockado
});

afterAll(async () => {
  await db.collection('usuarios').doc('ADMTESTE').delete();
  await db.collection('componentes').doc('testeResistor').delete();
});

describe('Componentes', () => {
  it('ADM adiciona componente', async () => {
    const res = await request(app)
      .post('/components/add')
      .set('Authorization', `Bearer ${admToken}`)
      .send({
        tipo: 'resistor',
        especificacao: 'teste',
        id: 'teste',
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
  });

  it('ADM tenta adicionar componente incompleto', async () => {
    const res = await request(app)
      .post('/components/add')
      .set('Authorization', `Bearer ${admToken}`)
      .send({
        especificacao: 'teste',
        id: 'teste',
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('Listar componentes', async () => {
    const res = await request(app).get('/components/list');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('ADM deleta componente existente', async () => {
    // Criar componente temporário para deletar
    const createRes = await request(app)
      .post('/components/add')
      .set('Authorization', `Bearer ${admToken}`)
      .send({
        tipo: 'capacitor',
        especificacao: 'temporário',
        id: 'testeDelete',
      });

    expect(createRes.status).toBe(200);
    const res = await request(app)
      .delete('/components/delete/testeDelete')
      .set('Authorization', `Bearer ${admToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toMatch(/deletado com sucesso/i);
  });

  it('ADM tenta deletar componente inexistente', async () => {
    const res = await request(app)
      .delete('/components/delete/naoExiste123')
      .set('Authorization', `Bearer ${admToken}`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toMatch(/não encontrado/i);
  });
});