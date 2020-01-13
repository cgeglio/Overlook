import domUpdates from "../src/DomUpdate"
import User from "../src/User"

class Customer extends User {
  constructor(reservations, name, id) {
    super(reservations);
    this.name = name;
    this.id = id;
    this.amountSpent = 0;
    this.reservedRooms = [];
  }

  updateReservedRooms(rooms) {
    this.reservedRooms = [];
    this.reservations.forEach(r => this.reservedRooms.push(rooms.find(room => room.number === r.roomNumber)))
  }

  findAmountSpent(rooms) {
    this.updateReservedRooms(rooms);
    this.reservedRooms.forEach(r => r.number = Number(r.number));
    let cost = this.reservations.reduce((acc, r) => {
      let room = this.reservedRooms.find(o => (o.number === r.roomNumber))
      acc += room.costPerNight;
      return acc;
    }, 0);
    this.amountSpent = cost;
    domUpdates.displayAmountSpent(cost);
    return cost;
  }

  viewReservationDetails(type) {
    let details = this.reservations.sort((a, b) => new Date(a.date) - new Date(b.date)).map(r => {
      return {date: r.date, room: this.reservedRooms.find(o => o.number === Number(r.roomNumber))}
    });
    if (type === 'reservations') {
      domUpdates.displayUserReservationDetails(details);
    } else {
      domUpdates.displayCostDetails(details);
    }
    return details;
  }
}

export default Customer;
