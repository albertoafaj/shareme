const express = require('express');

module.exports = (app) => {
  app.use('/auth', app.routes.auth);
  app.use('/uploads', express.static('uploads'));
  const protectRouter = express.Router();
  protectRouter.use('/users', app.routes.users);
  protectRouter.use('/photos', app.routes.photos);
  protectRouter.use('/auth', app.routes.auth);
  app.use('/v1', app.config.passport.authenticate(), protectRouter);
};
