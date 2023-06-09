const ValidationError = require('../err/ValidationsError');

const getDataFields = (field, dataValidator) => {
  let fieldValue;
  Object.entries(dataValidator).filter(([key, value]) => {
    if (key === field) { fieldValue = value; }
    return value;
  });
  return fieldValue;
};

const validation = (
  data,
  name,
  validator,
  insertAtLogin,
  checkIsNull,
  checkCanBeUpdated,
  checkTypeOf,
  checkFieldLength,
) => {
  let dataLength = 0;
  Object.entries(data).forEach(([key, value]) => {
    if (key) dataLength += 1;
    const dataFields = getDataFields(key, validator);
    if (checkIsNull && dataFields.canBeNull === false && (value === null || value === undefined)) throw new ValidationError(`O campo ${dataFields.translationToPt} do(a) ${name} é um atributo obrigatório`);
    let fieldLength;
    if (dataFields.canBeNull && value === null) {
      fieldLength = 0;
    } else {
      fieldLength = value.toString().length;
    }
    if (
      (value && checkCanBeUpdated)
      && (dataFields.isNotUpdatable === true)
    ) throw new ValidationError(`O campo ${dataFields.translationToPt} não pode ser alterado`);
    if (insertAtLogin && dataFields.insertAtLogin === false) throw new ValidationError(`O campo ${dataFields.translationToPt} do(a) ${name} não deve ser inserido nessa etapa`);
    if (
      (value && checkTypeOf)
      && (typeof value !== dataFields.fieldType)
    ) throw new ValidationError(`O campo ${dataFields.translationToPt} do(a) ${name} deve ser um(a) ${dataFields.fieldType}`);
    if (
      (value && checkFieldLength)
      && (dataFields.minFieldLength === dataFields.maxFieldLength)
      && fieldLength !== dataFields.maxFieldLength
    ) throw new ValidationError(`O campo ${dataFields.translationToPt} do(a) ${name} deve ter ${dataFields.maxFieldLength} caracteres`);
    if (
      (value && checkFieldLength)
      && (fieldLength < dataFields.minFieldLength || fieldLength > dataFields.maxFieldLength)
    ) throw new ValidationError(`O campo ${dataFields.translationToPt} do(a) ${name} deve ter de ${dataFields.minFieldLength} a ${dataFields.maxFieldLength} caracteres`);
  });
  if (dataLength === 0) throw new ValidationError(`O objeto ${name} está vazio, favor preencher corretamente`);
};

module.exports = validation;
