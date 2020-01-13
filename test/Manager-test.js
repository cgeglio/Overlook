import chai from 'chai';
const expect = chai.expect;

import Manager from "../src/Manager"
import Hotel from "../src/Hotel"

describe('Manager', () => {
  let reservations;
  let roomList;
  let hotel;
  let newReservation;
  let manager;

  beforeEach(() => {
    reservations = [{id: "5fwrgu4i7k55hl6t7", userID: 28, date: "2020/02/16", roomNumber: 7, roomServiceCharges: Array(0)}]
    roomList = [{number: 7}];
    hotel = new Hotel(roomList, reservations)
    newReservation = {id: "5fwrgu4i7k55hl6t5", userID: 43, date: "2020/01/24", roomNumber: 24, roomServiceCharges: []};
    manager = new Manager(reservations, hotel)
  });

  it('should be an instance of a manager', () => {
    expect(manager).to.be.an.instanceOf(Manager)
  });

  it('should start off with reservations', () => {
    expect(manager.reservations.length).to.equal(1)
  });

  it('should start off with hotel information', () => {
      expect(manager.hotel).to.equal(hotel)
  });

  it('should be able to reserve a room', () => {
    manager.addReservation(newReservation)
    expect(manager.reservations.length).to.equal(2)
  });

  it('should be able to remove a reservation', () => {
    manager.removeReservation(reservations[0])
    expect(manager.reservations.length).to.equal(0)
  });

  it('should be able to update the hotel\'s reservations', () => {
    manager.removeReservation(reservations[0])
    manager.updateHotelReservations()
    expect(manager.hotel.reservations.length).to.equal(0)
  });

});
