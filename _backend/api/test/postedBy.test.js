const request = require('supertest');
const jwt = require('jwt-simple');
const app = require('../src/app');

const MAIN_ROTE = '/v1/posted-by';
let token;
let user;

const testTemplate = async (userTest, body, status, errorMessage, operation, id) => {
  token = `token=${jwt.encode({ id: userTest.id, email: userTest.email }, process.env.JWTSEC)}`;
  let result = {};
  switch (operation) {
    case 'POST':
      // Perform a POST request and pass the userId in a cookie within the http request
      result = await request(app).post(MAIN_ROTE).set('Cookie', token);
      break;
    case 'GET':
      // Perform a GET request to receive all postedBys
      result = await request(app).get(MAIN_ROTE).set('Cookie', token);
      break;
    case 'GET-ONE':
      // Perform a GET request to receive a postedBy
      result = await request(app).get(`${MAIN_ROTE}/${id}`).set('Cookie', token);
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

describe('postedBy route', () => {
  beforeAll(async () => {
    // Rollback database migrations
    await app.db.migrate.rollback();
    // Apply database migrations
    await app.db.migrate.latest();
    // Seed the database with initial data
    await app.db.seed.run();
    // Find the main user
    user = await app.services.user.findOne({ email: 'main_user@google.com' });
  });
  // POST postedBy;
  describe('when trying create a postedBy', () => {
    test('should anthenticated the user (status 200)', async () => {
      const result = await testTemplate(user, {}, 200, '', 'POST');
      expect(result.status).toBe(200);
      expect(result.body).toHaveProperty('id');
      expect(result.body).toHaveProperty('userId');
      expect(result.body).toHaveProperty('dateCreate');
    });
    test('should not allow unauthenticated user (status 401)', async () => {
      const result = await request(app).post(MAIN_ROTE);
      expect(result.status).toBe(401);
    });
  });
  // GET all postedBy;
  describe('when trying read postedBy', () => {
    test('should anthenticated the user (status 200)', async () => {
      const result = await testTemplate(user, {}, 200, '', 'GET');
      expect(result.status).toBe(200);
      expect(result.body.length).toBe(2);
      expect(result.body[0]).toHaveProperty('id');
      expect(result.body[0]).toHaveProperty('userId');
      expect(result.body[0]).toHaveProperty('dateCreate');
    });
  });
  // GET a postedBy;
  describe('when trying read postedBy by id', () => {
    test('should anthenticated the user (status 200)', async () => {
      const result = await testTemplate(user, {}, 200, '', 'GET-ONE', 10000);
      expect(result.body.id).toBe(10000);
      expect(result.body.userId).toBe(10002);
    });
    test('should not return if id is invalid', async () => {
      await testTemplate(user, {}, 400, 'ID do postado por não encontrado.', 'GET-ONE', 10003);
    });
  });
  // DELETE a postedBy;
  describe('when trying remove a postedBy', () => {
    test('should anthenticated the user (status 201)', () => { });
    test('should not allow unauthenticated user (status 401)', () => { });
    test('should not remove when it is related to a pin', () => { });
    test('should not remove when it is related to a comment', () => { });
  });
});
