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

  findAmountSpent() {
    let cost = this.reservations.reduce((acc, r) => {
      acc += this.reservedRooms.find(o => o.number === r.roomNumber).costPerNight;
      return acc;
    }, 0);
    this.amountSpent = cost;
    domUpdates.displayAmountSpent(cost);
    return cost;
  }


}

module.exports = User;
