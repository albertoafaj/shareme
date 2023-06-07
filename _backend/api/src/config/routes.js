const express = require('express');

module.exports = (app) => {
  // Route for authentication
  app.use('/auth', app.routes.auth);

  // Serve uploaded files statically from the 'uploads' directory
  app.use('/uploads', express.static('uploads'));

  // Create a router for protected routes
  const protectRouter = express.Router();

  // Routes for users
  protectRouter.use('/users', app.routes.users);

  // Routes for photos
  protectRouter.use('/photos', app.routes.photos);

  // Additional routes for authentication
  protectRouter.use('/auth', app.routes.auth);

  // Routes for categories
  protectRouter.use('/categories', app.routes.categories);

  // Routes for postedBy
  protectRouter.use('/posted-by', app.routes.postedBy);

  // Routes for pins
  protectRouter.use('/pins', app.routes.pins);

  // Routes for saved-pins
  protectRouter.use('/saved-pins', app.routes.savedPins);

  // Routes for comments
  protectRouter.use('/comments', app.routes.comments);

  // Mount the protected router under the '/v1' path and require authentication using passport
  app.use('/v1', app.config.passport.authenticate(), protectRouter);
};
