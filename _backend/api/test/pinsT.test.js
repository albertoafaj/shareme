const request = require('supertest');
const jwt = require('jwt-simple');
const path = require('path');
const app = require('../src/app');
const Pins = require('../src/models/Pins');

const MAIN_ROTE = '/v1/pins';
let token;
let user;
let userAdm;
const pinsAtributes = new Pins();

const testTemplate = async (userTest, body, status, errorMessage, operation, pinId) => {
  token = `token=${jwt.encode({ id: userTest.id, email: userTest.email }, process.env.JWTSEC)}`;
  let result = {};
  switch (operation) {
    case 'POST':
      // Perform a POST request with JSON data
      result = await request(app)
        .post(MAIN_ROTE)
        .set('Cookie', token)
        .field('title', body.title)
        .field('about', body.about)
        .field('destination', body.destination)
        .field('categoryId', parseInt(body.categoryId, 10))
        .field('photoTitles', body.photoTitles)
        .field('postedById', parseInt(body.postedById, 10))
        .attach('files', `${path.resolve(__dirname, '..', 'tmp')}\\testFiles\\img-project-portfolio-360x280.jpg`);
      break;
    case 'GET-ALL':
      // Perform a GET request to retrieve all pins
      result = await request(app)
        .get(MAIN_ROTE)
        .set('Cookie', token);
      break;
    case 'GET-ONE':
      // Perform a GET request to retrieve by id
      result = await request(app)
        .get(`${MAIN_ROTE}/${pinId}`)
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
    userAdm = user;
    userAdm.auth = true;
  });
  // POST pins;
  describe('when trying create a pin', () => {
    const {
      id, dateCreate, photoId, postedById, ...body
    } = new Pins(undefined, 'First Pin', 'Pin about', '', 10002, undefined, undefined, undefined);
    body.photoTitles = 'Test photo of the POST method pins';
    test('should anthenticated the user (status 200)', async () => {
      const result = await testTemplate(user, body, 200, null, 'POST', null);
      Object.entries(pinsAtributes).forEach(([key]) => {
        expect(result.body).toHaveProperty(key);
      });
      expect(result.body.title).toBe(body.title);
    });
    test('the title field should be a string', async () => {
      await testTemplate(user, { ...body, title: 123 }, 400, 'O campo título do(a) marcador deve ser um(a) string', 'POST', null);
    });
    test('the about field should be a string', async () => {
      await testTemplate(user, { ...body, about: 123 }, 400, 'O campo sobre do(a) marcador deve ser um(a) string', 'POST', null);
    });
    test('the destination field should be a string', async () => {
      await testTemplate(user, { ...body, destination: 123 }, 400, 'O campo destino do(a) marcador deve ser um(a) string', 'POST', null);
    });
    test('the categoryId field should be a number', async () => {
      await testTemplate(user, { ...body, categoryId: '123' }, 400, 'O id da categoria informado não existe.', 'POST', null);
    });
    test('the chosen categoryId should exist in DB', async () => {
      await testTemplate(user, { ...body, categoryId: 10004 }, 400, 'O id da categoria informado não existe.', 'POST', null);
    });
    test('should save a photo in DB and return a photoId', async () => {
      const newBody = body;
      newBody.title = 'Photo pin';
      const result = await testTemplate(user, newBody, 200, null, 'POST', null);
      Object.entries(pinsAtributes).forEach(([key]) => {
        expect(result.body).toHaveProperty(key);
      });
      expect(result.body.title).toBe(newBody.title);
    });
    test('should save a postedBy in DB and return a postedById', async () => {
      const newBody = body;
      newBody.title = 'Posted pin';
      const result = await testTemplate(user, newBody, 200, null, 'POST', null);
      Object.entries(pinsAtributes).forEach(([key]) => {
        expect(result.body).toHaveProperty(key);
      });
      expect(result.body.title).toBe(newBody.title);
    });
  });
  // GET all pins;
  describe('when trying read pins', () => {
    test('should anthenticated the user (status 201)', async () => {
      const result = await testTemplate(user, undefined, 200, undefined, 'GET-ALL', undefined);
      Object.entries(pinsAtributes).forEach(([key]) => {
        expect(result.body[0]).toHaveProperty(key);
      });
      expect(result.body.length).toBeGreaterThanOrEqual(1);
    });
  });
  // GET a pin;
  describe.only('when trying read pins by id', () => {
    test('should anthenticated the user (status 201)', async () => {
      const result = await testTemplate(user, undefined, 200, undefined, 'GET-ONE', 10000);
      Object.entries(pinsAtributes).forEach(([key]) => {
        expect(result.body).toHaveProperty(key);
      });
      expect(result.body.title).toBe('Animais selvagens');
    });
    test('should not return if id is invalid', async () => {
      await testTemplate(user, {}, 400, 'ID do pin não foi encontrado.', 'GET-ONE', 999);
    });
  });
  // GET pins by user;
  describe('when trying read pins by user', () => {
    test('should anthenticated the user (status 201)', () => { });
    test('should not allow unauthenticated user (status 401)', () => { });
  });
  // GET pins by category;
  describe('when trying read pins by category', () => {
    test('should anthenticated the user (status 201)', () => { });
    test('should not allow unauthenticated user (status 401)', () => { });
  });
  // PUT a pin;
  describe('when trying update a category', () => {
    test('should anthenticated the user (status 201)', () => { });
    test('should not allow unauthenticated user (status 401)', () => { });
    test('the title field should be a string', () => { });
    test('the about field should be a string', () => { });
    test('the destination field should be a string', () => { });
    test('the categoryId field should be a number', () => { });
    test('the userId field should be a number', () => { });
    test('the postedBy field should be a string', () => { });
    test('the name field should be a string', () => { });
    test('the saves field must be an object if it is not null', () => { });
    test('the comments field must be an object if it is not null', () => { });
    test('the title field should not be null', () => { });
    test('the categoryId field should not be null', () => { });
    test('the photoId field should not be null', () => { });
    test('the photoId field should not be null', () => { });
    test('the userId field should not be null', () => { });
    test('the postedBy field should not be null', () => { });
    test('the chosen categoryId should exist in DB', () => { });
    test('the chosen userId should exist in DB', () => { });
    /* TODO Review the requirements, to make sure if
    the user will be authorized to update the pin photo */
    test('should update a photo in DB and return a photoId', () => { });
  });
  // DELETE a pin;
  describe('when trying remove a category', () => {
    test('should anthenticated the user (status 201)', () => { });
    test('should not allow unauthenticated user (status 401)', () => { });
    test('should remove the photo that belongs to it', () => { });
    test('should remove the saves that belongs to it', () => { });
    test('should remove the comments that belongs to it', () => { });
  });
});
