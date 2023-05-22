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
  // POST categories;
  describe('when trying create a category', () => {
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
