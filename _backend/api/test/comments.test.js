const request = require('supertest');
const jwt = require('jwt-simple');
const app = require('../src/app');
const Comments = require('../src/models/Comments');

const MAIN_ROTE = '/v1/comments';
let token;
let user;
const commentsAtributes = new Comments();

const testTemplate = async (userTest, body, status, errorMessage, operation, id) => {
  token = `token=${jwt.encode({ id: userTest.id, email: userTest.email }, process.env.JWTSEC)}`;
  let result = {};
  switch (operation) {
    case 'POST':
      /* Perform a POST request and pass the userId in a cookie inside the http request
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

describe('comments route', () => {
  beforeAll(async () => {
    await app.db.migrate.rollback();
    await app.db.migrate.latest();
    await app.db.seed.run();

    user = await app.services.user.findOne({ email: 'main_user@google.com' });
  });
  // POST a comment;
  describe('when trying create a comment', () => {
    test('should anthenticated the user (status 200)', async () => {
      const result = await testTemplate(user, { pinId: 10003, comment: 'fdasbvdashifbid' }, 200, undefined, 'POST', undefined);
      Object.entries(commentsAtributes).forEach(([key]) => {
        expect(result.body).toHaveProperty(key);
      });
    });
    test.only('the pinId should be a number', async () => {
      await testTemplate(user, { pinId: '10003' }, 400, 'O campo id do marcador do(a) comentários deve ser um(a) number', 'POST', undefined);
    });
    test('the pinId should exist in DB', async () => {
      await testTemplate(user, { pinId: 999 }, 400, 'ID do pin não foi encontrado.', 'POST', undefined);
    });
  });
  // GET all comments;
  describe('when trying read commnets', () => {
    test('should anthenticated the user (status 201)', () => { });
    test('should not allow unauthenticated user (status 401)', () => { });
  });
  // GET a comment;
  describe('when trying read comment by id', () => {
    test('should anthenticated the user (status 201)', () => { });
    test('should not allow unauthenticated user (status 401)', () => { });
  });
  // PUT a comment;
  describe('when trying update a comment', () => {
    test('should anthenticated the user (status 201)', () => { });
    test('should not allow unauthenticated user (status 401)', () => { });
    test('should not allow postedById', () => { });
    test('the comment should be a string', () => { });
    /*     test('the comment field should not have values smaller or larger than the preset', async () => {
          await templateUpdate(
            400, { ...product, name: stringGenaretor(266) }, 'O campo nome do produto deve ter de 0 a 255 caracteres', 10009
            );
        }); */
  });
  // DELETE a comment;
  describe('when trying remove a comment', () => {
    test('should anthenticated the user (status 201)', () => { });
    test('should not allow unauthenticated user (status 401)', () => { });
    test('should remove the postedBy that belongs to it', () => { });
  });
});
