// This is the JavaScript entry file - your code begins here
// Do not delete or rename this file ********

// An example of how you import jQuery into a JS file if you use jQuery in that file
import $ from 'jquery';

// An example of how you tell webpack to use a CSS (SCSS) file
import './css/base.scss';

// An example of how you tell webpack to use an image (also need to link to it in the index.html)
import './images/GOTIT.png'
import './images/neonRose.png'
import './images/neonroselogo.png'
import './images/novacancies.png'
import './images/reservations.png'
import './images/rose-large.png'
import './images/vacancies.png'
import './images/welcome.png'
import User from "../src/User"
import Hotel from "../src/Hotel"


let date = new Date();
let hotel;
let monthNames = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"];
let selectedDate;
let reservations = [];
let rooms = [];
let today;
let user;
let users = [];

$(document).on('click', '#reservation-popup .return-button', function(){
  restartReservation();
});

$(document).on('click', '#reservation-popup .filter-button', function(){
  findCheckedRoomTypes();
});

$(document).on('click', '#reservation-popup .select-button', function(){
  validateRoomSelected();
});


$('.continue-button').click(validateDate);
$('#exit-reservation-button').click(toggleNewReservation);
$('.login').keyup(checkInputs);
$('.logout-button').click(resetAfterLogout);
$('.new-reservation-button').click(startNewReservation);
$('.reservation-shield').click(toggleNewReservation);
$('.see-reservations-button').click(viewReservations);
$('.see-spent-button').click(viewCharges);
$('.submit').click(validateLoginInfo);


function usersFetch() {
  return fetch("https://fe-apps.herokuapp.com/api/v1/overlook/1904/users/users")
    .then(data => data.json())
    .then(data => data.users)
    .then(userData => {
      userData.forEach(customer => {
        customer = new User(customer.name, customer.id);
        users.push(customer);
      })
    })
    .catch(error => console.log(error))
}

function roomsFetch() {
  return fetch("https://fe-apps.herokuapp.com/api/v1/overlook/1904/rooms/rooms")
    .then(data => data.json())
    .then(data => data.rooms)
    .then(roomData => {
      roomData.forEach(room => rooms.push(room))
    })
    .catch(error => console.log(error))
}

function reservationsFetch() {
  return fetch("https://fe-apps.herokuapp.com/api/v1/overlook/1904/bookings/bookings")
    .then(data => data.json())
    .then(data => data.bookings)
    .then(bookingData => {
      bookingData.forEach(booking => reservations.push(booking))
    })
    .catch(error => console.log(error))
}

function getFetches() {
  return Promise.all([usersFetch(), roomsFetch(), reservationsFetch()])
}

getFetches()
  .then(() => instantiateHotel(), createDate())

function instantiateHotel() {
  hotel = new Hotel(rooms, reservations);
}

function createDate() {
  let y = date.getFullYear();
  let m = String(date.getMonth() + 1).padStart(2, '0');
  let d = String(date.getDate()).padStart(2, '0');
  today = y + '/' + m + '/' + d;
}

function displayDate() {
  let y = date.getFullYear();
  let d = String(date.getDate()).padStart(2, '0');
  $('.todays-date').text(`${monthNames[date.getMonth()]
  } ${d}, ${y}`);
}

function formatReservationDate(day) {
  day = day.split('/').join('');
  let y = day.split('').slice(0, 4).join('');
  let m = day.split('').slice(4, 6).join('');
  let d = day.split('').slice(6, 8).join('');
  return `${monthNames[m -1]} ${d}, ${y}`
}

function checkInputs() {
  if ($('.username-input').val() && $('.password-input').val()) {
    $('.submit').attr("id", "active");
  }
}

function validateLoginInfo() {
  let ids = [...Array(51).keys()];
  if (document.getElementById("active")) {
    if ($('.username-input').val() === 'manager' && $('.password-input').val() === 'overlook2019') {
      showDashboard('manager');
    } else if (ids.find(i => `customer${i}` === $('.username-input').val()) && $('.password-input').val() === 'overlook2019') {
        user = users.find(u => ('customer' + u.id) === $('.username-input').val())
        showDashboard('customer');
    } else {
      $('.login-input').val('');
      $(".login-error").css("display", "flex");
    }
  }
}

function showDashboard(loginType) {
  $('.login-info').css("display", "none");
  $('.customer-name').text(user.name.split(' ')[0]);
  $('header').css("display", "flex");
  $(`.${loginType}-view`).css("display", "flex");
  populateDashboard(loginType);
}

function resetAfterLogout() {
  $(".manager-popup-window").css("display", "none");
  $(".customer-popup-window").css("display", "none");
  $('.customer-view').css("display", "none");
  $('.manager-view').css("display", "none");
  $(".login-error").css("display", "none");
  $('header').css("display", "none");
  $('.login-input').val('');
  $(".submit#active").removeAttr('id');
  $('.login-info').css("display", "flex");
}

function populateDashboard(loginType) {
  if (loginType === 'manager') {
    displayDate();
    hotel.findAvailableRooms("dashboard", today);
    hotel.calculateCost("date", today);
    hotel.calculatePercentageOccupied(today);
  }
  if (loginType === 'customer') {
    hotel.calculateCost("userID", user.id);
    user.reservations = hotel.findReservations("userID", user.id);
  }
}

function viewReservations() {
  $('#popup').html('');
  $('#popup').append("<img src='images/reservations.png' alt='the word reservations in neon letters' class='neon'>");
  $('#popup').append("<ul class='reservations'></ul>")
  let details = user.reservations.sort((a, b) => new Date(a.date) - new Date(b.date)).map(r => {
    let room = hotel.rooms.find(o => o.number === r.roomNumber)
    return `${formatReservationDate(r.date)}: Room ${r.roomNumber}, type: ${room.roomType}, ${room.numBeds} ${room.bedSize} bed${room.numBeds > 1 ? 's' : ''}, $${room.costPerNight} per night`
  });
  details.forEach(d=> $('.reservations').append(`<li>${d}</li>`));
  togglePopup();
}

function viewCharges() {
  $('#popup').html('');
  $('#popup').append("<h2 class='charges-heading'>All Charges</h2>");
  $('#popup').append("<ul class='charges'></ul>")
  let details = user.reservations.sort((a, b) => new Date(a.date) - new Date(b.date)).map(r => {
    return `${formatReservationDate(r.date)}: Room ${r.roomNumber}, $${hotel.rooms.find(o => o.number === r.roomNumber).costPerNight}`
  });
  details.forEach(d=> $('.charges').append(`<li>${d}</li>`));
  togglePopup();
}

function togglePopup() {
  $('.error').css("display", "none");
  $('.room-errors').css("visibility", "hidden");
  if (document.getElementById("toggle")) {
    $(".popup-window#toggle").removeAttr('id');
  } else {
    $('.popup-window').attr("id", "toggle");
  }
  if (document.getElementById("overlay")) {
    $(".shield#overlay").removeAttr('id');
  } else {
    $('.shield').attr("id", "overlay");
  }
}


function toggleNewReservation() {
  $('.error').css("display", "none");
  $('.room-errors').css("visibility", "hidden");
  if (document.getElementById("toggle")) {
    $(".new-reservation#toggle").removeAttr('id');
  } else {
    $('.new-reservation').attr("id", "toggle");
  }
  if (document.getElementById("overlay")) {
    $(".reservation-shield#overlay").removeAttr('id');
  } else {
    $('.reservation-shield').attr("id", "overlay");
  }
}

function startNewReservation() {
  toggleNewReservation();
  $('#start-date').val(today.split('/').join('-'));
  $(".select-new-reservation-date").css("display", "grid");
  $(".rooms-available-on-date").css("display", "none");
  $(".rooms-available-on-date").html("");
  $(".confirmation-message").css("display", "none");
  $(".confirmation-message").html("")
  $(".date-error").css("display", "none");
}

function validateDate() {
  selectedDate = $('#start-date').val();
  if (Number(selectedDate.split('-').join('')) >= Number(today.split('/').join(''))) {
    $(".select-new-reservation-date").css("display", "none");
    $(".rooms-available-on-date").css("display", "grid");
    hotel.findAvailableRooms("newReservation", selectedDate.split('-').join('/'));
  } else {
    $(".date-error").css("display", "flex");
  }
}

function restartReservation() {
  $('#start-date').val(today.split('/').join('-'));
  $(".select-new-reservation-date").css("display", "grid");
  $(".rooms-available-on-date").css("display", "none");
  $(".rooms-available-on-date").html("");
  $(".date-error").css("display", "none");
}

function findCheckedRoomTypes() {
  $('.vacancies').children().each(function() {
      $(this).css("display", "block");
    });
  let selectedTypes = [];
  $("input[type=checkbox][class=room-type]:checked").each(function() {
        selectedTypes.push($(this).val());
    });
  findRoomsWithCheckedTypes(selectedTypes);
}

function findRoomsWithCheckedTypes(selectedTypes) {
  let available = hotel.findAvailableRooms("date", selectedDate.split('-').join('/'));
  available.forEach(a => {
    if (!selectedTypes.includes(a.roomType)) {
      $(`#${a.number}`).css("display", "none");
    }
  })
  $("input[type=checkbox][class=room-type]:checked").each(function() {
      $(this).prop('checked', false);
    });
}

function validateRoomSelected() {
  $('.room-errors').css("visibility", "hidden");
  let checkedRoom = $('input[type=checkbox][class=checked-room]:checked');
  if (checkedRoom.length === 1) {
    confirmReservation(checkedRoom.attr('id'));
  } else if (checkedRoom.length > 1) {
    $(".rooms-available-on-date").append('<h3 class="error room-errors room-error1">Please select 1 room.</h3>');
    $(`.room-error1`).css("visibility", "visible");
  } else if (checkedRoom.length === 0) {
    $(".rooms-available-on-date").append('<h3 class="error room-errors room-error2">Please select a room to continue!</h3>');
    $(`.room-error2`).css("visibility", "visible");
  }
}

function confirmReservation(roomNumber) {
  let reservedRoom = rooms.find(r => r.number === Number(roomNumber));
  $(".rooms-available-on-date").html('');
  $(".rooms-available-on-date").css("display", "none");
  $(".confirmation-message").css("display", "flex");
  $(".reserved-room-number").text(`${roomNumber}`);
  $(".reserved-date").text(`${formatReservationDate(selectedDate.split('-').join('/'))}`);
  logReservation(reservedRoom)
}

function logReservation(room) {
  let reservation = {userID: Number(user.id), date: selectedDate.split('-').join('/'), roomNumber: Number(room.number)}
  user.addReservation(reservation);
  hotel.addReservation(reservation);
  postReservation(reservation);
}

function postReservation(reservation) {
  return fetch('https://fe-apps.herokuapp.com/api/v1/overlook/1904/bookings/bookings', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      userID: Number(`${reservation.userID}`),
      date: `${reservation.date}`,
      roomNumber: Number(`${reservation.roomNumber}`)
    })
  })
}
