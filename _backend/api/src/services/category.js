const FieldValidator = require('../models/FieldValidator');
const Categories = require('../models/Categories');
const dataValidator = require('../utils/dataValidator');
const ValidationsError = require('../err/ValidationsError');

module.exports = (app) => {
  // Field validators for categories
  const categoriesValidator = new Categories(
    { ...new FieldValidator('id', 0, 2147483647, 'number', true, false, true, false) },
    { ...new FieldValidator('nome', 0, 255, 'string', false, false, true, false) },
    { ...new FieldValidator('url amigavel', 0, 255, 'string', false, false, true, false) },
    { ...new FieldValidator('id da foto', 0, 2147483647, 'number', false, false, true, true) },
  );

  // Retrieve a category by ID
  const findOne = async (id, validation) => {
    const category = await app.db('categories').where(id).select().first();
    if (category === undefined && validation === true) throw new ValidationsError('ID da categoria não encontrado.');
    return category;
  };

  // Retrieve all categories
  const findAll = async () => app.db('categories').select();

  // Create a new category
  const save = async (body, user) => {
    if (!user.auth) throw new ValidationsError('Usuário não tem autorização para execultar a funcionalidade.');
    dataValidator(body, 'categoria', categoriesValidator, false, true, false, true, true);
    const name = await findOne({ name: body.name }, false);
    const friendlyURL = await findOne({ friendlyURL: body.friendlyURL });
    if (name) throw new ValidationsError(`A categoria ${body.name} já existe.`);
    if (friendlyURL) throw new ValidationsError(`A URL amigavel ${body.friendlyURL} já existe.`);
    const [response] = await app.db('categories').insert(body, '*');
    return response;
  };

  // Update an existing category
  const update = async (body, id, user) => {
    if (!user.auth) throw new ValidationsError('Usuário não tem autorização para execultar a funcionalidade.');
    dataValidator(body, 'categoria', categoriesValidator, false, true, true, true, true);
    const result = await app.db('categories').where({ id }).update(body, '*');
    return result;
  };

  // Remove a category
  const remove = async (user, id) => {
    if (!user.auth) throw new ValidationsError('Usuário não tem autorização para execultar a funcionalidade.');
    const category = await findOne({ id }, true);
    const pins = await app.db('pins').where({ categoryId: parseInt(id, 10) }).select().first();
    if (pins) throw new ValidationsError('Categora não pode ser excluída, existem pins relacionados.');
    if (category.photoId) {
      const photoId = { id: parseInt(category.photoId, 10) };
      await app.db('categories').where({ id: parseInt(id, 10) }).delete();
      await app.services.photo.remove(photoId);
    }
  };
  return {
    save,
    findOne,
    findAll,
    update,
    remove,
  };
};
