import $ from 'jquery';

class DomUpdate {

  formatDate(day) {
    let monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
    day = day.split('/').join('');
    let y = day.split('').slice(0, 4).join('');
    let m = day.split('').slice(4, 6).join('');
    let d = day.split('').slice(6, 8).join('');
    return `${monthNames[m -1]} ${d}, ${y}`;
  }

  displayNumberOfAvailableRooms(rooms) {
    $('.rooms-available-today').text(`${rooms.length} Available Rooms`);
  }

  viewAvailableRoomDetails(rooms) {
    $('#manager-popup').append("<button id='manager-exit-button' type='button' name='exit-button'>X</button>");
    $('#manager-popup').append("<img src='images/available.png' alt='the word available in neon letters' class='neon'>");
    $('#manager-popup').append("<ul class='available'></ul>")
    let details = rooms.map(r => {
      return `Room ${r.number}, type: ${r.roomType}, ${r.numBeds} ${r.bedSize} bed${r.numBeds > 1 ? 's' : ''}, $${r.costPerNight} per night`
    });
    details.forEach(d => $('.available').append(`<li>${d}</li>`));
  }

  displayRevenue(revenue) {
    $('.todays-revenue').text(`$${revenue.toFixed(2)} in Revenue Today`);
  }

  viewRevenueDetails(revenue) {
    $('#manager-popup').append("<button id='manager-exit-button' type='button' name='exit-button'>X</button>");
    $('#manager-popup').append("<img src='images/revenue.png' alt='the word revenue in neon letters' class='neon'>");
    $('#manager-popup').append("<ul class='revenue'></ul>");
    revenue.forEach(r => $('.revenue').append(`<li>${r}</li>`));
  }

  displayAmountSpent(cost) {
    $('.customer-amount-spent').text(`You Have Spent $${cost.toFixed(2)}`)
  }

  displayCostDetails(reservations) {
    $('#customer-popup').append("<button id='customer-exit-button' type='button' name='exit-button'>X</button>");
    $('#customer-popup').append("<img src='images/charges.png' alt='the word charges in neon letters' class='neon'>");
    $('#customer-popup').append("<ul class='charges'></ul>");
    let details = reservations.map(r => {
      return `${this.formatDate(r.date)}: Room ${r.room.number}, $${r.room.costPerNight}`
    });
    details.forEach(d=> $('.charges').append(`<li>${d}</li>`));
  }

  displayPercentageOccupied(occupied) {
    $('.rooms-occupied-today').text(`${occupied}% of Rooms are Occupied`);
  }

  viewOccupiedRoomDetails(occupied) {
    $('#manager-popup').append("<button id='manager-exit-button' type='button' name='exit-button'>X</button>");
    $('#manager-popup').append("<img src='images/occupied.png' alt='the word occupied in neon letters' class='neon'>");
    $('#manager-popup').append("<ul class='occupied'></ul>");
    let details = occupied.map(o => {
      return `Room ${o.number}, type: ${o.roomType}, ${o.numBeds} ${o.bedSize} bed${o.numBeds > 1 ? 's' : ''}, $${o.costPerNight} per night`
    });
    details.forEach(d=> $('.occupied').append(`<li>${d}</li>`));
  }

  displayUserReservations(reservations) {
    $('.customer-reservations').text(`You Have ${reservations.length} Reservations`);
  }

  displayUserReservationDetails(reservations) {
    $('#customer-popup').append("<button id='customer-exit-button' type='button' name='exit-button'>X</button>");
    $('#customer-popup').append("<img src='images/reservations.png' alt='the word reservations in neon letters' class='neon'>");
    $('#customer-popup').append("<ul class='reservations'></ul>");
    let details = reservations.map(r => {
      return `${this.formatDate(r.date)}: Room ${r.room.number}, type: ${r.room.roomType}, ${r.room.numBeds} ${r.room.bedSize} bed${r.room.numBeds > 1 ? 's' : ''}, $${r.room.costPerNight} per night`
    });
    details.forEach(d => $('.reservations').append(`<li>${d}</li>`));
  }


}


export default DomUpdate;
