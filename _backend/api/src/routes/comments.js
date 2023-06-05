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

  // Handle the HTTP PUT request to update a comment
  router.put('/:id', async (req, res, next) => {
    try {
      console.log(req.body);
      const { body, user } = req;
      const { id } = req.params;
      const [response] = await app.services.comment.update(id, body, user);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  });

  // Handle the HTTP DELETE request to remove a comment by id
  router.delete('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      await app.services.comment.remove(id, userId);
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  });

  return router;
};
