const request = require('supertest');
const jwt = require('jwt-simple');
const app = require('../src/app');
const SavedPins = require('../src/models/SavedPins');

const MAIN_ROTE = '/v1/saved-pins';
let token;
let user;
const savedPinsAtributes = new SavedPins();

const testTemplate = async (userTest, body, status, errorMessage, operation, id) => {
  token = `token=${jwt.encode({ id: userTest.id, email: userTest.email }, process.env.JWTSEC)}`;
  let result = {};
  switch (operation) {
    case 'POST':
      /* Perform a POST request and pass the userIin a cookie inside the http request
      and send pinId in the body */
      result = await request(app).post(MAIN_ROTE).set('Cookie', token).send(body);
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

describe('saved pins route', () => {
  beforeAll(async () => {
    await app.db.migrate.rollback();
    await app.db.migrate.latest();
    await app.db.seed.run();

    user = await app.services.user.findOne({ email: 'main_user@google.com' });
  });
  // POST a savedPin;
  describe('when trying create a savedPin', () => {
    test('should anthenticated the user (status 200)', async () => {
      const result = await testTemplate(user, { pinId: 10003 }, 200, undefined, 'POST', undefined);
      Object.entries(savedPinsAtributes).forEach(([key]) => {
        expect(result.body).toHaveProperty(key);
      });
    });
    test('the pinId should be a number', async () => {
      await testTemplate(user, { pinId: '10003' }, 400, 'O campo id do marcador do(a) marcadores salvos deve ser um(a) number', 'POST', undefined);
    });
    test('the pinId field should not be null', async () => {
      await testTemplate(user, { pinId: 999 }, 400, 'ID do pin não foi encontrado.', 'POST', undefined);
    });
  });
  // GET all postedBy;
  describe('when trying read postedBy', () => {
    test('should anthenticated the user (status 201)', () => { });
    test('should not allow unauthenticated user (status 401)', () => { });
  });
  // GET a postedBy;
  describe('when trying read postedBy by id', () => {
    test('should anthenticated the user (status 201)', () => { });
    test('should not allow unauthenticated user (status 401)', () => { });
  });
  // DELETE a postedBy;
  describe('when trying remove a postedBy', () => {
    test('should anthenticated the user (status 201)', () => { });
    test('should not allow unauthenticated user (status 401)', () => { });
  });
});
