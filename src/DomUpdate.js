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

  displayDash(loginType) {
    $('.login-info').css("display", "none");
    $('header').css("display", "flex");
    $(`.${loginType}-view`).css("display", "flex");
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

  toggleCustomerPopup() {
    $('.error').css("display", "none");
    if (document.getElementById("toggle")) {
      $('.customer-popup-window#toggle').removeAttr('id');
    } else {
      $('.customer-popup-window').attr('id', "toggle");
    }
    if (document.getElementById("overlay")) {
      $(".customer-shield#overlay").removeAttr('id');
    } else {
      $('.customer-shield').attr("id", "overlay");
    }
  },

  toggleManagerPopup() {
    if (document.getElementById("toggle")) {
      $('.manager-popup-window#toggle').removeAttr('id');
    } else {
      $('.manager-popup-window').attr('id', "toggle");
    }
    if (document.getElementById("overlay")) {
      $(".manager-shield#overlay").removeAttr('id');
    } else {
      $('.manager-shield').attr("id", "overlay");
    }
  },

  toggleNewReservation() {
    $('.vacancies').remove();
    $('.error').css("display", "none");
    $('.room-errors').css("visibility", "hidden");
    if (document.getElementById("toggle")) {
      $(".new-reservation#toggle").removeAttr('id');
    } else {
      $('.new-reservation').attr("id", "toggle");
    }
    if (document.getElementById("overlay")) {
      $(".customer-reservation-shield#overlay").removeAttr('id');
    } else {
      $('.customer-reservation-shield').attr("id", "overlay");
    }
  },

  toggleNewManagerReservation() {
    $('.vacancies').remove();
    $('.error').css("display", "none");
    $('.room-errors').css("visibility", "hidden");
    if (document.getElementById("toggle")) {
      $(".new-manager-reservation#toggle").removeAttr('id');
    } else {
      $('.new-manager-reservation').attr("id", "toggle");
    }
    if (document.getElementById("overlay")) {
      $(".manager-reservation-shield#overlay").removeAttr('id');
    } else {
      $('.manager-reservation-shield').attr("id", "overlay");
    }
  },

  toggleSearchResults() {
    $('.error').css("display", "none");
    if (document.getElementById("toggle")) {
      $(".user-search-results#toggle").removeAttr('id');
    } else {
      $('.user-search-results').attr("id", "toggle");
    }
    if (document.getElementById("overlay")) {
      $(".manager-shield#overlay").removeAttr('id');
    } else {
      $('.manager-shield').attr("id", "overlay");
    }
  },

  clearPopup(view) {
    $(`#${view}-popup`).html('');
  },

  resetAfterLogout() {
    $(".manager-popup-window").css("visibility", "hidden");
    $(".customer-popup-window").css("visibility", "hidden");
    $('.customer-view').css("display", "none");
    $('.manager-view').css("display", "none");
    $('.error').css("display", "none");
    $('.room-errors').css("visibility", "hidden");
    $('header').css("display", "none");
    $('.login-input').val('');
    $(".submit#active").removeAttr('id');
    $('.login-info').css("display", "flex");
  },

  resetForNewManagerReservation(today, customer) {
    $('#manager-start-date').val(today.split('/').join('-'));
    $('.user').text(customer.name.split(' ')[0]);
    $(".select-new-reservation-date").css("display", "grid");
    $(".rooms-available-on-date").css("display", "none");
    $(".rooms-available-on-date").html("");
    $(".confirmation-message").css("display", "none");
    $(".date-error").css("display", "none");
  },

  resetForNewCustomerReservation(today) {
    $('#customer-start-date').val(today.split('/').join('-'));
    $(".select-new-reservation-date").css("display", "grid");
    $(".rooms-available-on-date").css("display", "none");
    $(".rooms-available-on-date").html("");
    $(".confirmation-message").css("display", "none");
    $(".date-error").css("display", "none");
  },

  newDateReset() {
    $(".select-new-reservation-date").css("display", "none");
    $(".rooms-available-on-date").css("display", "grid");
    $(".rooms-available-on-date").html("");
  },

  restartReservation(today) {
    $('#manager-start-date').val(today.split('/').join('-'));
    $('#customer-start-date').val(today.split('/').join('-'));
    $(".select-new-reservation-date").css("display", "grid");
    $(".rooms-available-on-date").css("display", "none");
    $(".rooms-available-on-date").html("");
    $(".date-error").css("display", "none");
  },

  selectUserFromResults(userInfo) {
    $('#search-results-popup').html('');
    $('#search-results-popup').append("<button class='exit-button' id='exit-search-results' type='button' name='exit-button'>X</button>");
    $('#search-results-popup').append("<h3>There are multiple results for your search. Which user were you looking for?</h3>");
    $('#search-results-popup').append("<ul class='found-users'></ul>");
    userInfo.forEach(u => $('.found-users').append(`<li class='users-to-select'><input type='checkbox' class="user-results" value='${u.id}'><label for='user-results'>${u.name}</label></li>`));
    $("#search-results-popup").append('<h3 class="error select-user-error">Please select 1 user.</h3>');
    $('#search-results-popup').append("<button class='select-user-button' type='button' name='select-user-button'>Select User</button>");
  },

  populateUserResults() {
    $('#search-results-popup').html('');
    $('#search-results-popup').append("<button class='exit-button' id='exit-search-results' type='button' name='exit-button'>X</button>");
    $('#search-results-popup').append("<img src='images/GOTIT.png' alt='the words got it in neon letters' class='confirmation-img'>");
  },

  populateCustomerInfo(reservationList, customer) {
    $('#search-results-popup').append(`<h3 class="user-info"><span>Name</span> ${customer.name}, <span>ID</span> ${reservationList[0].userID}, <span>Amount Spent</span> $ ${(customer.amountSpent).toFixed(2)}</h3>`);
    $('#search-results-popup').append("<div class='search-results-buttons'><button class='manager-new-reservation-button' type='button' name='new-reservation-button'>Add Reservation</button></div>");
    $('.search-results-buttons').append("<button class='delete-reservation-button' type='button' name='delete-reservation-button'>Delete Reservation</button>");
  },

  addCheckboxesToReservations() {
    $('.no-checkbox-list').css("display", "none");
    $('.checkbox-list').css("display", "block");
    $('.found-reservations').append("<button class='select-reservation-to-delete-button' type='button' name='select-reservation-to-delete-button'>Delete Selected Reservation</button>");
    $('#search-results-popup').append('<h3 class="error reservation-error1">You can only delete one reservation at a time.</h3>');
    $('#search-results-popup').append('<h3 class="error reservation-error2">Please select a reservation to delete.</h3>');
    $('#search-results-popup').append('<h3 class="error reservation-error3">Past reservations can not be removed. Please select an upcoming reservation to delete.</h3>');
  },

  populateCustomerReservationInfo(details) {
    $('#search-results-popup').append("<ul class='found-reservations'><h4>Reservations:</h4></ul>");
    details.forEach(d => $('.found-reservations').append(`<li class="no-checkbox-list">Date: ${d.date}, Room: ${d.number}</li>`));
    details.forEach(d => $('.found-reservations').append(`<li class="checkbox-list" id='${d.id}'><input type='checkbox' class='specific-reservation' value='${d.id}'><label for='specific-reservation'>Date: ${d.date}, Room: ${d.number}</label></li>`));
  },

  viewAvailableRoomDetails(rooms) {
    $('#manager-popup').append("<button class='exit-button' id='manager-exit-button' type='button' name='exit-button'>X</button>");
    $('#manager-popup').append("<img src='images/available.png' alt='the word available in neon letters' class='neon'>");
    $('#manager-popup').append("<ul class='available'></ul>")
    let details = rooms.map(r => {
      return `Room ${r.number}: type: ${r.roomType}, ${r.numBeds} ${r.bedSize} bed${r.numBeds > 1 ? 's' : ''}, $${r.costPerNight} per night`
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
      return {date: `${this.formatDate(r.date)}:`, details: `Room ${r.room.number}, type: ${r.room.roomType}, ${r.room.numBeds} ${r.room.bedSize} bed${r.room.numBeds > 1 ? 's' : ''}, $${r.room.costPerNight} per night`}
    });
    details.forEach(d => $('.reservations').append(`<ul><span>${d.date}</span><li>${d.details}</li></ul>`));
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
  },

  showConfirmationMessage(roomNumber, selectedDate) {
    $(".rooms-available-on-date").html('');
    $(".rooms-available-on-date").css("display", "none");
    $(".confirmation-message").css("display", "flex");
    $(".reserved-room-number").text(`${roomNumber}`);
    $(".reserved-date").text(`${this.formatDate(selectedDate.split('-').join('/'))}`);
  },

  displayRemoveMessage(reservation, customer) {
    $('.found-reservations').css("display", "none");
    $('.user-info').css("display", "none");
    $('.search-results-buttons').css("display", "none");
    $('#search-results-popup').append(`<div class='deleted-message'><h2><span>${customer.name.split(' ')[0]}'s</span> reservation for <span>${this.formatDate(reservation.date)}</span>, Room <span>${reservation.roomNumber}</span> has been removed.</h2></div>`);
  },

  showRoomError1() {
    $(".rooms-available-on-date").append('<h3 class="error room-errors room-error1">Please select 1 room.</h3>');
    $(`.room-error1`).css("visibility", "visible");
  },

  showRoomError2() {
    $(".rooms-available-on-date").append('<h3 class="error room-errors room-error2">Please select a room to continue!</h3>');
    $(`.room-error2`).css("visibility", "visible");
  }
}

export default domUpdates;
