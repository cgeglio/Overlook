import DomUpdate from "../src/DomUpdate"
let domUpdates = new DomUpdate

class Hotel {
  constructor(rooms, reservations) {
    this.rooms = rooms;
    this.reservations = reservations;
  }

  findReservations(date) {
    return this.reservations.filter(r => r.date === date);
  }

  findAvailableRooms(date) {
    let available = this.rooms.reduce((acc, r) => {
      if (!this.findReservations(date).map(d => d.roomNumber).includes(r.number)) {
        acc.push(r)
      }
      return acc;
    }, []);
    domUpdates.displayAvailableRooms(available);
    return available;
  }

  calculateRevenue(date) {
    let revenue = this.findReservations(date).reduce((acc, r) => {
      let room = this.rooms.find(room => r.roomNumber === room.number)
      acc += room.costPerNight;
      return acc;
    }, 0)
    domUpdates.displayRevenue(revenue);
    return revenue;
  }

  calculatePercentageOccupied(date) {
    let occupied = (this.findReservations(date).length/this.rooms.length)*100;
    domUpdates.displayPercentageOccupied(occupied);
    return occupied;
  }
}

export default Hotel;
