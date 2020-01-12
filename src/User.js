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

  findAmountSpent() {
    let cost = this.reservations.reduce((acc, r) => {
      acc += this.reservedRooms.find(o => o.number === r.roomNumber).costPerNight;
      return acc;
    }, 0);
    this.amountSpent = cost;
    domUpdates.displayAmountSpent(cost);
    return cost;
  }

  viewReservationDetails(type) {
    let details = this.reservations.sort((a, b) => new Date(a.date) - new Date(b.date)).map(r => {
      return {date: r.date, room: this.reservedRooms.find(o => o.number === r.roomNumber)}
    });
    if (type === 'reservations') {
      domUpdates.displayUserReservationDetails(details);
    } else {
      domUpdates.displayCostDetails(details);
    }
    return details;
  }
}

export default User;
