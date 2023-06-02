const { Router } = require('express');
const multer = require('multer');
const multerConfig = require('../config/multer');

const upload = multer(multerConfig).array('files');

module.exports = (app) => {
  const router = Router();

  // Handle the HTTP POST request for creating a pin
  router.post('/', upload, async (req, res, next) => {
    try {
      let { body } = req;
      // Check if files were uploaded and update the body
      if (req.files) {
        body = await app.utils.photoUpdater.save(body, req.files);
      }
      // Save the PIN and return the response
      const response = await app.services.pin.save(body, req.user);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  });
  // Handle the HTTP GET request for retrieve all pins
  router.get('/', async (req, res, next) => {
    try {
      // Save pins and return the response
      const response = await app.services.pin.findAll();
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  });
  router.delete('/:id', async (req, res, next) => {
    try {
      // Save pins and return the response
      await app.services.pin.remove({ id: req.params.id }, req.user);
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  });
  return router;
};
