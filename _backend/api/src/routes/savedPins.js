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

  // Handle the HTTP GET request to retrieve all saved pins by pinId
  router.get('/:pinId', async (req, res, next) => {
    try {
      const { pinId } = req.params;
      const response = await app.services.savedPin.findAllByPinId(pinId);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  });

  // Handle the HTTP DELETE request to remove a pin by id
  router.delete('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      await app.services.savedPin.remove(id, userId);
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  });

  return router;
};
