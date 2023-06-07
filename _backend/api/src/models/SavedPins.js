class SavedPins {
  constructor(
    id,
    userId,
    pinId,
    dateCreate,
  ) {
    this.id = id;
    this.userId = userId;
    this.pinId = pinId;
    this.dateCreate = dateCreate;
  }
}

module.exports = SavedPins;
