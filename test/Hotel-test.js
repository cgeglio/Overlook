import chai from 'chai';
const expect = chai.expect;

import Hotel from "../src/Hotel"
import domUpdates from "../src/DomUpdate"

describe('Hotel', () => {
  let hotel;
  let rooms;
  let reservations;

  beforeEach(() => {
    rooms = [{number: 1, roomType: "residential suite", bidet: true, bedSize: "queen", numBeds: 1, costPerNight: 358.4}]
    reservations = [{id: "5fwrgu4i7k55hl6t7", userID: 20, date: "2020/02/16", roomNumber: 1, roomServiceCharges: Array(0)}]
    hotel = new Hotel(rooms, reservations)
  });

  it('should be an instance of a hotel', () => {
    expect(hotel).to.be.an.instanceOf(Hotel)
  });

  it('should have rooms', () => {
    expect(hotel.rooms).to.equal(rooms)
  });

  it('should have reservations', () => {
    expect(hotel.reservations).to.equal(reservations)
  });

  it('should be able to add a reservation', () => {
    let newReservation = {id: "5fwrgu4i7k55hl6t8", userID: 10, date: "2020/04/16", roomNumber: 3, roomServiceCharges: Array(0)}
    hotel.addReservation(newReservation)
    expect(hotel.reservations.length).to.equal(2)
  });

  it('should be able to remove a reservation', () => {
    hotel.removeReservation(hotel.reservations[0])
    expect(hotel.reservations.length).to.equal(0)
  });

  it('should be able to find reserved rooms', () => {
    expect(hotel.findReservations("2020/02/16")).to.deep.equal([reservations[0]])
  });

  it('should be able to find available rooms', () => {
    expect(hotel.findAvailableRooms("2020/02/20")).to.deep.equal([rooms[0]])
  });

  it('should be able to calculate room costs', () => {
    expect(hotel.calculateCost("date", "2020/02/16")).to.equal(358.4)
  });

  it('should be able to find revenue details', () => {
    expect(hotel.findRevenueDetails("date", "2020/02/16")).to.equal(`Room 1, $358.40`)
  });

  it('should be able to calculate the percentage of rooms occupied', () => {
    expect(hotel.calculatePercentageOccupied("date", "2020/02/16")).to.equal(100)
  });

});
