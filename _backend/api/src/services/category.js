const FieldValidator = require('../models/FieldValidator');
const Categories = require('../models/Categories');
const dataValidator = require('../utils/dataValidator');
const ValidationsError = require('../err/ValidationsError');

module.exports = (app) => {
  const categoriesValidator = new Categories(
    { ...new FieldValidator('id', 0, 2147483647, 'number', true, false, true) },
    { ...new FieldValidator('nome', 0, 255, 'string', false, false, true) },
    { ...new FieldValidator('url amigavel', 0, 255, 'string', true, false, true) },
    { ...new FieldValidator('id da foto', 0, 2147483647, 'number', true, false, true) },
  );
  const findOne = async (body, validation) => {
    const category = await app.db('categories').where(body).select().first();
    if (category === undefined && validation === true) throw new ValidationsError('Categoria não encontrada.');
    return category;
  };
  const findAll = async () => app.db('categories').select();
  const save = async (body) => {
    dataValidator(body, 'categoria', categoriesValidator, false, true, false, true, true);
    const name = await findOne({ name: body.name }, false);
    const friendlyURL = await findOne({ friendlyURL: body.friendlyURL });
    if (name) throw new ValidationsError(`A categoria ${body.name} já existe.`);
    if (friendlyURL) throw new ValidationsError(`A URL amigavel ${body.friendlyURL} já existe.`);
    const [response] = await app.db('categories').insert(body, '*');
    return response;
  };
  return {
    save,
    findOne,
    findAll,
  };
};
