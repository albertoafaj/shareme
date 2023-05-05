class Users {
  constructor(
    name = undefined,
    email = undefined,
    image = undefined,
  ) {
    this.name = name;
    this.email = email;
    this.image = image;
  }
}

module.exports = Users;