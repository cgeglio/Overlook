import domUpdates from "../src/DomUpdate"

class Hotel {
  constructor(rooms, reservations) {
    this.rooms = rooms;
    this.reservations = reservations;
  }

  addReservation(reservation) {
    this.reservations.push(reservation);
  }

  removeReservation(reservation) {
    this.reservations.splice(this.reservations.indexOf(this.reservations.find(r => r.id === reservation.id)), 1);
  }

  findReservations(type, specific) {
    let reservations = this.reservations.filter(r => r[type] === specific);
    if (type === 'userID') {
      domUpdates.displayUserReservations(reservations);
    }
    return reservations;
  }

  findAvailableRooms(type, specific) {
    let available = this.rooms.reduce((acc, r) => {
      if (!this.findReservations("date", specific).map(d => d.roomNumber).includes(r.number)) {
        acc.push(r)
      }
      return acc;
    }, []);
    if (type === "dashboard") {
      domUpdates.displayNumberOfAvailableRooms(available);
    } else if (type === "details") {
      domUpdates.viewAvailableRoomDetails(available);
    } else if (type === "newReservation") {
      domUpdates.listAvailableRooms(available);
    }
    return available;
  }

  calculateCost(type, specific) {
    let cost = this.findReservations(type, specific).reduce((acc, r) => {
      let room = this.rooms.find(room => r.roomNumber === room.number)
      acc += room.costPerNight;
      return acc;
    }, 0)
    domUpdates.displayRevenue(cost);
    return cost;
  }

  findRevenueDetails(type, specific) {
    let reserved = this.findReservations(type, specific);
    let revenueDetails = reserved.sort((a, b) => a.roomNumber - b.roomNumber).map(room => `Room ${room.roomNumber}, $${this.rooms.find(r => r.number === room.roomNumber).costPerNight}`);
    domUpdates.viewRevenueDetails(revenueDetails);
    return revenueDetails;
  }

  calculatePercentageOccupied(type, specific) {
    let occupied = this.findReservations("date", specific);
    if (type === "dashboard") {
      domUpdates.displayPercentageOccupied((occupied.length/this.rooms.length)*100);
    } else {
      let rooms = this.rooms.filter(r => (occupied.map(o => o.roomNumber)).includes(r.number))
      console.log(rooms)
      domUpdates.viewOccupiedRoomDetails(rooms);
    }
    return occupied;
  }
}

export default Hotel;
