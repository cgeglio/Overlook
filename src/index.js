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


$(document).on('click', '#customer-popup #customer-exit-button', () => domUpdates.toggleCustomerPopup());
$(document).on('click', '#customer-reservation-popup #exit-reservation-button', () => domUpdates.toggleNewReservation());
$(document).on('click', '#customer-reservation-popup .filter-button', () => findCheckedRoomTypes());
$(document).on('click', '#customer-reservation-popup .select-button', () => validateRoomSelected());
$(document).on('click', '#customer-reservation-popup .return-button', () => domUpdates.restartReservation(today));
$(document).on('click', '#manager-popup #manager-exit-button', () => domUpdates.toggleManagerPopup());
$(document).on('click', '#manager-reservation-popup #exit-manager-reservation-button', () => domUpdates.toggleNewManagerReservation());
$(document).on('click', '#manager-reservation-popup .filter-button', () => findCheckedRoomTypes());
$(document).on('click', '#manager-reservation-popup .return-button', () => domUpdates.restartReservation(today));
$(document).on('click', '#manager-reservation-popup .select-button', () => validateRoomSelected());
$(document).on('click', '#search-results-popup .delete-reservation-button', () => domUpdates.addCheckboxesToReservations());
$(document).on('click', '#search-results-popup #exit-search-results', () => domUpdates.toggleSearchResults());
$(document).on('click', '#search-results-popup .manager-new-reservation-button', () => startNewManagerReservation());
$(document).on('click', '#search-results-popup .select-user-button', () => findCheckedUser());
$(document).on('click', '#search-results-popup .select-reservation-to-delete-button', () => findCheckedReservation());


$('.customer-continue-button').click(validateDate);
$('.customer-shield').click(domUpdates.toggleCustomerPopup);
$('.login').keyup(checkInputs);
$('.logout-button').click(domUpdates.resetAfterLogout);
$('.manager-continue-button').click(validateDate);
$('.manager-shield').click(domUpdates.toggleManagerPopup);
$('.manager-reservation-shield').click(domUpdates.toggleNewManagerReservation);
$('.new-reservation-button').click(startNewReservation);
$('.reservation-shield').click(domUpdates.toggleNewReservation);
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
  domUpdates.displayDash(loginType);
  populateDashboard(loginType);
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
  domUpdates.clearPopup("customer");
  customer.viewReservationDetails("reservations");
  domUpdates.toggleCustomerPopup();
}

function viewCosts() {
  domUpdates.clearPopup("customer");
  customer.viewReservationDetails("costs");
  domUpdates.toggleCustomerPopup();
}

function viewAvailableRooms() {
  domUpdates.clearPopup("manager");
  hotel.findAvailableRooms("details", today);
  domUpdates.toggleManagerPopup();
}

function viewOccupiedRooms() {
  domUpdates.clearPopup("manager");
  hotel.calculatePercentageOccupied("details", today);
  domUpdates.toggleManagerPopup();
}

function viewRevenue() {
  domUpdates.clearPopup("manager");
  hotel.findRevenueDetails("date", today);
  domUpdates.toggleManagerPopup();
}

function startNewManagerReservation() {
  domUpdates.toggleSearchResults();
  domUpdates.toggleNewManagerReservation();
  domUpdates.resetForNewManagerReservation(today, customer);
}

function startNewReservation() {
  domUpdates.toggleNewReservation();
  domUpdates.resetForNewCustomerReservation(today);
}

function validateDate() {
  if (event.target.classList.contains("manager-continue-button")) {
    selectedDate = $('#manager-start-date').val();
  } else {
    selectedDate = $('#customer-start-date').val();
  }
  if (Number(selectedDate.split('-').join('')) >= Number(today.split('/').join(''))) {
    domUpdates.newDateReset();
    hotel.findAvailableRooms("newReservation", selectedDate.split('-').join('/'));
  } else {
    $(".date-error").css("display", "flex");
  }
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
    domUpdates.showRoomError1();
  } else if (checkedRoom.length === 0) {
    domUpdates.showRoomError2();
  }
}

function confirmReservation(roomNumber) {
  let reservedRoom = rooms.find(r => r.number === Number(roomNumber));
  domUpdates.showConfirmationMessage(roomNumber, selectedDate)
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
    domUpdates.selectUserFromResults(userInfo);
  } else {
    let foundReservations = hotel.findReservations("userID", userInfo[0].id);
    domUpdates.populateUserResults();
    findCustomer(foundReservations);
  }
  domUpdates.toggleSearchResults();
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
    domUpdates.populateUserResults();
    findCustomer(foundReservations);
  }
}

function findCustomer(reservationList) {
  customer = customers.find(c => c.id === Number(reservationList[0].userID));
  customer.reservations = hotel.findReservations("userID", customer.id);
  customer.updateReservedRooms(rooms);
  customer.findAmountSpent(rooms);
  domUpdates.populateCustomerInfo(reservationList, customer);
  findCustomerReservations(reservationList);
}

function findCustomerReservations(reservationList) {
  reservationList.sort((a, b) => new Date(a.date) - new Date(b.date));
  let details = reservationList.map(r => {
    return {date: domUpdates.formatDate(r.date), number: r.roomNumber, id: r.id};
  });
  domUpdates.populateCustomerReservationInfo(details);
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
  domUpdates.displayRemoveMessage(reservation, customer)
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
