class FieldValidator {
  constructor(
    translationToPt,
    minFieldLength,
    maxFieldLength,
    fieldType,
    isNotUpdatable,
    insertAtLogin,
    returnValue,
    // TODO refactor all code related
    canBeNull,
  ) {
    this.translationToPt = translationToPt;
    this.minFieldLength = minFieldLength;
    this.maxFieldLength = maxFieldLength;
    this.fieldType = fieldType;
    this.isNotUpdatable = isNotUpdatable;
    this.insertAtLogin = insertAtLogin;
    this.returnValue = returnValue;
    this.canBeNull = canBeNull;
  }
}
module.exports = FieldValidator;
