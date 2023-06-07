const FieldValidator = require('../models/FieldValidator');
const SavedPins = require('../models/SavedPins');
const dataValidator = require('../utils/dataValidator');
const ValidationError = require('../err/ValidationsError');

module.exports = (app) => {
  // Field validators for postedBy
  const savedPinValidator = new SavedPins(
    { ...new FieldValidator('id', 0, 2147483647, 'number', true, false, true) },
    { ...new FieldValidator('id do usuário', 0, 255, 'number', true, false, true) },
    { ...new FieldValidator('id do marcador', 0, 255, 'number', true, false, true) },
    { ...new FieldValidator('data de criação', 0, 255, 'string', true, false, true) },
  );
  // Create a new savedPin
  const save = async (body) => {
    await app.services.pin.findOne({ id: body.pinId }, true);
    dataValidator(body, 'marcadores salvos', savedPinValidator, false, true, false, true, true);
    const [response] = await app.db('savedPins').insert(body, '*');
    return response;
  };

  // Retrieve a pin by id
  const findOne = async (id, validation) => {
    const savedPin = await app.db('savedPins').where(id).select().first();
    if (savedPin === undefined && validation === true) throw new ValidationError('ID do marcador salvo não foi encontrado.');
    return savedPin;
  };

  // Retrieve all saved pins by pinId
  const findAllByPinId = async (pinId) => {
    await app.services.pin.findOne({ id: pinId }, true);
    const response = await app.db('savedPins').where({ pinId: parseInt(pinId, 10) }).select('*');
    return response;
  };

  // Remove a savedId by id
  const remove = async (id, userId) => {
    const savedPin = await findOne({ id }, true);
    if (userId !== savedPin.userId) throw new ValidationError('Usuário não tem autorização para execultar a funcionalidade.');
    await app.db('savedPins').where({ id }).delete();
  };

  return {
    save,
    findAllByPinId,
    remove,
  };
};
