const { Router } = require('express');
const multer = require('multer');
const multerConfig = require('../config/multer');

const upload = multer(multerConfig).array('files');

module.exports = (app) => {
  const router = Router();

  // Handle the HTTP POST request for creating a category
  router.post('/', upload, async (req, res, next) => {
    try {
      let { body } = req;
      // Check if files were uploaded and update the body
      if (req.files) {
        body = await app.utils.photoUpdater.save(body, req.files);
      }
      // Save the category and return the response
      const response = await app.services.category.save(body, req.user);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  });

  router.get('/', async (req, res, next) => {
    // Handle the HTTP GET request for retrieving all categories
    try {
      // Retrieve all categories and return the response
      const response = await app.services.category.findAll();
      return res.status(200).send(response);
    } catch (error) {
      return next(error);
    }
  });

  // Handle the HTTP GET request for retrieving a specific category by ID
  router.get('/:id', async (req, res, next) => {
    try {
      // Retrieve the category by ID and return the response
      const response = await app.services.category.findOne({ id: req.params.id }, true);
      return res.status(200).send(response);
    } catch (error) {
      return next(error);
    }
  });

  // Handle the HTTP PUT request for updating a specific category by ID
  router.put('/:id', upload, async (req, res, next) => {
    const categoryBeforeUpdate = await app.services.category.findOne({ id: req.params.id }, false);
    let { body } = req;
    try {
      // Check if files were uploaded and update the body
      if (req.files && !categoryBeforeUpdate.photoId) {
        body = await app.utils.photoUpdater.save(body, req.files);
      }
      if (req.files && categoryBeforeUpdate.photoId) {
        body = await app.utils.photoUpdater.save(body, req.files, categoryBeforeUpdate.photoId);
      }
      // Update the category and return the response
      const [response] = await app.services.category.update(body, req.params.id, req.user);
      return res.status(200).send(response);
    } catch (error) {
      return next(error);
    }
  });

  // Handle the HTTP DELETE request for removing a specific category by ID
  router.delete('/:id', async (req, res, next) => {
    try {
      await app.services.category.remove(req.user, req.params.id);
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  });
  return router;
};
