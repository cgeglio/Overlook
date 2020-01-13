import chai from 'chai';
const expect = chai.expect;
import spies from "chai-spies";

chai.use(spies);

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

  describe('updateDOM', () => {
    chai.spy.on(domUpdates, ['displayUserReservations', 'displayNumberOfAvailableRooms', 'viewAvailableRoomDetails', 'listAvailableRooms', 'displayRevenue', 'viewRevenueDetails', 'displayPercentageOccupied', 'viewOccupiedRoomDetails'], () => {});

    it('should be able to find and display reservations on the DOM', function() {
      hotel.findReservations('userID', 20)
      expect(domUpdates.displayUserReservations).to.have.been.called(1);
      expect(domUpdates.displayUserReservations).to.have.been.called.with([{id: "5fwrgu4i7k55hl6t7", userID: 20, date: "2020/02/16", roomNumber: 1, roomServiceCharges: Array(0)}]);
    });

    it('should be able to find and display the number of available rooms on the DOM', function() {
      hotel.findAvailableRooms("dashboard", "2020/02/16")
      expect(domUpdates.displayNumberOfAvailableRooms).to.have.been.called(1);
      expect(domUpdates.displayNumberOfAvailableRooms).to.have.been.called.with([]);
    });

    it('should be able to find and display the details of available rooms on the DOM', function() {
      hotel.findAvailableRooms("details", "2020/02/16")
      expect(domUpdates.viewAvailableRoomDetails).to.have.been.called(1);
      expect(domUpdates.viewAvailableRoomDetails).to.have.been.called.with([]);
    });

    it('should be able to find and create a lit of available rooms on the DOM', function() {
      hotel.findAvailableRooms("newReservation", "2020/02/16")
      expect(domUpdates.listAvailableRooms).to.have.been.called(1);
      expect(domUpdates.listAvailableRooms).to.have.been.called.with([]);
    });

    it('should be able to calculate the revenue and display that number on the DOM', function() {
      hotel.calculateCost("date", "2020/02/16")
      expect(domUpdates.displayRevenue).to.have.been.called(1);
      expect(domUpdates.displayRevenue).to.have.been.called.with(358.4);
    });

    it('should be able to find the revenue details and display on the DOM', function() {
      hotel.findRevenueDetails("date", "2020/02/16")
      expect(domUpdates.viewRevenueDetails).to.have.been.called(1);
      expect(domUpdates.viewRevenueDetails).to.have.been.called.with([`Room 1, $358.4`]);
    });

    it('should be able to calculate the percentage of rooms that are occupied and display that percentage on the DOM', function() {
      hotel.calculatePercentageOccupied("dashboard", "2020/02/16")
      expect(domUpdates.displayPercentageOccupied).to.have.been.called(1);
      expect(domUpdates.displayPercentageOccupied).to.have.been.called.with(100);
    });

    it('should be able to find the details of the rooms that are occupied and display on the DOM', function() {
      hotel.calculatePercentageOccupied("details", "2020/02/16")
      expect(domUpdates.viewOccupiedRoomDetails).to.have.been.called(1);
      expect(domUpdates.viewOccupiedRoomDetails).to.have.been.called.with([{number: 1, roomType: "residential suite", bidet: true, bedSize: "queen", numBeds: 1, costPerNight: 358.4}]);
    });

  });

});
