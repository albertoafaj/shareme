class Pins {
  constructor(
    id,
    title,
    about,
    destination,
    categoryId,
    photoId,
    postedById,
    dateCreate,
  ) {
    this.id = id;
    this.title = title;
    this.about = about;
    this.destination = destination;
    this.categoryId = categoryId;
    this.photoId = photoId;
    this.postedById = postedById;
    this.dateCreate = dateCreate;
  }
}

module.exports = Pins;
