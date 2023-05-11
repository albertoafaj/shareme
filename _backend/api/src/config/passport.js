const passport = require('passport');
const passportJwt = require('passport-jwt');
require('dotenv').config();

const secret = process.env.JWTSEC;

const { Strategy } = passportJwt;

module.exports = (app) => {
  const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies.token;
    }
    return token;
  };

  const params = {
    secretOrKey: secret,
    jwtFromRequest: cookieExtractor,
  };

  const strategy = new Strategy(params, async (payload, done) => {
    try {
      const users = await app.services.user.findOne(payload);
      if (users) {
        return done(null, {
          id: users.id,
          name: users.name,
          email: users.email,
          image: users.image,
        });
      }
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  });

  passport.use(strategy);

  return {
    authenticate: () => passport.authenticate('jwt', { session: false }),
  };
};
