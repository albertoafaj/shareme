const bcrypt = require('bcryptjs');
const jwt = require('jwt-simple');
const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser');

const ValidationsError = require('../err/ValidationsError');

module.exports = (app) => {
  const router = express.Router();
  app.use(cookieParser());
  router.post('/signin', async (req, res, next) => {
    try {
      if (!req.body.email) throw new ValidationsError('Usuário inválido');
      let user = await app.services.user.findOne({ email: req.body.email });
      let payload;
      if (!user) [user] = await app.services.user.save(req.body);
      if (bcrypt.compareSync(req.body.email, user.passwd)) {
        payload = {
          id: user.id,
          email: user.email,
        };
      } else {
        throw new ValidationsError('Usuário inválido');
      }
      const token = jwt.encode(payload, process.env.JWTSEC);
      res.cookie('token', token, { httpOnly: true });
      return res.status(200).json({});
    } catch (error) {
      return next(error);
    }
  });

  router.post('/signup', async (req, res, next) => {
    try {
      const user = await app.services.user.save(req.body);
      return res.status(201).json(user[0]);
    } catch (error) {
      return next(error);
    }
  });
  router.get('/validate', async (req, res, next) => {
    try {
      return res.status(201).json(req.user);
    } catch (error) {
      return next(error);
    }
  });
  router.get('/token', async (req, res, next) => {
    try {
      const { token } = req.cookies;
      let response;
      if (token !== undefined) response = true;
      else response = false;
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  });
  return router;
};
