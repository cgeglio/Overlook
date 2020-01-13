import chai from 'chai';
const expect = chai.expect;

import User from "../src/User"

describe('User', () => {
  let user;
  let newReservation;
  let reservations;

  beforeEach(() => {
    newReservation = {id: "5fwrgu4i7k55hl6t5", userID: 43, date: "2020/01/24", roomNumber: 24, roomServiceCharges: []};
    reservations = [{id: "5fwrgu4i7k55hl6t7", userID: 28, date: "2020/02/16", roomNumber: 7, roomServiceCharges: Array(0)}]
    user = new User(reservations)
  });

  it('should be an instance of a user', () => {
    expect(user).to.be.an.instanceOf(User)
  });

  it('should start off with reservations', () => {
    expect(user.reservations.length).to.equal(1)
  });

  it('should be able to reserve a room', () => {
    user.addReservation(newReservation)
    expect(user.reservations.length).to.equal(2)
  });

  it('should be able to remove a reservation', () => {
    user.removeReservation(reservations[0])
    expect(user.reservations.length).to.equal(0)
  });

});
