const { Router } = require('express');
const multer = require('multer');
// const fs = require('fs');
const multerConfig = require('../config/multer');

const upload = multer(multerConfig).array('files');

module.exports = (app) => {
  const router = Router();

  // TODO Implement a maximum limit of 1 photo;
  router.post('/', upload, async (req, res, next) => {
    try {
      const result = await app.services.photo.save(req.files, req.body.photoTitles);
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  });

  router.get('/:id', async (req, res, next) => {
    try {
      const result = await app.services.photo.findOne({ id: parseInt(req.params.id, 10) });
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  });

  router.delete('/:id', async (req, res, next) => {
    try {
      await app.services.photo
        .remove({ id: parseInt(req.params.id, 10) });

      return res.status(204).json();
    } catch (error) {
      return next(error);
    }
  });

  return router;
};
