import User from "../src/User"

class Manager extends User {
  constructor(reservations, hotel) {
    super(reservations)
    this.hotel = hotel;
  }

  updateHotelReservations() {
    this.hotel.updateReservations(this.reservations);
  }
}

export default Manager;
