const FieldValidator = require('../models/FieldValidator');
const Pins = require('../models/Pins');
const dataValidator = require('../utils/dataValidator');
const ValidationError = require('../err/ValidationsError');

module.exports = (app) => {
  // Field validators for pins
  const pinsValidator = new Pins(
    { ...new FieldValidator('id', 0, 2147483647, 'number', true, false, true, false) },
    { ...new FieldValidator('título', 0, 255, 'string', false, false, true, false) },
    { ...new FieldValidator('sobre', 0, 255, 'string', false, false, true, true) },
    { ...new FieldValidator('destino', 0, 255, 'string', false, false, true, true) },
    { ...new FieldValidator('id da categoria', 0, 2147483647, 'number', false, false, true, false) },
    { ...new FieldValidator('id da foto', 0, 2147483647, 'number', false, false, true, false) },
    { ...new FieldValidator('id do postado por', 0, 2147483647, 'number', false, false, true, false) },
    { ...new FieldValidator('date de criação', 0, 255, 'string', false, false, true, false) },
  );

  // Create a new category
  const save = async (body, user) => {
    const { categoryId, ...newBody } = body;
    const postedBy = await app.services.postedBy.save({ userId: user.id });
    const category = await app.services.category.findOne({ id: categoryId });
    if (!category) throw new ValidationError('O id da categoria informado não existe.');
    Object.entries(body).forEach(([key, value]) => {
      if (Number.isNaN(parseInt(value, 10))) {
        newBody[key] = value;
      } else {
        newBody[key] = parseInt(value, 10);
      }
    });
    newBody.categoryId = category.id;
    newBody.postedById = postedBy.id;

    dataValidator(newBody, 'marcador', pinsValidator, false, true, false, true, true);
    const [response] = await app.db('pins').insert(newBody, '*');
    return response;
  };

  // Retrieve all pins
  const findAll = async () => app.db('pins').select('*');

  // Retrieve a pin by id
  const findOne = async (id, validation) => {
    const pin = await app.db('pins').where(id).select().first();
    if (pin === undefined && validation === true) throw new ValidationError('ID do pin não foi encontrado.');
    return pin;
  };

  return {
    save,
    findAll,
    findOne,
  };
};
