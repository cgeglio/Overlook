import domUpdates from "../src/DomUpdate"

class User {
  constructor(reservations) {
    this.reservations = reservations;
  }

  addReservation(reservation) {
    this.reservations.push(reservation);
  }

  removeReservation(reservation) {
    this.reservations.splice(this.reservations.indexOf(this.reservations.find(r => r.id === reservation.id)), 1);
  }

}

export default User;
