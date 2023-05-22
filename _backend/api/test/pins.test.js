const request = require('supertest');
const app = require('../src/app');

const MAIN_ROTE = '/v1/pins';

describe('categories route', () => {
  beforeAll(async () => {
    await app.db.migrate.rollback();
    await app.db.migrate.latest();
    await app.db.seed.run();

    const user = await app.services.user.findOne({ email: 'main_user@google.com' });
    const userAdm = user;
    userAdm.auth = true;
  });
  // POST pins;
  describe('when trying create a pin', () => {
    test('should anthenticated the user (status 201)', () => { });
    test('should not allow unauthenticated user (status 401)', () => { });
    test('the title field should be a string', () => { });
    test('the about field should be a string', () => { });
    test('the destination field should be a string', () => { });
    test('the categoryId field should be a number', () => { });
    test('the photoId field should be a number', () => { });
    test('the postedById field should be a number', () => { });
    test('the saves field must be an object if it is not null', () => { });
    test('the comments field must be an object if it is not null', () => { });
    test('the title field should not be null', () => { });
    test('the categoryId field should not be null', () => { });
    test('the photoId field should not be null', () => { });
    test('the postedById field should not be null', () => { });
    test('the chosen categoryId should exist in DB', () => { });
    test('should save a photo in DB and return a photoId', () => { });
    test('should save a postedBy in DB and return a postedById', () => { });
  });
  // GET all pins;
  describe('when trying read pins', () => {
    test('should anthenticated the user (status 201)', () => { });
    test('should not allow unauthenticated user (status 401)', () => { });
  });
  // GET a pin;
  describe('when trying read pins by id', () => {
    test('should anthenticated the user (status 201)', () => { });
    test('should not allow unauthenticated user (status 401)', () => { });
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
