class Comments {
  constructor(
    id,
    postedById,
    pinId,
    comment,
    dateCreate,
  ) {
    this.id = id;
    this.postedById = postedById;
    this.pinId = pinId;
    this.comment = comment;
    this.dateCreate = dateCreate;
  }
}

module.exports = Comments;
