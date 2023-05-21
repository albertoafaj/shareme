const request = require('supertest');
const jwt = require('jwt-simple');
const app = require('../src/app');
require('dotenv').config();

const MAIN_ROTE = '/v1/users';
let user;
let token;

beforeAll(async () => {
  await app.db.migrate.rollback();
  await app.db.migrate.latest();
  await app.db.seed.run();
  user = {
    id: 10002,
    email: 'main_user@google.com',
    name: 'Main user',
    image: 'http://main_user@photo',
  };
  token = `token=${jwt.encode({ id: user.id, email: user.email }, process.env.JWTSEC)}`;
});

// ** GET USER **
test('Should to list all users', async () => {
  const result = await request(app)
    .get(MAIN_ROTE)
    .set('Cookie', token);
  expect(result.status).toBe(200);
  expect(result.body.length).toBeGreaterThan(0);
});

// ** SAVE USER **

const testTemplateInsert = async (newData, errorMessage, status) => {
  const result = await request(app)
    .post(MAIN_ROTE)
    .set('Cookie', token)
    .send({
      email: process.env.ADMIN_USER,
      name: user.name,
      image: user.image,
      ...newData,
    });
  expect(result.status).toBe(status);
  if (result.body.error) {
    expect(result.body.error).toBe(errorMessage);
  }
  return result;
};

describe('when try to insert a user', () => {
  test('Should insert a user with sucess', async () => {
    const result = await testTemplateInsert({
      email: `${Date.now()}@shareme.com`,
      name: 'Main user',
      image: 'http://main_user@photo',
    }, '', 201);
    expect(result.body).toHaveProperty('name');
    expect(result.body).toHaveProperty('email');
    expect(result.body).toHaveProperty('image');
    expect(result.body).toHaveProperty('dateCreate');
  });
  test('should insert a crypt password', async () => {
    const result = await testTemplateInsert({
      email: 'cripto@shareme.com',
      name: 'Cripto user',
      image: 'http://main_user@photo',
    }, '', 201);
    const userDB = await app.services.user.findOne(result.body);
    expect(userDB.passwd).not.toBeUndefined();
    expect(result.body.email).toBe('cripto@shareme.com');
  });
  test('should not insert user without email', async () => {
    const result = await request(app)
      .post(MAIN_ROTE)
      .set('Cookie', token)
      .send({
        name: 'Not email user',
        image: 'http://main_user@photo',
      });
    expect(result.status).toBe(400);
    expect(result.body.error).toBe('O campo email é um atributo obrigatório');
  });

  test('should not insert user with registered email', () => testTemplateInsert({ email: user.email }, 'Já existe um usuário com este email', 400));
  test('Should not insert email to incorrect type', () => testTemplateInsert({ email: 12314 }, 'O campo email deve ser um(a) string', 400));
  test('Should not insert name to incorrect type', () => testTemplateInsert({ name: 12314 }, 'O campo nome deve ser um(a) string', 400));
  test('Should not insert image to incorrect type', () => testTemplateInsert({ image: 12314 }, 'O campo url da imagem deve ser um(a) string', 400));
});

// ** UPDATE USER **

const testTemplateUpdate = async (newData, errorMessage) => {
  const result = await request(app)
    .put(`${MAIN_ROTE}/${user.id}`)
    .set('Cookie', token)
    .send({ ...newData });
  expect(result.status).toBe(400);
  expect(result.body.error).toBe(errorMessage);
};
test('Should update a users', async () => {
  const result = await request(app)
    .put(`${MAIN_ROTE}/${user.id}`)
    .set('Cookie', token)
    .send({
      name: 'User#0',
      image: 'http://imageUpdated',
    });
  expect(result.status).toBe(200);
  expect(result.body.name).toBe('User#0');
  expect(result.body.email).toBe(user.email);
  expect(result.body.image).toBe('http://imageUpdated');
});

describe('when try to update the fields to null', () => {
  test('Should not update the id', () => testTemplateUpdate({ id: null }, 'O campo id é um atributo obrigatório'));
  test('Should not update the name', () => testTemplateUpdate({ name: null }, 'O campo nome é um atributo obrigatório'));
  test('Should not update the email', () => testTemplateUpdate({ email: null }, 'O campo email é um atributo obrigatório'));
  test('Should not update the image', () => testTemplateUpdate({ image: null }, 'O campo url da imagem é um atributo obrigatório'));
  test('Should not update the dateCreate', () => testTemplateUpdate({ dateCreate: null }, 'O campo data de criação é um atributo obrigatório'));
});
describe('when trying to update unique fields', () => {
  test('Should not update the id', () => testTemplateUpdate({ id: `${user.id}updated` }, 'O campo id não pode ser alterado'));
  test('Should not update the email', () => testTemplateUpdate({ email: `${user.email}updated` }, 'O campo email não pode ser alterado'));
});

describe('when try to update the fields to incorrect type', () => {
  test('Should not update the name', () => testTemplateUpdate({ name: 123 }, 'O campo nome deve ser um(a) string'));
  test('Should not update the image', () => testTemplateUpdate({ image: 123 }, 'O campo url da imagem deve ser um(a) string'));
});

describe('when trying to update fields to values less than or greater than the preset', () => {
  const stringGenaretor = (length) => {
    const arr = [];
    for (let i = 0; i < length; i += 1) {
      arr.push('A');
    }
    return arr.reduce((acc, cur) => acc + cur);
  };
  test('Should not update the name', () => testTemplateUpdate({ name: stringGenaretor(256) }, 'O campo nome deve ter de 0 a 255 caracteres'));
  test('Should not update the image', () => testTemplateUpdate({ image: stringGenaretor(256) }, 'O campo url da imagem deve ter de 0 a 255 caracteres'));
});
