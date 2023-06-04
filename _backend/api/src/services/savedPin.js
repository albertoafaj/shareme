const FieldValidator = require('../models/FieldValidator');
const SavedPins = require('../models/SavedPins');
const dataValidator = require('../utils/dataValidator');

module.exports = (app) => {
  // Field validators for postedBy
  const postedByValidator = new SavedPins(
    { ...new FieldValidator('id', 0, 2147483647, 'number', true, false, true) },
    { ...new FieldValidator('id do usuário', 0, 255, 'number', true, false, true) },
    { ...new FieldValidator('id do marcador', 0, 255, 'number', true, false, true) },
    { ...new FieldValidator('data de criação', 0, 255, 'string', true, false, true) },
  );
  // Create a new savedPin
  const save = async (body) => {
    console.log(body);
    await app.services.pin.findOne({ id: body.pinId }, true);
    dataValidator(body, 'marcadores salvos', postedByValidator, false, true, false, true, true);
    const [response] = await app.db('savedPins').insert(body, '*');
    return response;
  };

  return {
    save,
  };
};
