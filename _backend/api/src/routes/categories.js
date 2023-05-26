const { Router } = require('express');
const multer = require('multer');
const multerConfig = require('../config/multer');

const upload = multer(multerConfig).array('files');

module.exports = (app) => {
  const router = Router();

  router.post('/', upload, async (req, res, next) => {
    try {
      let { body } = req;
      if (req.files) {
        body = await app.utils.photoUpdater.save(body, req.files);
      }
      const response = await app.services.category.save(body, req.user);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  });

  router.get('/', async (req, res, next) => {
    try {
      const response = await app.services.category.findAll();
      return res.status(200).send(response);
    } catch (error) {
      return next(error);
    }
  });
  router.get('/:id', async (req, res, next) => {
    try {
      const response = await app.services.category.findOne({ id: req.params.id }, true);
      return res.status(200).send(response);
    } catch (error) {
      return next(error);
    }
  });

  router.put('/:id', upload, async (req, res, next) => {
    const categoryBeforeUpdate = await app.services.category.findOne({ id: req.params.id }, false);
    let { body } = req;
    try {
      if (req.files && !categoryBeforeUpdate.photoId) {
        body = await app.utils.photoUpdater.save(body, req.files);
      }
      if (req.files && categoryBeforeUpdate.photoId) {
        body = await app.utils.photoUpdater.save(body, req.files, categoryBeforeUpdate.photoId);
      }
      const [response] = await app.services.category.update(body, req.params.id, req.user);
      return res.status(200).send(response);
    } catch (error) {
      return next(error);
    }
  });
  return router;
};
