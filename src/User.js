class User {
  constructor(name, id) {
    this.name = name;
    this.id = id;
    this.amountSpent = 0;
    this.reservations = [];
  }

  addReservation(reservation) {
    this.reservations.push(reservation);
  }

  removeReservation(reservation) {
    this.reservations.splice(this.reservations.indexOf(this.reservations.find(r => r.id === reservation.id)), 1);
  }

  updateAmountSpent(cost) {
    this.amountSpent += cost;
  }
}

module.exports = User;
