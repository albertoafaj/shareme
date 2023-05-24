const request = require('supertest');
const jwt = require('jwt-simple');
const path = require('path');
/* const { Readable } = require('stream'); */
const app = require('../src/app');
require('dotenv').config();

const MAIN_ROTE = '/v1/categories';
let token;
let user;
let userAdm;

const testTemplate = async (userTest, body, status, errorMessage, operation) => {
  token = `token=${jwt.encode({ id: userTest.id, email: userTest.email }, process.env.JWTSEC)}`;
  let result = {};
  switch (operation) {
    case 'POST-FORM':
      result = await request(app)
        .post(MAIN_ROTE)
        .set('Cookie', token)
        .field('name', body.name)
        .field('friendlyURL', body.friendlyURL)
        .field('photoTitles', body.photoTitles)
        .attach('files', `${path.resolve(__dirname, '..', 'tmp')}\\testFiles\\img-project-portfolio-360x280.jpg`);
      break;
    case 'POST-JSON':
      result = await request(app).post(MAIN_ROTE).set('Cookie', token).send(body);
      break;
    default:
      result = {};
      break;
  }
  expect(result.status).toBe(status);
  if (result.body.error) {
    expect(result.body.error).toBe(errorMessage);
  }
  return result;
};

describe('categories route', () => {
  beforeAll(async () => {
    await app.db.migrate.rollback();
    await app.db.migrate.latest();
    await app.db.seed.run();
    user = await app.services.user.findOne({ email: 'main_user@google.com' });
    userAdm = await app.services.user.findOne({ email: process.env.ADMIN_USER });
  });

  // POST categories;
  describe('when trying create a category', () => {
    const newCategory = {
      name: 'Animals',
      friendlyURL: 'animals',
    };
    test('the user must be a admin user (status 201)', async () => {
      const result = await testTemplate(userAdm, newCategory, 200, '', 'POST-JSON', 'FORM');
      expect(result.body).toHaveProperty('id');
      expect(result.body).toHaveProperty('name');
      expect(result.body).toHaveProperty('friendlyURL');
      expect(result.body).toHaveProperty('photoId');
    });
    test('should not allow it if the user is not admin (status 400)', async () => {
      await testTemplate(user, newCategory, 400, 'Usuário não tem autorização para execultar a funcionalidade.', 'POST-JSON');
    });
    test('the name field should be a string', async () => {
      await testTemplate(userAdm, { ...newCategory, name: 123 }, 400, 'O campo nome do(a) categoria deve ser um(a) string', 'POST-JSON');
    });
    test('the name field should be a string', async () => {
      await testTemplate(userAdm, { ...newCategory, friendlyURL: 123 }, 400, 'O campo url amigavel do(a) categoria deve ser um(a) string', 'POST-JSON');
    });
    test('the name field should be unique', async () => {
      await testTemplate(userAdm, { name: 'URL Amigavel', friendlyURL: 'test-url-amigavel' }, 400, 'A categoria URL Amigavel já existe.', 'POST-JSON');
    });
    test('the friendlyURL field should be unique', async () => {
      await testTemplate(userAdm, { name: 'Teste URL Amigavel', friendlyURL: 'url-amigavel' }, 400, 'A URL amigavel url-amigavel já existe.', 'POST-JSON');
    });
    describe('and save a photo', () => {
      const body = {
        name: 'Teste Foto',
        friendlyURL: 'teste-foto',
        photoTitles: 'Foto teste',
      };
      test('the photoId field should be a number', async () => {
        const result = await testTemplate(userAdm, body, 200, '', 'POST-FORM');
        expect(result.body.photoId).not.toBeNull();
      });
    });
  });
  // GET all categories;
  describe('when trying read categories', () => {
    test('should anthenticated the user (status 201)', () => { });
    test('should not allow unauthenticated user (status 401)', () => { });
  });
  // GET a category;
  describe('when trying read categories by id', () => {
    test('should anthenticated the user (status 201)', () => { });
    test('should not allow unauthenticated user (status 401)', () => { });
  });
  // PUT categories;
  describe('when trying update a category', () => {
    test('the user must be a admin user (status 201)', () => { });
    test('should not allow it if the user is not admin (status 401)', () => { });
    test('the name field should be a string', () => { });
    test('the name field should be a string', () => { });
    test('the friendlyURL field should not be null', () => { });
    test('the friendlyURL field should not be null', () => { });
    describe('and save a photo', () => {
      test('the photoId field should be a number', () => { });
      test('the photoId field should not be null', () => { });
    });
  });
  // DELETE categories;
  describe('when trying remove a category', () => {
    test('the user must be a admin user (status 201)', () => { });
    test('should not allow it if the user is not admin (status 401)', () => { });
    test('should remove the photo that belongs to it', () => { });
    test('should not remove when it is related to a pin', () => { });
  });
});
