const { Router } = require('express');

module.exports = (app) => {
  const router = Router();

  // Handle the HTTP POST request for creating a postedBy
  router.post('/', async (req, res, next) => {
    try {
      const userId = req.user.id;
      const response = await app.services.postedBy.save({ userId });
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  });

  // Handle the HTTP GET request for retrieving all postedBys
  router.get('/', async (req, res, next) => {
    try {
      const response = await app.services.postedBy.findAll();
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  });

  // Handle the HTTP GET request for retrieving a specific postedBy by ID
  router.get('/:id', async (req, res, next) => {
    try {
      const response = await app.services.postedBy.findOne({ id: parseInt(req.params.id, 10) });
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  });

  return router;
};
