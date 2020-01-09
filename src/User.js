class User {
  constructor(name, id) {
    this.name = name;
    this.id = id;
    this.amountSpent = 0;
    this.reservations = [];
  }
}

module.exports = User;
