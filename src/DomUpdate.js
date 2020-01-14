import $ from 'jquery';

let domUpdates = {

  formatDate(day) {
    let monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    day = day.split('/').join('');
    let y = day.split('').slice(0, 4).join('');
    let m = day.split('').slice(4, 6).join('');
    let d = day.split('').slice(6, 8).join('');
    return `${monthNames[m - 1]} ${d}, ${y}`;
  },

  displayNumberOfAvailableRooms(rooms) {
    $('.rooms-available-today').text(`${rooms.length} Available Rooms`);
  },

  displayRevenue(revenue) {
    $('.todays-revenue').text(`$${revenue.toFixed(2)} in Revenue Today`);
  },

  displayAmountSpent(cost) {
    $('.customer-amount-spent').text(`You Have Spent $${cost.toFixed(2)}`)
  },

  displayPercentageOccupied(occupied) {
    $('.rooms-occupied-today').text(`${occupied}% of Rooms are Occupied`);
  },

  displayUserReservations(reservations) {
    $('.customer-reservations').text(`You Have ${reservations.length} Reservations`);
  },

  viewAvailableRoomDetails(rooms) {
    $('#manager-popup').append("<button class='exit-button' id='manager-exit-button' type='button' name='exit-button'>X</button>");
    $('#manager-popup').append("<img src='images/available.png' alt='the word available in neon letters' class='neon'>");
    $('#manager-popup').append("<ul class='available'></ul>")
    let details = rooms.map(r => {
      return `Room ${r.number}, type: ${r.roomType}, ${r.numBeds} ${r.bedSize} bed${r.numBeds > 1 ? 's' : ''}, $${r.costPerNight} per night`
    });
    details.forEach(d => $('.available').append(`<li>${d}</li>`));
  },

  viewRevenueDetails(revenue) {
    $('#manager-popup').append("<button class='exit-button' id='manager-exit-button' type='button' name='exit-button'>X</button>");
    $('#manager-popup').append("<img src='images/revenue.png' alt='the word revenue in neon letters' class='neon'>");
    $('#manager-popup').append("<ul class='revenue'></ul>");
    revenue.forEach(r => $('.revenue').append(`<li>${r}</li>`));
  },

  viewOccupiedRoomDetails(occupied) {
    $('#manager-popup').append("<button class='exit-button' id='manager-exit-button' type='button' name='exit-button'>X</button>");
    $('#manager-popup').append("<img src='images/occupied.png' alt='the word occupied in neon letters' class='neon'>");
    $('#manager-popup').append("<ul class='occupied'></ul>");
    let details = occupied.map(o => {
      return `Room ${o.number}, type: ${o.roomType}, ${o.numBeds} ${o.bedSize} bed${o.numBeds > 1 ? 's' : ''}, $${o.costPerNight} per night`
    });
    details.forEach(d=> $('.occupied').append(`<li>${d}</li>`));
  },

  displayCostDetails(reservations) {
    $('#customer-popup').append("<button class='exit-button' id='customer-exit-button' type='button' name='exit-button'>X</button>");
    $('#customer-popup').append("<img src='images/charges.png' alt='the word charges in neon letters' class='neon'>");
    $('#customer-popup').append("<ul class='charges'></ul>");
    let details = reservations.map(r => {
      return `${this.formatDate(r.date)}: Room ${r.room.number}, $${r.room.costPerNight}`
    });
    details.forEach(d=> $('.charges').append(`<li>${d}</li>`));
  },

  displayUserReservationDetails(reservations) {
    $('#customer-popup').append("<button class='exit-button' id='customer-exit-button' type='button' name='exit-button'>X</button>");
    $('#customer-popup').append("<img src='images/reservations.png' alt='the word reservations in neon letters' class='neon'>");
    $('#customer-popup').append("<ul class='reservations'></ul>");
    let details = reservations.map(r => {
      return `${this.formatDate(r.date)}: Room ${r.room.number}, type: ${r.room.roomType}, ${r.room.numBeds} ${r.room.bedSize} bed${r.room.numBeds > 1 ? 's' : ''}, $${r.room.costPerNight} per night`
    });
    details.forEach(d => $('.reservations').append(`<li>${d}</li>`));
  },

  listAvailableRooms(rooms) {
    if (rooms.length > 0) {
      $(".rooms-available-on-date").append('<img src="images/vacancies.png" alt="the word vacancies in neon letters" class="vacancies-img neon">');
      $(".rooms-available-on-date").append('<h2 class="select-room">Please select a room to reserve:</h2>');
      let details = rooms.map(r => {
        return {number: r.number, type: r.roomType, detail: `Room ${r.number}, type: ${r.roomType}, ${r.numBeds} ${r.bedSize} bed${r.numBeds > 1 ? 's' : ''}, $${r.costPerNight} per night`};
      });
      this.populateFilterSidebar(details);
      this.populateVacancyList(details);
    } else {
      this.showNoVacanciesMessage();
    }
  },

  populateVacancyList(details) {
    $(".rooms-available-on-date").append("<ul class='vacancies'></ul>");
    details.forEach(d => $(".vacancies").append(`<li class='${d.number} vacancy-list'><input type='checkbox' class='checked-room' id='${d.number}'><label for='${d.number}'>${d.detail}</label></li>`));
    $(".rooms-available-on-date").append('<button class="select-button" type="button" name="select-button">Reserve Room</button>');
  },

  populateFilterSidebar(details) {
    $(".rooms-available-on-date").append("<div class='filter-sidebar'><ul class='types'></ul></div>");
    details.forEach(d => {
      if (!document.getElementById(`${d.type}`)) {
        $(".types").append(`<li id='${d.type}'><input type='checkbox' class='room-type' value='${d.type}'><label for='room-type'>${d.type}</label></li>`)
      }
    })
    $(".filter-sidebar").append('<button class="filter-button" type="button" name="filter-button">Filter Rooms</button>');
  },

  showNoVacanciesMessage() {
    $(".rooms-available-on-date").css("display", "flex");
    $(".rooms-available-on-date").append('<img src="images/novacancies.png" alt="the words no vacancies in neon letters" class="neon">');
    $(".rooms-available-on-date").append('<h2 class="none-available">Oh no! We don\'t have any available rooms for the date you\'ve selected.</h2>')
    $(".rooms-available-on-date").append('<button class="return-button" type="button" name="return-button">Pick A New Date</button>');
  }
}

export default domUpdates;
