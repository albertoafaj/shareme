const FieldValidator = require('../models/FieldValidator');
const Comments = require('../models/Comments');
const dataValidator = require('../utils/dataValidator');

module.exports = (app) => {
  // Field validators for postedBy
  const commentsValidator = new Comments(
    { ...new FieldValidator('id', 0, 2147483647, 'number', true, false, true) },
    { ...new FieldValidator('id do postado por', 0, 255, 'number', true, false, true) },
    { ...new FieldValidator('id do marcador', 0, 255, 'number', true, false, true) },
    { ...new FieldValidator('comentário', 0, 255, 'string', true, false, true) },
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

  // Retrieve all comments by pinId
  const findAllByPinId = async (pinId) => {
    await app.services.pin.findOne({ id: pinId }, true);
    const response = await app.db('comments').where({ pinId: parseInt(pinId, 10) }).select('*');
    return response;
  };
  return {
    save,
    findAllByPinId,
  };
};
