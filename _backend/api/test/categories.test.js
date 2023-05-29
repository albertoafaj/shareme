const request = require('supertest');
const jwt = require('jwt-simple');
const path = require('path');
const app = require('../src/app');
require('dotenv').config();

const MAIN_ROTE = '/v1/categories';
let token;
let user;
let userAdm;

const testTemplate = async (userTest, body, status, errorMessage, operation, categoryId) => {
  token = `token=${jwt.encode({ id: userTest.id, email: userTest.email }, process.env.JWTSEC)}`;
  let result = {};
  switch (operation) {
    case 'POST-FORM':
      // Perform a POST request with form data
      result = await request(app)
        .post(MAIN_ROTE)
        .set('Cookie', token)
        .field('name', body.name)
        .field('friendlyURL', body.friendlyURL)
        .field('photoTitles', body.photoTitles)
        .attach('files', `${path.resolve(__dirname, '..', 'tmp')}\\testFiles\\img-project-portfolio-360x280.jpg`);
      break;
    case 'POST-JSON':
      // Perform a POST request with JSON data
      result = await request(app).post(MAIN_ROTE).set('Cookie', token).send(body);
      break;
    case 'GET-ALL':
      // Perform a GET request to retrieve all categories
      result = await request(app).get(MAIN_ROTE).set('Cookie', token);
      break;
    case 'GET-ONE':
      // Perform a GET request to retrieve a specific category by ID
      result = await request(app).get(`${MAIN_ROTE}/${categoryId}`).set('Cookie', token);
      break;
    case 'UPDATE':
      // Perform an UPDATE request to update a category
      result = (await request(app).put(`${MAIN_ROTE}/${categoryId}`).set('Cookie', token).send(body));
      break;
    case 'UPDATE-FORM':
      // Perform an UPDATE request with form data to update a category
      result = await request(app)
        .put(`${MAIN_ROTE}/${categoryId}`)
        .set('Cookie', token)
        .field('photoTitles', body.photoTitles)
        .field('name', body.name)
        .attach('files', `${path.resolve(__dirname, '..', 'tmp')}\\testFiles\\img-project-portfolio-360x280.jpg`);
      break;
    case 'REMOVE':
      // Perform a DELETE request to remove a category
      result = await request(app)
        .delete(`${MAIN_ROTE}/${categoryId}`)
        .set('Cookie', token);
      break;
    default:
      result = {};
      break;
  }

  // Verify the expected status code
  expect(result.status).toBe(status);

  // Verify the error message, if any
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
      await testTemplate(user, newCategory, 400, 'Usuário não tem autorização para execultar a funcionalidade.', 'POST-JSON', '');
    });
    test('the name field should be a string', async () => {
      await testTemplate(userAdm, { ...newCategory, name: 123 }, 400, 'O campo nome do(a) categoria deve ser um(a) string', 'POST-JSON', '');
    });
    test('the name field should be a string', async () => {
      await testTemplate(userAdm, { ...newCategory, friendlyURL: 123 }, 400, 'O campo url amigavel do(a) categoria deve ser um(a) string', 'POST-JSON', '');
    });
    test('the name field should be unique', async () => {
      await testTemplate(userAdm, { name: 'URL Amigavel', friendlyURL: 'test-url-amigavel' }, 400, 'A categoria URL Amigavel já existe.', 'POST-JSON', '');
    });
    test('the friendlyURL field should be unique', async () => {
      await testTemplate(userAdm, { name: 'Teste URL Amigavel', friendlyURL: 'url-amigavel' }, 400, 'A URL amigavel url-amigavel já existe.', 'POST-JSON', '');
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
    test('should return all categories (status 200)', async () => {
      const result = await testTemplate(userAdm, {}, 200, '', 'GET-ALL');
      expect(result.body.length).toBeGreaterThan(1);
      expect(result.body[0]).toHaveProperty('id');
      expect(result.body[0]).toHaveProperty('name');
      expect(result.body[0]).toHaveProperty('friendlyURL');
      expect(result.body[0]).toHaveProperty('photoId');
    });
  });
  // GET a category;
  describe('when trying read categories by id', () => {
    test('should return a categories', async () => {
      const result = await testTemplate(user, {}, 200, '', 'GET-ONE', 10001);
      expect(result.body.id).toBe(10001);
      expect(result.body.name).toBe('Carros');
      expect(result.body.friendlyURL).toBe('carros');
      expect(result.body.photoId).toBe(null);
    });
    test('should not return if id is invalid', async () => {
      await testTemplate(user, {}, 400, 'ID da categoria não encontrado.', 'GET-ONE', 10003);
    });
  });
  // PUT categories;
  describe('when trying update a category', () => {
    test('the user must be a admin user (status 200)', async () => {
      const result = await testTemplate(userAdm, { name: 'Pesca' }, 200, '', 'UPDATE', 10000);
      expect(result.body.id).toBe(10000);
      expect(result.body.name).toBe('Pesca');
    });
    test('should not allow it if the user is not admin (status 400)', async () => {
      await testTemplate(user, { name: 'Pescafdf' }, 400, 'Usuário não tem autorização para execultar a funcionalidade.', 'UPDATE', 10000);
    });
    test('the name field should be a string', async () => {
      await testTemplate(userAdm, { name: 123 }, 400, 'O campo nome do(a) categoria deve ser um(a) string', 'UPDATE', 10000);
    });
    test('the friendlyURL field should be a string', async () => {
      await testTemplate(userAdm, { friendlyURL: 123 }, 400, 'O campo url amigavel do(a) categoria deve ser um(a) string', 'UPDATE', 10000);
    });
    test('the name field should not be null', async () => {
      await testTemplate(userAdm, { name: null }, 400, 'O campo nome do(a) categoria é um atributo obrigatório', 'UPDATE', 10000);
    });
    test('the friendlyURL field should not be null', async () => {
      await testTemplate(userAdm, { friendlyURL: null }, 400, 'O campo url amigavel do(a) categoria é um atributo obrigatório', 'UPDATE', 10000);
    });
    describe('and the photo', () => {
      const body = {
        photoTitles: 'Foto teste',
        name: 'Pesca Amadora',
      };
      test('does not exist it should save a return of a photo ID', async () => {
        const result = await testTemplate(userAdm, body, 200, '', 'UPDATE-FORM', 10000);
        expect(result.body.photoId).not.toBeNull();
        expect(result.body.name).toBe('Pesca Amadora');
      });
      test('exists it should update a return of a photo ID', async () => {
        const result = await testTemplate(userAdm, { name: 'Pesca Esportiva', photoTitles: 'Foto da categoria pesca esportiva' }, 200, '', 'UPDATE-FORM', 10000);
        const [photoDB] = await app.db('photos').where({ id: result.body.photoId });
        expect(result.body.photoId).not.toBeNull();
        expect(result.body.name).toBe('Pesca Esportiva');
        expect(photoDB.title).toBe('Foto da categoria pesca esportiva');
      });
    });
  });
  // DELETE categories;
  describe('when trying remove a category', () => {
    test('the user must be a admin user (status 200)', async () => {
      await testTemplate(userAdm, {}, 204, '', 'REMOVE', 10001);
    });
    test('should not allow it if the user is not admin (status 400)', async () => {
      await testTemplate(user, {}, 400, 'Usuário não tem autorização para execultar a funcionalidade.', 'REMOVE', 10000);
    });
    test('should be a valid category ID', async () => {
      await testTemplate(userAdm, {}, 400, 'ID da categoria não encontrado.', 'REMOVE', 999999);
    });
    test('should remove the photo that belongs to it', async () => {
      await testTemplate(userAdm, { name: 'Animais', photoTitles: 'Animais' }, 200, '', 'UPDATE-FORM', 10001);
      const { photoId } = await app.services.category.findOne({ id: 10001 }, false);
      await testTemplate(userAdm, {}, 204, '', 'REMOVE', 10001);
      const photo = await app.services.photo.findOne({ id: photoId });
      expect(photo).not.toBeDefined();
    });
    test('should not remove when it is related to a pin', async () => {
      await testTemplate(userAdm, {}, 400, 'Categora não pode ser excluída, existem pins relacionados.', 'REMOVE', 10000);
    });
  });
});
