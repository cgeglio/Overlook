import chai from 'chai';
const expect = chai.expect;

const Hotel = require('../src/Hotel')

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

});
