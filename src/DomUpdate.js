import $ from 'jquery';

class DomUpdate {

  displayNumberOfAvailableRooms(rooms) {
    $('.rooms-available-today').text(`${rooms.length} Available Rooms`);
  }

  viewAvailableRoomDetails(rooms) {
    $('#popup').append("<h2>Available</h2>");
    $('#popup').append("<ul class='available'></ul>")
    let details = rooms.map(r => {
      return `Room ${r.number}, type: ${r.roomType}, ${r.numBeds} ${r.bedSize} bed${r.numBeds > 1 ? 's' : ''}, $${r.costPerNight} per night`
    });
    details.forEach(d=> $('.available').append(`<li>${d}</li>`));
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

  viewOccupiedRoomDetails(occupied) {
    $('#popup').append("<h2>Occupied</h2>");
    $('#popup').append("<ul class='occupied'></ul>");
    let details = occupied.map(o => {
      return `Room ${o.number}, type: ${o.roomType}, ${o.numBeds} ${o.bedSize} bed${o.numBeds > 1 ? 's' : ''}, $${o.costPerNight} per night`
    });
    details.forEach(d=> $('.occupied').append(`<li>${d}</li>`));
  }

  displayUserReservations(reservations) {
    $('.customer-reservations').text(`You Have ${reservations.length} Reservations`);
  }


}


export default DomUpdate;
