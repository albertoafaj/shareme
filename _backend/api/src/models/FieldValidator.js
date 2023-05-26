class FieldValidator {
  constructor(
    translationToPt,
    minFieldLength,
    maxFieldLength,
    fieldType,
    isNotUpdatable,
    insertAtLogin,
    returnValue,
  ) {
    this.translationToPt = translationToPt;
    this.minFieldLength = minFieldLength;
    this.maxFieldLength = maxFieldLength;
    this.fieldType = fieldType;
    this.isNotUpdatable = isNotUpdatable;
    this.insertAtLogin = insertAtLogin;
    this.returnValue = returnValue;
  }
}
module.exports = FieldValidator;
