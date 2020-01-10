import $ from 'jquery';

class DomUpdate {

  displayAvailableRooms(rooms) {
    $('.rooms-available-today').text(`${rooms.length} Available Rooms`);
  }

  displayRevenue(revenue) {
    $('.todays-revenue').text(`$${revenue.toFixed(2)} in Revenue Today`);
  }

  displayAmountSpent(cost) {
    $('.customer-amount-spent').text(`You Have Spent $${cost.toFixed(2)}`)
  }

  displayPercentageOccupied(occupied) {
    $('.rooms-occupied-today').text(`${occupied}% of Rooms are Occupied`);
  }

  displayUserReservations(reservations) {
    $('.customer-reservations').text(`You Have ${reservations.length} Reservations`);
  }


}


export default DomUpdate;
