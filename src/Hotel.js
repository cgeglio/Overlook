import DomUpdate from "../src/DomUpdate"
let domUpdates = new DomUpdate

class Hotel {
  constructor(rooms, reservations) {
    this.rooms = rooms;
    this.reservations = reservations;
  }

  findReservations(type, specific) {
    let reservations = this.reservations.filter(r => r[type] === specific);
    if (type === 'userID') {
      domUpdates.displayUserReservations(reservations);
    }
    return reservations;
  }

  findAvailableRooms(date, purpose) {
    let available = this.rooms.reduce((acc, r) => {
      if (!this.findReservations("date", date).map(d => d.roomNumber).includes(r.number)) {
        acc.push(r)
      }
      return acc;
    }, []);
    if (purpose === "dashboard") {
      domUpdates.displayNumberOfAvailableRooms(available);
    } else {
      domUpdates.viewAvailableRoomDetails(available)
    }
    return available;
  }

  calculateCost(type, specific) {
    let cost = this.findReservations(type, specific).reduce((acc, r) => {
      let room = this.rooms.find(room => r.roomNumber === room.number)
      acc += room.costPerNight;
      return acc;
    }, 0)
    if (type === "date") {
      domUpdates.displayRevenue(cost);
    } else {
      domUpdates.displayAmountSpent(cost);
    }
    return cost;
  }

  calculatePercentageOccupied(date, purpose) {
    let occupied = this.findReservations("date", date);
    if (purpose === "dashboard") {
      domUpdates.displayPercentageOccupied((occupied.length/this.rooms.length)*100);
    } else {
      let rooms = this.rooms.filter(r => (occupied.map(o => o.roomNumber)).includes(r.number))
      domUpdates.viewOccupiedRoomDetails(rooms);
    }
    return occupied;
  }
}

export default Hotel;
