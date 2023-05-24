const { Router } = require('express');
const multer = require('multer');
const ValidationsError = require('../err/ValidationsError');
// const fs = require('fs');
const multerConfig = require('../config/multer');

const upload = multer(multerConfig).array('files');

module.exports = (app) => {
  const router = Router();
  router.post('/', upload, async (req, res, next) => {
    try {
      if (!req.user.auth) throw new ValidationsError('Usuário não tem autorização para execultar a funcionalidade.');
      const { body } = req;
      if (req.files) {
        const [photo] = await app.services.photo.save(req.files, body.photoTitles);
        body.photoId = photo.id;
        delete body.photoTitles;
      }
      const response = await app.services.category.save(body);
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
      console.log(response);
      return res.status(200).send(response);
    } catch (error) {
      return next(error);
    }
  });
  return router;
};
