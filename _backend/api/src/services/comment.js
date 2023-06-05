const FieldValidator = require('../models/FieldValidator');
const Comments = require('../models/Comments');
const dataValidator = require('../utils/dataValidator');
const ValidationError = require('../err/ValidationsError');

module.exports = (app) => {
  // Field validators for postedBy
  const commentsValidator = new Comments(
    { ...new FieldValidator('id', 0, 2147483647, 'number', true, false, true) },
    { ...new FieldValidator('id do postado por', 0, 255, 'number', true, false, true) },
    { ...new FieldValidator('id do marcador', 0, 255, 'number', true, false, true) },
    { ...new FieldValidator('comentário', 0, 255, 'string', false, false, true) },
    { ...new FieldValidator('data de criação', 0, 255, 'string', true, false, true) },
  );
  // Create a new comment
  const save = async (userId, body) => {
    const postedBy = await app.services.postedBy.save(userId);
    const newBody = { ...body, postedById: postedBy.id };
    await app.services.pin.findOne({ id: body.pinId }, true);
    dataValidator(body, 'comentários', commentsValidator, false, true, false, true, true);
    const [response] = await app.db('comments').insert(newBody, '*');
    return response;
  };

  // Retrieve a pin by id
  const findOne = async (id, validation) => {
    const comment = await app.db('comments').where(id).select().first();
    if (comment === undefined && validation === true) throw new ValidationError('ID do comentário não foi encontrado.');
    return comment;
  };

  // Retrieve all comments by pinId
  const findAllByPinId = async (pinId) => {
    await app.services.pin.findOne({ id: pinId }, true);
    const response = await app.db('comments').where({ pinId: parseInt(pinId, 10) }).select('*');
    return response;
  };

  // Retrieve all comments by pinId
  const update = async (id, body, user) => {
    const comment = await findOne({ id }, true);
    const postedBy = await app.services.postedBy.findOne({ id: comment.postedById });
    if (user.id !== postedBy.userId) throw new ValidationError('Usuário não tem autorização para execultar a funcionalidade.');
    await findOne({ id }, true);
    dataValidator(body, 'comentários', commentsValidator, false, true, true, true, true);
    const response = await app.db('comments').where({ id }).update(body, '*');
    return response;
  };
  // Remove a savedId by id
  const remove = async (id, userId) => {
    const comment = await findOne({ id }, true);
    const postedBy = await app.services.postedBy.findOne({ id: comment.postedById });
    if (userId !== postedBy.userId) throw new ValidationError('Usuário não tem autorização para execultar a funcionalidade.');
    await app.db('savedPins').where({ id }).delete();
  };
  return {
    save,
    findAllByPinId,
    update,
    remove,
  };
};
