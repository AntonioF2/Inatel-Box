// tests/integration/componentController.test.cjs
const request = require('supertest');
const app = require('../../backend/app.cjs');
const { db } = require('../../backend/services/fireBaseConfig.cjs');
const { generateCustomToken } = require('../../backend/services/authService.cjs');

let admToken;

beforeAll(async () => {
  await db.collection('usuarios').doc('ADMTESTE').set({
    matricula: 'ADMTESTE',
    senha: 'ADMTESTE',
    curso: '',
    tipo: 'ADM'
  });

  admToken = await generateCustomToken('ADMTESTE', 'ADMTESTE');
});

afterAll(async () => {
  await db.collection('usuarios').doc('ADMTESTE').delete();
  await db.collection('componentes').doc('teste').delete();
});

describe('Componentes', () => {
  it('Adiciona um componente', async () => {
    const res = await request(app)
      .post('/components/add')
      .set('Authorization', `Bearer ${admToken}`)
      .send({
        tipo: 'resistor',
        especificacao: '10k',
        quantidade: 1
      });
    console.log(res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe('teste');
    });
  });