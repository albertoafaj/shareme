const request = require('supertest');
const app = require('../src/app');

const MAIN_ROTE = '/auth';

describe('auth route', () => {
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
    const user = {
      email: 'signup@user',
      name: 'Signup User',
      image: 'http://signup@user',
    };

    const getToken = async (userTest) => {
      const result = await request(app)
        .post(`${MAIN_ROTE}/signin`)
        .send(userTest);

      return result.headers['set-cookie'][0];
    };

    const getUser = async (token) => {
      const cookie = token;
      const headerToken = {};
      cookie.split(';').forEach((item) => {
        const [key, value] = item.trim().split('=');
        headerToken[key] = value;
      });
      const result = await request(app)
        .get(`/v1${MAIN_ROTE}/validate`)
        .set('Cookie', cookie);
      return result;
    };

    test('should return a user', async () => {
      const userDB = await getUser(await getToken(user));
      expect(userDB.status).toBe(201);
      expect(userDB.body).toHaveProperty('name');
      expect(userDB.body).toHaveProperty('email');
      expect(userDB.body).toHaveProperty('image');
      expect(userDB.body).not.toHaveProperty('auth');
    });
    test('should access protect route', async () => {
      const userDB = await getUser('%invalidnjfdsanf');
      expect(userDB.status).toBe(401);
    });
    test('should send the auth property if it is a user admin', async () => {
      const userDB = await getUser(await getToken({ email: process.env.ADMIN_USER }));
      expect(userDB.status).toBe(201);
      expect(userDB.body).toHaveProperty('auth');
    });
  });
});
