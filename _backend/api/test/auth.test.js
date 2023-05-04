const request = require('supertest');
const app = require('../src/app');

const MAIN_ROTE = '/auth';

beforeAll(async () => {
  await app.db.migrate.rollback();
  await app.db.migrate.latest();
  await app.db.seed.run();

  const user = {
    email: 'user_authenticated@google.com',
    name: 'User user_authenticated',
    image: `http://${Date.now()}`,
  };
  await app.services.user.save(user);
});

describe('when try loggin', () => {
  const testTemplate = async (logginEmail) => {
    const result = await request(app)
      .post(`${MAIN_ROTE}${'/signin'}`)
      .send({
        email: logginEmail,
      });
    return result;
  };

  test('should received token', async () => {
    const result = await testTemplate('user_authenticated@google.com');
    expect(result.status).toBe(200);
    expect(result.body).toHaveProperty('token');
  });
});

describe('when try create a user', () => {
  test('should return email prop and not passwoed', async () => {
    const user = {
      email: 'signup@user',
      name: 'User signup',
      image: 'http://signup',
    };
    const result = await request(app).post(`${MAIN_ROTE}${'/signup'}`)
      .send(user);
    expect(result.status).toBe(201);
    expect(result.body).toHaveProperty('email');
    expect(result.body.name).toBe('User signup');
    expect(result.body).not.toHaveProperty('password');
  });
});

test('should not access protect route', async () => {
  const users = await request(app).get('/v1/users');
  expect(users.status).toBe(401);
});

describe('when try validate a token', () => {
  const getToken = async () => {
    const result = await request(app)
      .post(`${MAIN_ROTE}/signin`)
      .send({
        email: 'signup@user',
      });
    return result.body.token;
  };

  const getUser = async (token) => {
    const result = await request(app)
      .get(`/v1${MAIN_ROTE}/validate`)
      .set('authorization', `bearer ${token}`);
    return result;
  };

  test('should return a user', async () => {
    const token = await getToken();
    const user = await getUser(token);
    expect(user.status).toBe(201);
    expect(user.body).toHaveProperty('name');
    expect(user.body).toHaveProperty('email');
    expect(user.body).toHaveProperty('image');
  });
  test('should access protect route', async () => {
    const user = await getUser('invalide%token%');
    expect(user.status).toBe(401);
  });
});
