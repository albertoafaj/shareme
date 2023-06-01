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
  // POST a savedPin;
  describe('when trying create a savedPin', () => {
    test('should anthenticated the user (status 201)', () => { });
    test('should not allow unauthenticated user (status 401)', () => { });
    test('the userId should be a number', () => { });
    test('the pinId should be a number', () => { });
    test('the userId field should not be null', () => { });
    test('the pinId field should not be null', () => { });
    test('the chosen userId should exist in DB', () => { });
    test('the chosen pinId should exist in DB', () => { });
    test('should insert the savedPinId in saves ', () => { });
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
