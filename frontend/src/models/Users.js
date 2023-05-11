class Users {
  constructor(
    id = undefined,
    name = undefined,
    email = undefined,
    image = undefined,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.image = image;
  }
}

module.exports = Users;