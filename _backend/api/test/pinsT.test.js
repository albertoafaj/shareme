const request = require('supertest');
const jwt = require('jwt-simple');
const path = require('path');
const app = require('../src/app');
const Pins = require('../src/models/Pins');

const MAIN_ROTE = '/v1/pins';
let token;
let mainUser;
let secondaryUser;
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
    case 'REMOVE':
      // Perform a DELETE request to remove by id
      result = await request(app)
        .delete(`${MAIN_ROTE}/${pinId}`)
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

    mainUser = await app.services.user.findOne({ email: 'main_user@google.com' });
    secondaryUser = await app.services.user.findOne({ email: 'pin_user@google.com' });
    userAdm = await app.services.user.findOne({ email: process.env.ADMIN_USER });
  });
  // POST pins;
  describe('when trying create a pin', () => {
    const {
      id, dateCreate, photoId, postedById, ...body
    } = new Pins(undefined, 'First Pin', 'Pin about', '', 10002, undefined, undefined, undefined);
    body.photoTitles = 'Test photo of the POST method pins';
    test('should anthenticated the user (status 200)', async () => {
      const result = await testTemplate(mainUser, body, 200, null, 'POST', null);
      Object.entries(pinsAtributes).forEach(([key]) => {
        expect(result.body).toHaveProperty(key);
      });
      expect(result.body.title).toBe(body.title);
    });
    test('the title field should be a string', async () => {
      await testTemplate(mainUser, { ...body, title: 123 }, 400, 'O campo título do(a) marcador deve ser um(a) string', 'POST', null);
    });
    test('the about field should be a string', async () => {
      await testTemplate(mainUser, { ...body, about: 123 }, 400, 'O campo sobre do(a) marcador deve ser um(a) string', 'POST', null);
    });
    test('the destination field should be a string', async () => {
      await testTemplate(mainUser, { ...body, destination: 123 }, 400, 'O campo destino do(a) marcador deve ser um(a) string', 'POST', null);
    });
    test('the categoryId field should be a number', async () => {
      await testTemplate(mainUser, { ...body, categoryId: '123' }, 400, 'O id da categoria informado não existe.', 'POST', null);
    });
    test('the chosen categoryId should exist in DB', async () => {
      await testTemplate(mainUser, { ...body, categoryId: 10004 }, 400, 'O id da categoria informado não existe.', 'POST', null);
    });
    test('should save a photo in DB and return a photoId', async () => {
      const newBody = body;
      newBody.title = 'Photo pin';
      const result = await testTemplate(mainUser, newBody, 200, null, 'POST', null);
      Object.entries(pinsAtributes).forEach(([key]) => {
        expect(result.body).toHaveProperty(key);
      });
      expect(result.body.title).toBe(newBody.title);
    });
    test('should save a postedBy in DB and return a postedById', async () => {
      const newBody = body;
      newBody.title = 'Posted pin';
      const result = await testTemplate(mainUser, newBody, 200, null, 'POST', null);
      Object.entries(pinsAtributes).forEach(([key]) => {
        expect(result.body).toHaveProperty(key);
      });
      expect(result.body.title).toBe(newBody.title);
    });
  });
  // GET all pins;
  describe('when trying read pins', () => {
    test('should anthenticated the user (status 201)', async () => {
      const result = await testTemplate(mainUser, undefined, 200, undefined, 'GET-ALL', undefined);
      Object.entries(pinsAtributes).forEach(([key]) => {
        expect(result.body[0]).toHaveProperty(key);
      });
      expect(result.body.length).toBeGreaterThanOrEqual(1);
    });
  });
  // GET a pin;
  describe('when trying read pins by id', () => {
    test('should anthenticated the user (status 201)', async () => {
      const result = await testTemplate(mainUser, undefined, 200, undefined, 'GET-ONE', 10000);
      Object.entries(pinsAtributes).forEach(([key]) => {
        expect(result.body).toHaveProperty(key);
      });
      expect(result.body.title).toBe('Animais selvagens');
    });
    test('should not return if id is invalid', async () => {
      await testTemplate(mainUser, {}, 400, 'ID do pin não foi encontrado.', 'GET-ONE', 999);
    });
  });
  // TODO GET pins by user;
  describe('when trying read pins by user', () => {
    test('should anthenticated the user (status 201)', () => { });
    test('should not allow unauthenticated user (status 401)', () => { });
  });
  // TODO GET pins by category;
  describe('when trying read pins by category', () => {
    test('should anthenticated the user (status 201)', () => { });
    test('should not allow unauthenticated user (status 401)', () => { });
  });
  // TODO PUT a pin;
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
  describe('when trying remove a pin', () => {
    describe('and it belongs to another user', () => {
      test('shouldnt do it', async () => {
        await testTemplate(secondaryUser, undefined, 400, 'Usuário não tem autorização para execultar a funcionalidade.', 'REMOVE', 10001);
      });
      test('should only do it if you are an administrator', async () => {
        await testTemplate(userAdm, undefined, 204, undefined, 'REMOVE', 10001);
      });
    });
    test('should remove the photo, postedById, saves and comments, that belongs to it', async () => {
      const pin = await app.services.pin.findOne({ id: 10002 }, false);
      const savedPinsBefore = await app.db('savedPins').where({ pinId: pin.id }).select();
      const commentsBefore = await app.db('comments').where({ pinId: pin.id }).select();
      const result = await testTemplate(mainUser, undefined, 204, undefined, 'REMOVE', 10002);
      const photo = await app.db('photos').where({ id: pin.photoId }).select();
      const postedBy = await app.db('postedBy').where({ id: pin.postedById }).select();
      const savedPinsAfter = await app.db('savedPins').where({ pinId: pin.id }).select();
      const commentsAfter = await app.db('comments').where({ pinId: pin.id }).select();
      expect(result.status).toBe(204);
      expect(savedPinsBefore.length).toBe(2);
      expect(savedPinsAfter.length).toBe(0);
      expect(commentsBefore.length).toBe(5);
      expect(commentsAfter.length).toBe(0);
      expect(photo.length).toBe(0);
      expect(postedBy.length).toBe(0);
    });
  });
});
