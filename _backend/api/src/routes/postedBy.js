const { Router } = require('express');

module.exports = (app) => {
  const router = Router();

  // Handle the HTTP POST request for creating a postedBy
  router.post('/', async (req, res, next) => {
    try {
      const userId = req.user.id;
      const [response] = await app.db('postedBy').insert({ userId }, '*');
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  });

  return router;
};
