const FieldValidator = require('../models/FieldValidator');
const PostedBy = require('../models/PostedBy');
const dataValidator = require('../utils/dataValidator');

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

  return {
    save,
    findAll,
  };
};
