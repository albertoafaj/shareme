const fs = require('fs');
const p = require('path');
const FieldValidator = require('../models/FieldValidator');
const dataValidator = require('../utils/dataValidator');
const Photos = require('../models/Photos');
const ValidationsError = require('../err/ValidationsError');

module.exports = (app) => {
  const photoValidator = new Photos(
    { ...new FieldValidator('id da foto', 0, 255, 'number', false, false, true) },
    { ...new FieldValidator('fieldname da foto', 0, 255, 'string', false, false, true) },
    { ...new FieldValidator('originalname da foto do produto', 0, 255, 'string', false, false, true) },
    { ...new FieldValidator('encoding da foto', 0, 255, 'string', false, false, true) },
    { ...new FieldValidator('mimetype da foto', 0, 255, 'string', false, false, true) },
    { ...new FieldValidator('destination da foto', 0, 255, 'string', false, false, true) },
    { ...new FieldValidator('filename da foto', 0, 255, 'string', false, false, true) },
    { ...new FieldValidator('size da foto', 0, 16, 'number', false, false, true) },
    { ...new FieldValidator('url da foto', 0, 255, 'string', false, false, true) },
    { ...new FieldValidator('title da foto', 0, 255, 'string', false, false, true) },
    { ...new FieldValidator('data de criação do produto', 0, 255, 'string', false, true, true) },
  );

  const validateFormData = (files, titles) => {
    if (!titles.length) throw new ValidationsError('Nenhuma título de foto foi informado');
    if (files.length === 0) throw new ValidationsError('Nenhuma foto foi selecionada');
    if (files.length > titles.length) throw new ValidationsError(`Foi(Foram) enviada(s) ${files.length} foto(s) e informado apenas ${titles.length} título(os)`);
  };

  const preparePhotoData = (files, titles) => {
    const photos = files.map((photo, index) => {
      const { path, ...newData } = photo;
      const data = {
        ...newData,
        destination: photo.destination.replace('tmp\\', ''),
        url: path.replace('tmp\\', ''),
        title: titles[index],
      };
      return data;
    });
    return photos;
  };

  const sendData = async (method, photos, id) => {
    let results = [];
    if (method === 'save') {
      results = await Promise.all(photos.map(async (photo) => {
        dataValidator(photo, 'foto', photoValidator, false, true, false, true, true);
        const result = await app.db('photos').insert(photo, '*');
        return result[0];
      }));
    }
    if (method === 'update') {
      dataValidator(photos[0], 'foto', photoValidator, false, true, false, true, true);
      const result = await app.db('photos').where({ id }).update(photos[0], '*');
      results.push(result[0]);
    }
    return results;
  };

  const saveFilesInDiretory = (files) => {
    files.forEach((file) => {
      const tempPath = `${p.resolve(__dirname, '..', '..', 'tmp', 'uploads')}/${file.filename}`;
      const finalPath = `${p.resolve(__dirname, '..', '..', 'uploads')}/${file.filename}`;
      fs.rename(tempPath, finalPath, (err) => {
        if (err) throw new ValidationsError(`Não foi possível salvar o arquivo ${file.originalname}`);
      });
    });
  };

  const removeFilesFromDiretory = (files) => {
    files.forEach((file) => {
      const tempPath = `${p.resolve(__dirname, '..', '..', 'tmp', 'uploads')}/${file.filename}`;
      const finalPath = `${p.resolve(__dirname, '..', '..', 'uploads')}/${file.filename}`;
      fs.rename(tempPath, finalPath, (err) => {
        if (err) throw new ValidationsError(`Não foi possível salvar o arquivo ${file.originalname}`);
      });
    });
  };

  const photoDataProcessing = async (body, method) => {
    const { files, id, photoTitles } = body;
    const titles = Array.isArray(photoTitles) ? photoTitles : [photoTitles];
    try {
      validateFormData(titles, files);
      const photos = preparePhotoData(files, titles);
      const response = sendData(method, photos, id);
      saveFilesInDiretory(files);
      return response;
    } catch (error) {
      removeFilesFromDiretory(files);
      throw error;
    }
  };

  const save = (body) => photoDataProcessing(body, 'save');

  const update = (body) => photoDataProcessing(body, 'update');

  const findOne = async (id) => {
    const photo = await app.db('photos').where(id).first();
    return photo;
  };

  const remove = async (id) => {
    const pin = await app.services.pin.findOne({ photoId: id.id });
    if (pin) throw new ValidationsError('A foto é relacionada a um pis e por isso não pode ser removido ');
    const category = await app.services.category.findOne({ photoId: id.id });
    if (category) throw new ValidationsError('A foto é relacionada a uma categoria e por isso não pode ser removido ');
    const { url } = await app.services.photo
      .findOne(id);
    const photo = await app.db('photos').where(id).delete();
    if (photo === 1) { fs.unlink(url, () => { }); }
    return photo;
  };

  return {
    save, findOne, remove, update,
  };
};
