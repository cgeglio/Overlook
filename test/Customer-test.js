import chai from 'chai';
const expect = chai.expect;
import spies from "chai-spies";

chai.use(spies);

import Customer from "../src/Customer"
import domUpdates from "../src/DomUpdate"

describe('Customer', () => {
  let customer;
  let newReservation;
  let reservations;
  let room;

  beforeEach(() => {
    room = {number: 3, roomType: "single room", bidet: false, bedSize: "king", numBeds: 1, costPerNight: 491.14};
    newReservation = {id: "5fwrgu4i7k55hl6t5", userID: 43, date: "2020/01/24", roomNumber: 24, roomServiceCharges: []};
    reservations = [{id: "5fwrgu4i7k55hl6t7", userID: 28, date: "2020/02/16", roomNumber: 7, roomServiceCharges: []}];
    customer = new Customer(reservations, 'Marlowe', 28);
  });

  it('should be an instance of a customer', () => {
    expect(customer).to.be.an.instanceOf(Customer)
  });

  it('should have reservations', () => {
    expect(customer.reservations).to.equal(reservations)
  });

  it('should have a name', () => {
    expect(customer.name).to.equal('Marlowe')
  });

  it('should have an id number', () => {
    expect(customer.id).to.equal(28)
  });

  it('should start off with $0 spent', () => {
    expect(customer.amountSpent).to.equal(0)
  });

  it('should start off with an empty list of reserved rooms', () => {
    expect(customer.reservedRooms.length).to.equal(0)
  });

  it('should be able to add a reservation', () => {
    customer.addReservation(newReservation)
    expect(customer.reservations.length).to.equal(2)
  });

  it('should be able to remove a reservation', () => {
    customer.removeReservation(reservations[0])
    expect(customer.reservations.length).to.equal(0)
  });

  it('should be able to update the reserved room list', () => {
    let roomList = [{number: 7}]
    customer.updateReservedRooms(roomList)
    expect(customer.reservedRooms.length).to.equal(1)
  });

  describe('updateDOM', () => {

    let roomList;
    chai.spy.on(domUpdates, ['displayAmountSpent', 'displayUserReservationDetails', 'displayCostDetails'], () => {});

    beforeEach(() => {;
      roomList = [{number: 1, costPerNight: 250}, {number: 7, costPerNight: 300} ];
    })

    it('should update the amount spent on the DOM', function() {
      customer.addReservation({id: "5fwrgu4i7k55hl6t7", userID: 20, date: "2020/02/16", roomNumber: 1, roomServiceCharges: Array(0)})
      customer.updateReservedRooms(roomList);
      customer.findAmountSpent(roomList);
      expect(domUpdates.displayAmountSpent).to.have.been.called(1);
      expect(domUpdates.displayAmountSpent).to.have.been.called.with(550);
    });

    it('should show reservation details on the DOM', function() {
      customer.addReservation({id: "5fwrgu4i7k55hl6t7", userID: 20, date: "2020/02/16", roomNumber: 1, roomServiceCharges: Array(0)})
      customer.updateReservedRooms(roomList);
      customer.viewReservationDetails("reservations");
      expect(domUpdates.displayUserReservationDetails).to.have.been.called(1);
      expect(domUpdates.displayUserReservationDetails).to.have.been.called.with([
        { date: '2020/02/16', room: { number: 7, costPerNight: 300 }},
        { date: '2020/02/16', room: { number: 1, costPerNight: 250 }}
      ]);
    });

    it('should show cost details on the DOM', function() {
      customer.addReservation({id: "5fwrgu4i7k55hl6t7", userID: 20, date: "2020/02/16", roomNumber: 1, roomServiceCharges: Array(0)})
      customer.updateReservedRooms(roomList);
      customer.viewReservationDetails();
      expect(domUpdates.displayCostDetails).to.have.been.called(1);
      expect(domUpdates.displayCostDetails).to.have.been.called.with([
        { date: '2020/02/16', room: { number: 7, costPerNight: 300 }},
        { date: '2020/02/16', room: { number: 1, costPerNight: 250 }}
      ]);
    });
  });
});
