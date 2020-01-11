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


$('#customer-exit-button').click(function() {
  togglePopup('customer')
});
$('.login').keyup(checkInputs);
$('.logout-button').click(resetAfterLogout);
$('#manager-exit-button').click(function() {
  togglePopup('manager')
});
$('.revenue-details-button').click(viewRevenue);
$('.shield').click(togglePopup);
$('.see-available-button').click(viewAvailableRooms);
$('.see-occupied-button').click(viewOccupiedRooms);
$('.see-reservations-button').click(viewReservations);
// $('.see-spent-button').click(viewCharges);
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

// function formatReservationDate(day) {
//   day = day.split('/').join('');
//   let y = day.split('').slice(0, 4).join('');
//   let m = day.split('').slice(4, 6).join('');
//   let d = day.split('').slice(6, 8).join('');
//   return `${monthNames[m -1]} ${d}, ${y}`;
// }

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
  hotel.calculateCost("userID", user.id);
  user.reservations = hotel.findReservations("userID", user.id);
  user.reservedRooms = user.reservations.reduce((acc, res) => {
    let room = hotel.rooms.find(r => r.number === res.roomNumber);
      if (!acc.includes(room)) {
        acc.push(room)
      }
    return acc ;
  }, [])
}

function viewReservations() {
  clearPopup("customer");
  user.viewReservationDetails();
  togglePopup("customer");
}

// function viewCharges() {
//   clearPopup();
//   $('#popup').append("<h2>All Charges</h2>");
//   $('#popup').append("<ul class='charges'></ul>")
//   let details = user.reservations.sort((a, b) => new Date(a.date) - new Date(b.date)).map(r => {
//     return `${formatReservationDate(r.date)}: Room ${r.roomNumber}, $${hotel.rooms.find(o => o.number === r.roomNumber).costPerNight}`
//   });
//   details.forEach(d=> $('.charges').append(`<li>${d}</li>`));
//   togglePopup();
// }

function viewAvailableRooms() {
  clearPopup("manager");
  hotel.findAvailableRooms("details", today);
  togglePopup("manager");
}

function viewOccupiedRooms() {
  clearPopup("manager");
  hotel.calculatePercentageOccupied("details", today);
  togglePopup("manager");
}

function viewRevenue() {
  clearPopup("manager");
  hotel.findRevenueDetails("date", today);
  togglePopup("manager");
}

function togglePopup(view) {
  if (document.getElementById("toggle")) {
    $(`.${view}-popup-window#toggle`).removeAttr('id');
  } else {
    $(`.${view}-popup-window`).attr('id', "toggle");
  }
  if (document.getElementById("overlay")) {
    $(".shield#overlay").removeAttr('id');
  } else {
    $('.shield').attr("id", "overlay");
  }
}

function clearPopup(view) {
  $(`.${view}-popup`).html(`<button id='${view}-exit-button' type='button' name='exit-popup-button'>X</button>`);
}
