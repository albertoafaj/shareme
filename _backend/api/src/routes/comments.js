const { Router } = require('express');

module.exports = (app) => {
  const router = Router();

  // Handle the HTTP POST request for creating a comment
  router.post('/', async (req, res, next) => {
    try {
      const userId = req.user.id;
      const response = await app.services.comment.save({ userId }, req.body);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  });

  // Handle the HTTP GET request to retrieve all comments by pinId
  router.get('/:pinId', async (req, res, next) => {
    try {
      const { pinId } = req.params;
      const response = await app.services.comment.findAllByPinId(pinId);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  });

  return router;
};
