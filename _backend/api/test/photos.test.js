const request = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('../src/app');

const MAIN_ROUTE = '/v1/photos';
const TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MTAwMDIsImVtYWlsIjoibWFpbl91c2VyQGdvb2dsZS5jb20ifQ.q6lzsF7z6ZI7763odz7Qsn9WbJTAJPeX9c5hIBuVEjw';

const origPath = path.resolve(__dirname, '..', 'tmp', 'testFiles');
const destPath = path.resolve(__dirname, '..', 'uploads');
fs.readFile(`${origPath}/img-project-portfolio-360x280.jpg`, (err, data) => {
  if (err) throw err;
  fs.writeFile(`${destPath}/2b96fa6aabfb94e75c6362b1232d20ef-img-project-portfolio-360x280.jpg`, data, () => {
  });
  fs.writeFile(`${destPath}/not-remove-img-project-portfolio-360x280.jpg`, data, () => {
  });
});

beforeAll(async () => {
  await app.db.migrate.rollback();
  await app.db.migrate.latest();
  await app.db.seed.run();
});
test('should return a uploaded photo', async () => {
  const result = await request(app)
    .get('/uploads/2b96fa6aabfb94e75c6362b1232d20ef-img-project-portfolio-360x280.jpg');
  expect(result.status).toBe(200);
});
test('should return a photos by id', async () => {
  const result = await request(app)
    .get(`${MAIN_ROUTE}/10000`)
    .set('authorization', `bearer ${TOKEN}`);
  expect(result.status).toBe(200);
  expect(result.body.id).toBe(10000);
  expect(result.body.originalname).toBe('img-project-portfolio-360x280.jpg');
});
test('should delete a photos by id', async () => {
  const result = await request(app)
    .delete(`${MAIN_ROUTE}/10000`)
    .set('authorization', `bearer ${TOKEN}`);
  expect(result.status).toBe(204);
});
