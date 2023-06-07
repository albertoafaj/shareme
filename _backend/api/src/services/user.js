require('dotenv').config();
const bcrypt = require('bcryptjs');
const ValidationError = require('../err/ValidationsError');
const Users = require('../models/Users');
const FieldValidator = require('../models/FieldValidator');
const dataValidator = require('../utils/dataValidator');

module.exports = (app) => {
  const getPasswordHash = (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  };

  const usersValidator = new Users(
    { ...new FieldValidator('id', 0, 2147483647, 'number', true, true, true, false) },
    { ...new FieldValidator('nome', 0, 255, 'string', false, true, true, false) },
    { ...new FieldValidator('email', 0, 255, 'string', true, true, true, false) },
    { ...new FieldValidator('senha', 0, 255, 'string', true, true, true, false) },
    { ...new FieldValidator('url da imagem', 0, 255, 'string', false, true, true, false) },
    { ...new FieldValidator('data de criação', 0, 255, 'string', false, true, true, false) },
  );

  const getUserProps = (propField, valueField) => {
    const arr = [];
    Object.entries(usersValidator).filter(([key, value]) => {
      const prop = key;
      Object.entries(value).forEach(([key2, value2]) => {
        if (key2 === propField && value2 === valueField) arr.push(prop);
        return value2;
      });
      return value;
    });
    return arr;
  };

  const findAll = () => app.db('users').select(getUserProps('returnValue', true));

  const findOne = (user) => app.db('users').where({ email: user.email }).select().first();

  const save = async (user) => {
    const {
      id, passwd, dateCreate, ...userData
    } = new Users();
    const saveUser = Object.assign(userData, user);
    if (saveUser === undefined) throw new ValidationError('Usuário deve se conectar ao google.');
    dataValidator(saveUser, 'usuário', usersValidator, true, true, false, true, true);
    const userDB = await findOne(user);
    if (userDB) throw new ValidationError('Já existe um usuário com este email');
    saveUser.passwd = getPasswordHash(saveUser.email);
    return app.db('users').insert(saveUser, getUserProps('returnValue', true));
  };

  const update = async (id, user) => {
    const userData = user;
    dataValidator(userData, 'usuário', usersValidator, true, true, true, true, true);
    return app.db('users').where({ id }).update(userData, getUserProps('returnValue', true));
  };
  return {
    findAll, save, findOne, update,
  };
};
