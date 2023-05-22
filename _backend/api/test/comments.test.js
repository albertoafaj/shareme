const request = require('supertest');
const app = require('../src/app');

const MAIN_ROTE = '/v1/categories';

describe('categories route', () => {
  beforeAll(async () => {
    await app.db.migrate.rollback();
    await app.db.migrate.latest();
    await app.db.seed.run();

    const user = await app.services.user.findOne({ email: 'main_user@google.com' });
    const userAdm = user;
    userAdm.auth = true;
  });
  // POST comments;
  describe('when trying create a comment', () => {
    test('should anthenticated the user (status 201)', () => { });
    test('should not allow unauthenticated user (status 401)', () => { });
    test('should save a postedBy in DB and return a postedById', () => { });
    test('the comment should be a string', () => { });
    test('the comment field should not have values smaller or larger than the preset', async () => {
      await templateUpdate(400, { ...product, name: stringGenaretor(266) }, 'O campo nome do produto deve ter de 0 a 255 caracteres', 10009);
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
    test('the comment field should not have values smaller or larger than the preset', async () => {
      await templateUpdate(400, { ...product, name: stringGenaretor(266) }, 'O campo nome do produto deve ter de 0 a 255 caracteres', 10009);
    });
  });
  // DELETE a comment;
  describe('when trying remove a comment', () => {
    test('should anthenticated the user (status 201)', () => { });
    test('should not allow unauthenticated user (status 401)', () => { });
    test('should remove the postedBy that belongs to it', () => { });
  });
});
