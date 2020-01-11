import DomUpdate from "../src/DomUpdate"
let domUpdates = new DomUpdate

class User {
  constructor(name, id) {
    this.name = name;
    this.id = id;
    this.amountSpent = 0;
    this.reservations = [];
    this.reservedRooms = [];
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

  viewReservationDetails() {
    let details = this.reservations.sort((a, b) => new Date(a.date) - new Date(b.date)).map(r => {
      return {date: r.date, room: this.reservedRooms.find(o => o.number === r.roomNumber)}
    });
    domUpdates.displayUserReservationDetails(details);
    return details;
  }
}

export default User;
