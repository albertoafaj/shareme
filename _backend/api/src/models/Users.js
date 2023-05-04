class Users {
  constructor(
    id,
    name,
    email,
    passwd,
    image,
    dateCreate,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.passwd = passwd;
    this.image = image;
    this.dateCreate = dateCreate;
  }
}

module.exports = Users;
