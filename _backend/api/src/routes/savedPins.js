const { Router } = require('express');

module.exports = (app) => {
  const router = Router();

  // Handle the HTTP POST request for creating a savedPins
  router.post('/', async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { pinId } = req.body;
      const response = await app.services.savedPin.save({ userId, pinId });
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  });

  return router;
};
