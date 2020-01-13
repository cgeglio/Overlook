import chai from 'chai';
const expect = chai.expect;
import spies from "chai-spies";

chai.use(spies);

import User from "../src/User"
import domUpdates from "../src/DomUpdate"

describe('User', () => {
  let user;
  let reservation;

  beforeEach(() => {
    user = new User('Marlowe', 28)
    reservation = {id: "5fwrgu4i7k55hl6t7", userID: 28, date: "2020/02/16", roomNumber: 7, roomServiceCharges: Array(0)}
  });

  it('should be an instance of a user', () => {
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

  describe('updateDOM', () => {
    chai.spy.on(domUpdates, ['displayAmountSpent', 'displayUserReservationDetails', 'displayCostDetails'], () => {});

    it('should update the amount spent on the DOM', function() {
      user.reservedRooms.push({number: 1, costPerNight: 250})
      user.addReservation({id: "5fwrgu4i7k55hl6t7", userID: 20, date: "2020/02/16", roomNumber: 1, roomServiceCharges: Array(0)})
      user.findAmountSpent();
      expect(domUpdates.displayAmountSpent).to.have.been.called(1);
      expect(domUpdates.displayAmountSpent).to.have.been.called.with(250);
    });

    it('should show reservation details on the DOM', function() {
      user.reservedRooms.push({number: 1, costPerNight: 250})
      user.addReservation({id: "5fwrgu4i7k55hl6t7", userID: 20, date: "2020/02/16", roomNumber: 1, roomServiceCharges: Array(0)})
      user.viewReservationDetails("reservations");
      expect(domUpdates.displayUserReservationDetails).to.have.been.called(1);
      expect(domUpdates.displayUserReservationDetails).to.have.been.called.with([{date: "2020/02/16", room: { number: 1, costPerNight: 250 }}]);
    });

    it('should show cost details on the DOM', function() {
      user.reservedRooms.push({number: 1, costPerNight: 250})
      user.addReservation({id: "5fwrgu4i7k55hl6t7", userID: 20, date: "2020/02/16", roomNumber: 1, roomServiceCharges: Array(0)})
      user.viewReservationDetails();
      expect(domUpdates.displayCostDetails).to.have.been.called(1);
      expect(domUpdates.displayCostDetails).to.have.been.called.with([{date: "2020/02/16", room: { number: 1, costPerNight: 250 }}]);
    });

  });
  
});
