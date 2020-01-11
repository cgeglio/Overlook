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
    $('#manager-popup').append("<h2>Available</h2>");
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
    $('#manager-popup').append("<h2>Revenue</h2>");
    $('#manager-popup').append("<ul class='revenue'></ul>");
    revenue.forEach(r => $('.revenue').append(`<li>${r}</li>`));
  }

  displayAmountSpent(cost) {
    $('.customer-amount-spent').text(`You Have Spent $${cost.toFixed(2)}`)
  }

  displayPercentageOccupied(occupied) {
    $('.rooms-occupied-today').text(`${occupied}% of Rooms are Occupied`);
  }

  viewOccupiedRoomDetails(occupied) {
    $('#manager-popup').append("<h2>Occupied</h2>");
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
    $('#customer-popup').append("<img src='images/reservations.png' alt='the word reservations in neon letters' class='neon'>");
    $('#customer-popup').append("<ul class='reservations'></ul>");
    let details = reservations.map(r => {
      return `${this.formatDate(r.date)}: Room ${r.room.number}, type: ${r.room.roomType}, ${r.room.numBeds} ${r.room.bedSize} bed${r.room.numBeds > 1 ? 's' : ''}, $${r.room.costPerNight} per night`
    });
    console.log(details)
    details.forEach(d => $('.reservations').append(`<li>${d}</li>`));
  }


}


export default DomUpdate;
