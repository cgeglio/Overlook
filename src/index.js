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
let reservations = [];
let rooms = [];
let today;
let user;
let users = [];

$(document).on('click', '#customer-popup #customer-exit-button', function(){
  toggleCustomerPopup();
});
$(document).on('click', '#manager-popup #manager-exit-button', function(){
  toggleManagerPopup();
});

$('.customer-shield').click(toggleCustomerPopup);
$('.login').keyup(checkInputs);
$('.logout-button').click(resetAfterLogout);
$('.manager-shield').click(toggleManagerPopup);
$('.revenue-details-button').click(viewRevenue);
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
  $('header').css("display", "flex");
  $(`.${loginType}-view`).css("display", "flex");
  populateDashboard(loginType);
}

function resetAfterLogout() {
  $('.login-info').css("display", "flex");
  $(".login-error").css("display", "none");
  $('.customer-view').css("display", "none");
  $('.manager-view').css("display", "none");
  $('header').css("display", "none");
  $('.login-input').val('');
  $(".submit#active").removeAttr('id');
}

function populateDashboard(loginType) {
  if (loginType === 'manager') {
    displayDate();
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
  $('.user-name').text(user.name.split(' ')[0]);
  user.reservations = hotel.findReservations("userID", user.id);
  user.reservedRooms = user.reservations.reduce((acc, res) => {
    let room = hotel.rooms.find(r => r.number === res.roomNumber);
      if (!acc.includes(room)) {
        acc.push(room)
      }
    return acc ;
  }, [])
  user.findAmountSpent();
}

function viewReservations() {
  clearPopup("customer");
  user.viewReservationDetails("reservations");
  toggleCustomerPopup();
}

function viewCosts() {
  clearPopup("customer");
  user.viewReservationDetails("costs");
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

function clearPopup(view) {
  $(`#${view}-popup`).html('');
}
