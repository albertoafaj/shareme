const request = require('supertest');
const jwt = require('jwt-simple');
const app = require('../src/app');
const Comments = require('../src/models/Comments');
const stringGenaretor = require('../src/utils/stringGenerator');

const MAIN_ROTE = '/v1/comments';
let token;
let user;
const commentsAtributes = new Comments();

// Method to check whether the responses are correct
const checkIfHaveAttributes = (response) => {
  Object.entries(commentsAtributes).forEach(([key]) => {
    expect(response).toHaveProperty(key);
  });
};

const testTemplate = async (userTest, body, status, errorMessage, operation, id) => {
  token = `token=${jwt.encode({ id: userTest.id, email: userTest.email }, process.env.JWTSEC)}`;
  let result = {};
  const pinId = id;
  const commentId = id;
  switch (operation) {
    case 'POST':
      /* Perform a POST request and pass the userId in a cookie inside the http request
      and send pinId in the body */
      result = await request(app).post(MAIN_ROTE).set('Cookie', token).send(body);
      break;
    case 'GET':
      // Perform a GET request to retrieve all comments by pinId
      result = await request(app).get(`${MAIN_ROTE}/${pinId}`).set('Cookie', token);
      break;
    case 'UPDATE':
      // Perform a GET request to retrieve all comments by pinId
      result = await request(app).put(`${MAIN_ROTE}/${commentId}`).set('Cookie', token).send(body);
      break;
    case 'REMOVE':
      // Perform a DELETE request to remove a comment by id
      result = await request(app).delete(`${MAIN_ROTE}/${commentId}`).set('Cookie', token);
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
    test('the pinId should be a number', async () => {
      await testTemplate(user, { pinId: '10003' }, 400, 'O campo id do marcador do(a) comentários deve ser um(a) number', 'POST', undefined);
    });
    test('the pinId should exist in DB', async () => {
      await testTemplate(user, { pinId: 999 }, 400, 'ID do pin não foi encontrado.', 'POST', undefined);
    });
  });
  // GET all comments;
  describe('when trying read commnets read all comments by pinId', () => {
    test('should return a list of comments (status 200)', async () => {
      const result = await testTemplate(user, undefined, 200, undefined, 'GET', 10001);
      Object.entries(commentsAtributes).forEach(([key]) => {
        expect(result.body[0]).toHaveProperty(key);
      });
      expect(result.body.length).toBe(1);
    });
    test('should send a valid pinId', async () => {
      await testTemplate(user, undefined, 400, 'ID do pin não foi encontrado.', 'GET', 999);
    });
  });
  // PUT a comment;
  describe('when trying update a comment', () => {
    test('should update the comment (status 200)', async () => {
      const result = await testTemplate(user, { comment: 'comment successfully updated.' }, 200, undefined, 'UPDATE', 10005);
      checkIfHaveAttributes(result.body);
      expect(result.body.comment).toBe('comment successfully updated.');
    });
    test('the comment should be a string', async () => {
      await testTemplate(user, { comment: 123 }, 400, 'O campo comentário do(a) comentários deve ser um(a) string', 'UPDATE', 10005);
    });
    test('should not allow update if belong to another user', async () => {
      await testTemplate(user, { comment: 'Try updating another users comment' }, 400, 'Usuário não tem autorização para execultar a funcionalidade.', 'UPDATE', 10006);
    });
    test('should not allow updating postedById', async () => {
      await testTemplate(user, { postedById: 10000 }, 400, 'O campo id do postado por não pode ser alterado', 'UPDATE', 10005);
    });
    test('should not allow updating postedById', async () => {
      await testTemplate(user, { pinId: 10000 }, 400, 'O campo id do marcador não pode ser alterado', 'UPDATE', 10005);
    });
    test('the comment field should not have values smaller or larger than the preset', async () => {
      await testTemplate(user, { comment: stringGenaretor(266) }, 400, 'O campo comentário do(a) comentários deve ter de 0 a 255 caracteres', 'UPDATE', 10005);
    });
  });
  // DELETE a comment;
  describe('when trying remove a savedPin', () => {
    test('should anthenticated the user (status 204)', async () => {
      await testTemplate(user, undefined, 204, undefined, 'REMOVE', 10005);
    });
    test('should not allow remove if belong to another user', async () => {
      await testTemplate(user, undefined, 400, 'Usuário não tem autorização para execultar a funcionalidade.', 'REMOVE', 10006);
    });
  });
});
