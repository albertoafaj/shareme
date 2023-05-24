const request = require('supertest');
const jwt = require('jwt-simple');
const fs = require('fs');
const path = require('path');
const app = require('../src/app');

const MAIN_ROUTE = '/v1/photos';
let token;
let user;

const origPath = path.resolve(__dirname, '..', 'tmp', 'testFiles');
const destPath = path.resolve(__dirname, '..', 'uploads');
fs.readFile(`${origPath}/img-project-portfolio-360x280.jpg`, (err, data) => {
  if (err) throw err;
  fs.writeFile(`${destPath}/2b96fa6aabfb94e75c6362b1232d20ef-img-project-portfolio-360x280.jpg`, data, () => {
  });
  fs.writeFile(`${destPath}/not-remove-img-project-portfolio-360x280.jpg`, data, () => {
  });
});

describe('categories route', () => {
  beforeAll(async () => {
    await app.db.migrate.rollback();
    await app.db.migrate.latest();
    await app.db.seed.run();
    user = await app.services.user.findOne({ email: 'main_user@google.com' });
    token = `token=${jwt.encode({ id: user.id, email: user.email }, process.env.JWTSEC)}`;
  });
  test('should save a photo', async () => {
    const result = await request(app)
      .post(`${MAIN_ROUTE}`)
      .set('Cookie', token)
      .field('photoTitles', 'Saved Photo')
      .attach('files', `${path.resolve(__dirname, '..', 'tmp')}\\testFiles\\img-project-portfolio-360x280.jpg`);
    expect(result.status).toBe(200);
    expect(result.body[0]).toHaveProperty('id');
    expect(result.body[0].title).toBe('Saved Photo');
  });
  test('should return a uploaded photo', async () => {
    const result = await request(app)
      .get('/uploads/2b96fa6aabfb94e75c6362b1232d20ef-img-project-portfolio-360x280.jpg');
    expect(result.status).toBe(200);
  });
  test('should return a photos by id', async () => {
    const result = await request(app)
      .get(`${MAIN_ROUTE}/10000`)
      .set('Cookie', token);
    expect(result.status).toBe(200);
    expect(result.body.id).toBe(10000);
    expect(result.body.originalname).toBe('img-project-portfolio-360x280.jpg');
  });
  test('should update a photo by id', async () => {
    const result = await request(app)
      .put(`${MAIN_ROUTE}/10000`)
      .set('Cookie', token)
      .field('photoTitles', 'Updated Photo')
      .attach('files', `${path.resolve(__dirname, '..', 'tmp')}\\testFiles\\img-project-portfolio-360x280.jpg`);
    expect(result.status).toBe(200);
    expect(result.body.id).toBe(10000);
    expect(result.body.originalname).toBe('img-project-portfolio-360x280.jpg');
  });
  test('should delete a photos by id', async () => {
    const result = await request(app)
      .delete(`${MAIN_ROUTE}/10000`)
      .set('Cookie', token);
    expect(result.status).toBe(204);
  });
});
