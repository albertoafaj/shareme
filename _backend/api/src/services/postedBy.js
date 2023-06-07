const FieldValidator = require('../models/FieldValidator');
const PostedBy = require('../models/PostedBy');
const dataValidator = require('../utils/dataValidator');
const ValidationsError = require('../err/ValidationsError');

module.exports = (app) => {
  // Field validators for postedBy
  const postedByValidator = new PostedBy(
    { ...new FieldValidator('id', 0, 2147483647, 'number', true, false, true) },
    { ...new FieldValidator('id do usuário', 0, 255, 'number', true, false, true) },
    { ...new FieldValidator('data de criação', 0, 255, 'string', true, false, true) },
  );
  // Create a new postedBy
  const save = async (body) => {
    dataValidator(body, 'postado por', postedByValidator, false, true, false, true, true);
    const [response] = await app.db('postedBy').insert(body, '*');
    return response;
  };
  // Retrieve all postedBy
  const findAll = async () => app.db('postedBy').select();

  // Retrieve a postedBy
  const findOne = async (id) => {
    const postedBy = await app.db('postedBy').where(id).select().first();
    if (postedBy === undefined) throw new ValidationsError('ID do postado por não encontrado.');
    return postedBy;
  };

  // delete a postedBy
  const remove = async (id) => {
    const pins = await app.db('pins').where({ postedById: id.id }).select().first();
    const comments = await app.db('comments').where({ postedById: id.id }).select().first();
    if (pins) throw new ValidationsError('Postado por não pode ser excluída, existem pins relacionados.');
    if (comments) throw new ValidationsError('Postado por não pode ser excluída, existem comentários relacionados.');
    await app.db('postedBy').where(id).delete();
  };

  return {
    save,
    findAll,
    findOne,
    remove,
  };
};
