import chai from 'chai';
const expect = chai.expect;

const User = require('../src/User')


describe('User', () => {
  let user;
  let reservation;

  beforeEach(() => {
    user = new User('Marlowe', 28)
    reservation = {id: "5fwrgu4i7k55hl6t7", userID: 28, date: "2020/02/16", roomNumber: 7, roomServiceCharges: Array(0)}
  });

  it('should be an instance of a player', () => {
    expect(user).to.be.an.instanceOf(User)
  });

  it('should have a name', () => {
    expect(user.name).to.equal('Marlowe')
  });

  it('should have an id number', () => {
    expect(user.id).to.equal(28)
  });

  it('should start off with $0 spent', () => {
    expect(user.amountSpent).to.equal(0)
  });

  it('should start off with no reservations', () => {
    expect(user.reservations.length).to.equal(0)
  });

  it('should be able to reserve a room', () => {
    user.addReservation(reservation)
    expect(user.reservations.length).to.equal(1)
  });

  it('should be able to remove a reservation', () => {
    user.addReservation(reservation)
    user.removeReservation(reservation)
    expect(user.reservations.length).to.equal(0)
  });

  it('should be able to update the amount spent', () => {
    user.updateAmountSpent(100)
    expect(user.amountSpent).to.equal(100)
  });

});
