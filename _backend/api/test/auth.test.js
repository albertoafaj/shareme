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
  const testTemplate = async (user) => {
    const result = await request(app)
      .post(`${MAIN_ROTE}${'/signin'}`)
      .send(user);
    return result;
  };

  test('should set token in a cookie', async () => {
    const result = await testTemplate({ email: 'user_authenticated@google.com' });
    expect(result.status).toBe(200);
    expect(result.header).toHaveProperty('set-cookie');
    expect(result.header['set-cookie'][0].includes('token')).toBeTruthy();
  });
  test('should create a user when he doesnt exist', async () => {
    const result = await testTemplate({ email: 'user_non_exist@google.com', name: 'no-exist', image: 'no-exist' });
    expect(result.status).toBe(200);
    expect(result.header).toHaveProperty('set-cookie');
    expect(result.header['set-cookie'][0].includes('token')).toBeTruthy();
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
        name: 'Signup User',
        image: 'http://signup@user',
      });
    const headerToken = {};
    result.header['set-cookie'][0].split(';').forEach((item) => {
      const [key, value] = item.trim().split('=');
      headerToken[key] = value;
    });
    const { token } = headerToken;
    return token;
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
