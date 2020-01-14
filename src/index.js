import $ from 'jquery';
import './css/base.scss';
import './css/variables.scss';
import './images/GOTIT.png'
import './images/neonRose.png'
import './images/neonroselogo.png'
import './images/novacancies.png'
import './images/reservations.png'
import './images/rose-large.png'
import './images/vacancies.png'
import './images/welcome.png'
import './images/available.png'
import './images/charges.png'
import './images/occupied.png'
import './images/revenue.png'
import './images/todayis.png'
import User from "../src/User"
import Customer from "../src/Customer"
import Manager from "../src/Manager"
import Hotel from "../src/Hotel"
import domUpdates from "../src/DomUpdate"


let customer;
let customers = [];
let date = new Date();
let hotel;
let manager;
let reservations = [];
let rooms = [];
let selectedDate;
let today;
let user;
let users = [];


$(document).on('click', '#customer-popup #customer-exit-button', () => toggleCustomerPopup());
$(document).on('click', '#customer-reservation-popup #exit-reservation-button', () => toggleNewReservation());
$(document).on('click', '#customer-reservation-popup .filter-button', () => findCheckedRoomTypes());
$(document).on('click', '#customer-reservation-popup .select-button', () => validateRoomSelected());
$(document).on('click', '#customer-reservation-popup .return-button', () => restartReservation());
$(document).on('click', '#manager-popup #manager-exit-button', () => toggleManagerPopup());
$(document).on('click', '#manager-reservation-popup #exit-manager-reservation-button', () => toggleNewManagerReservation());
$(document).on('click', '#manager-reservation-popup .filter-button', () => findCheckedRoomTypes());
$(document).on('click', '#manager-reservation-popup .return-button', () => restartReservation());
$(document).on('click', '#manager-reservation-popup .select-button', () => validateRoomSelected());
$(document).on('click', '#search-results-popup .delete-reservation-button', () => addCheckboxesToReservations());
$(document).on('click', '#search-results-popup #exit-search-results', () => toggleSearchResults());
$(document).on('click', '#search-results-popup .manager-new-reservation-button', () => startNewManagerReservation());
$(document).on('click', '#search-results-popup .select-user-button', () => findCheckedUser());
$(document).on('click', '#search-results-popup .select-reservation-to-delete-button', () => findCheckedReservation());


$('.customer-continue-button').click(validateDate);
$('.customer-shield').click(toggleCustomerPopup);
$('.login').keyup(checkInputs);
$('.logout-button').click(resetAfterLogout);
$('.manager-continue-button').click(validateDate);
$('.manager-shield').click(toggleManagerPopup);
$('.manager-reservation-shield').click(toggleNewManagerReservation);
$('.new-reservation-button').click(startNewReservation);
$('.reservation-shield').click(toggleNewReservation);
$('.revenue-details-button').click(viewRevenue);
$('.search-button').click(findUserInfo);
$('.see-available-button').click(viewAvailableRooms);
$('.see-occupied-button').click(viewOccupiedRooms);
$('.see-reservations-button').click(viewReservations);
$('.see-spent-button').click(viewCosts);
$('.submit').click(validateLoginInfo);


function usersFetch() {
  return fetch("https://fe-apps.herokuapp.com/api/v1/overlook/1904/users/users")
    .then(data => data.json())
    .then(data => data.users)
    .then(userData => {
      userData.forEach(user => {
        users.push(user);
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
  reservations.forEach(r => r.roomNumber = Number(r.roomNumber))
  hotel = new Hotel(rooms, reservations);
  instantiateManager();
}

function instantiateManager() {
  manager = new Manager(reservations, hotel);
  instantiateCustomers();
}

function instantiateCustomers() {
  users.forEach(u => {
    let reservationList = reservations.find(r => r.userID === u.id);
    u = new Customer(reservationList, u.name, u.id);
    customers.push(u);
  })
}

function createDate() {
  let y = date.getFullYear();
  let m = String(date.getMonth() + 1).padStart(2, '0');
  let d = String(date.getDate()).padStart(2, '0');
  today = y + '/' + m + '/' + d;
}

function displayTodaysDate() {
  let monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  let y = date.getFullYear();
  let d = String(date.getDate()).padStart(2, '0');
  $('.todays-date').text(`${monthNames[date.getMonth()]
  } ${d}, ${y}`);
}

function formatDate(day) {
  let monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  day = day.split('/').join('');
  let y = day.split('').slice(0, 4).join('');
  let m = day.split('').slice(4, 6).join('');
  let d = day.split('').slice(6, 8).join('');
  return `${monthNames[m - 1]} ${d}, ${y}`;
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
      customer = customers.find(c => ('customer' + c.id) === $('.username-input').val())
      showDashboard('customer');
    } else {
      $('.login-input').val('');
      $(".login-error").css("display", "flex");
    }
  }
}

function showDashboard(loginType) {
  $('.login-info').css("display", "none");
  $('header').css("display", "flex");
  $(`.${loginType}-view`).css("display", "flex");
  populateDashboard(loginType);
}

function resetAfterLogout() {
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
}

function populateDashboard(loginType) {
  if (loginType === 'manager') {
    displayTodaysDate();
    populateManagerDash();
  }
  if (loginType === 'customer') {
    populateCustomerDash();
  }
}

function populateManagerDash() {
  hotel.findAvailableRooms("dashboard", today);
  hotel.calculateCost("date", today);
  hotel.calculatePercentageOccupied("dashboard", today);
}

function populateCustomerDash() {
  $('.user-name').text(customer.name.split(' ')[0]);
  customer.reservations = hotel.findReservations("userID", customer.id);
  customer.updateReservedRooms(rooms);
  customer.findAmountSpent(rooms);
}

function viewReservations() {
  clearPopup("customer");
  customer.viewReservationDetails("reservations");
  toggleCustomerPopup();
}

function viewCosts() {
  clearPopup("customer");
  customer.viewReservationDetails("costs");
  toggleCustomerPopup();
}

function viewAvailableRooms() {
  clearPopup("manager");
  hotel.findAvailableRooms("details", today);
  toggleManagerPopup();
}

function viewOccupiedRooms() {
  clearPopup("manager");
  hotel.calculatePercentageOccupied("details", today);
  toggleManagerPopup();
}

function viewRevenue() {
  clearPopup("manager");
  hotel.findRevenueDetails("date", today);
  toggleManagerPopup();
}

function toggleCustomerPopup() {
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
}

function toggleManagerPopup() {
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
}

function toggleNewReservation() {
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
}

function toggleNewManagerReservation() {
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
}

function toggleSearchResults() {
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
}

function clearPopup(view) {
  $(`#${view}-popup`).html('');
}

function startNewManagerReservation() {
  toggleSearchResults();
  toggleNewManagerReservation();
  $('#manager-start-date').val(today.split('/').join('-'));
  $('.user').text(customer.name.split(' ')[0]);
  $(".select-new-reservation-date").css("display", "grid");
  $(".rooms-available-on-date").css("display", "none");
  $(".rooms-available-on-date").html("");
  $(".confirmation-message").css("display", "none");
  $(".date-error").css("display", "none");
}

function startNewReservation() {
  toggleNewReservation();
  $('#customer-start-date').val(today.split('/').join('-'));
  $(".select-new-reservation-date").css("display", "grid");
  $(".rooms-available-on-date").css("display", "none");
  $(".rooms-available-on-date").html("");
  $(".confirmation-message").css("display", "none");
  $(".date-error").css("display", "none");
}

function validateDate() {
  if (event.target.classList.contains("manager-continue-button")) {
    selectedDate = $('#manager-start-date').val();
  } else {
    selectedDate = $('#customer-start-date').val();
  }
  if (Number(selectedDate.split('-').join('')) >= Number(today.split('/').join(''))) {
    $(".select-new-reservation-date").css("display", "none");
    $(".rooms-available-on-date").css("display", "grid");
    $(".rooms-available-on-date").html("");
    hotel.findAvailableRooms("newReservation", selectedDate.split('-').join('/'));
  } else {
    $(".date-error").css("display", "flex");
  }
}

function restartReservation() {
  $('#manager-start-date').val(today.split('/').join('-'));
  $('#customer-start-date').val(today.split('/').join('-'));
  $(".select-new-reservation-date").css("display", "grid");
  $(".rooms-available-on-date").css("display", "none");
  $(".rooms-available-on-date").html("");
  $(".date-error").css("display", "none");
}

function findCheckedRoomTypes() {
  $('.vacancies').children().each(function() {
    $(this).removeClass('toggle-off');
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
      $(`.${a.number}`).addClass("toggle-off");
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
  $(".reserved-date").text(`${formatDate(selectedDate.split('-').join('/'))}`);
  logReservation(reservedRoom)
}

function logReservation(room) {
  let reservation = {userID: Number(customer.id), date: selectedDate.split('-').join('/'), roomNumber: Number(room.number)}
  customer.addReservation(reservation);
  customer.findAmountSpent(rooms);
  manager.addReservation(reservation);
  manager.updateHotelReservations();
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

function findUserInfo() {
  if (!$('.user-search').val()) {
    $(".user-search-error").css("display", "flex");
  } else {
    let results = [];
    users.forEach(u => {
      if (u.name.toUpperCase() === $('.user-search').val().toUpperCase() || Number($('.user-search').val()) === u.id) {
        results.push(u);
      }
    })
    if (results.length === 0) {
      lookForFirstOrLastName();
    } else {
      $('.user-search').val('');
      findUserDetails(results);
    }
  }
}

function lookForFirstOrLastName() {
  let results = [];
  let splitName = $('.user-search').val().toUpperCase().split(' ');
  splitName.forEach(n => users.forEach(u => {
    if (u.name.toUpperCase().split(' ').includes(n)) {
      results.push(u);
    }
  }));
  if (results.length === 0) {
    $(".user-search-error").css("display", "flex");
  } else {
    $('.user-search').val('');
    findUserDetails(results);
  }
}

function findUserDetails(userInfo) {
  if (userInfo.length > 1) {
    selectUserFromResults(userInfo);
  } else {
    let foundReservations = hotel.findReservations("userID", userInfo[0].id);
    populateUserResults(foundReservations);
  }
  toggleSearchResults();
}

function findCheckedUser() {
  let selectedUsers = [];
  $("input[type=checkbox][class=user-results]:checked").each(function() {
    selectedUsers.push($(this).val());
  });
  if (selectedUsers.length > 1) {
    $('.select-user-error').css("display", "block");
  } else {
    let foundReservations = hotel.findReservations("userID", Number(selectedUsers[0]))
    populateUserResults(foundReservations);
  }
}

function selectUserFromResults(userInfo) {
  $('#search-results-popup').html('');
  $('#search-results-popup').append("<button class='exit-button' id='exit-search-results' type='button' name='exit-button'>X</button>");
  $('#search-results-popup').append("<h3>There are multiple results for your search. Which user were you looking for?</h3>");
  $('#search-results-popup').append("<ul class='found-users'></ul>");
  userInfo.forEach(u => $('.found-users').append(`<li class='users-to-select'><input type='checkbox' class="user-results" value='${u.id}'><label for='user-results'>${u.name}</label></li>`));
  $("#search-results-popup").append('<h3 class="error select-user-error">Please select 1 user.</h3>');
  $('#search-results-popup').append("<button class='select-user-button' type='button' name='select-user-button'>Select User</button>");
}

function populateUserResults(reservationList) {
  $('#search-results-popup').html('');
  $('#search-results-popup').append("<button class='exit-button' id='exit-search-results' type='button' name='exit-button'>X</button>");
  $('#search-results-popup').append("<img src='images/GOTIT.png' alt='the words got it in neon letters' class='confirmation-img'>");
  findCustomer(reservationList);
}

function findCustomer(reservationList) {
  customer = customers.find(c => c.id === Number(reservationList[0].userID));
  customer.reservations = hotel.findReservations("userID", customer.id);
  customer.updateReservedRooms(rooms);
  customer.findAmountSpent(rooms);
  populateCustomerInfo(reservationList);
}

function populateCustomerInfo(reservationList) {
  $('#search-results-popup').append(`<h3 class="user-info"><span>Name</span> ${customer.name}, <span>ID</span> ${reservationList[0].userID}, <span>Amount Spent</span> $ ${(customer.amountSpent).toFixed(2)}</h3>`);
  $('#search-results-popup').append("<div class='search-results-buttons'><button class='manager-new-reservation-button' type='button' name='new-reservation-button'>Add Reservation</button></div>");
  $('.search-results-buttons').append("<button class='delete-reservation-button' type='button' name='delete-reservation-button'>Delete Reservation</button>");
  findCustomerReservations(reservationList);
}

function findCustomerReservations(reservationList) {
  reservationList.sort((a, b) => new Date(a.date) - new Date(b.date));
  let details = reservationList.map(r => {
    return {date: formatDate(r.date), number: r.roomNumber, id: r.id};
  });
  populateCustomerReservationInfo(details);
}

function populateCustomerReservationInfo(details) {
  $('#search-results-popup').append("<ul class='found-reservations'><h4>Reservations:</h4></ul>");
  details.forEach(d => $('.found-reservations').append(`<li class="no-checkbox-list">Date: ${d.date}, Room: ${d.number}</li>`));
  details.forEach(d => $('.found-reservations').append(`<li class="checkbox-list" id='${d.id}'><input type='checkbox' class='specific-reservation' value='${d.id}'><label for='specific-reservation'>Date: ${d.date}, Room: ${d.number}</label></li>`));
}

function addCheckboxesToReservations() {
  $('.no-checkbox-list').css("display", "none");
  $('.checkbox-list').css("display", "block");
  $('.found-reservations').append("<button class='select-reservation-to-delete-button' type='button' name='select-reservation-to-delete-button'>Delete Selected Reservation</button>");
  $('#search-results-popup').append('<h3 class="error reservation-error1">You can only delete one reservation at a time.</h3>');
  $('#search-results-popup').append('<h3 class="error reservation-error2">Please select a reservation to delete.</h3>');
  $('#search-results-popup').append('<h3 class="error reservation-error3">Past reservations can not be removed. Please select an upcoming reservation to delete.</h3>');
}

function findCheckedReservation() {
  $('.error').css("display", "none");
  let selectedReservation = [];
  $("input[type=checkbox][class=specific-reservation]:checked").each(function() {
    selectedReservation.push($(this).val());
  });
  if (selectedReservation.length > 1) {
    $('.reservation-error1').css("display", "block");
  } else if (selectedReservation.length === 0) {
    $('.reservation-error2').css("display", "block");
  } else {
    let foundReservation = hotel.findReservations("id", selectedReservation[0])
    validateDeleteDate(foundReservation[0]);
  }
}

function validateDeleteDate(reservation) {
  if (Number(reservation.date.split('/').join('')) >= Number(today.split('/').join(''))) {
    removeReservation(reservation);
  } else {
    $('.reservation-error3').css("display", "block");
  }
}

function removeReservation(reservation) {
  customer.removeReservation(reservation);
  customer.findAmountSpent(rooms);
  manager.removeReservation(reservation);
  manager.updateHotelReservations();
  deleteReservationData(reservation);
  $('.found-reservations').css("display", "none");
  $('.user-info').css("display", "none");
  $('.search-results-buttons').css("display", "none");
  $('#search-results-popup').append(`<div class='deleted-message'><h2><span>${customer.name.split(' ')[0]}'s</span> reservation for <span>${formatDate(reservation.date)}</span>, Room <span>${reservation.roomNumber}</span> has been removed.</h2></div>`);
}

function deleteReservationData(reservation) {
  return fetch('https://fe-apps.herokuapp.com/api/v1/overlook/1904/bookings/bookings', {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      id: `${reservation.id}`
    })
  })
}
