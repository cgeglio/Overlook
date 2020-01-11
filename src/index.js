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
  hotel.reservations.push({date: '2020/01/28', roomNumber: 14});
  //Note: This reservation was manually added to test for no available rooms
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
  $("input[type=checkbox]:checked").each(function() {
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
  $("input[type=checkbox]:checked").each(function() {
      $(this).prop('checked', false);
    });
}


// function findCheckedBoxes() {
//   let tagCheckboxes = document.querySelectorAll(".checked-tag");
//   let checkboxInfo = Array.from(tagCheckboxes)
//   let selectedTags = checkboxInfo.filter(box => {
//     return box.checked;
//   })
//   findTaggedRecipes(selectedTags);
// }
//
// function findTaggedRecipes(selected) {
//   let filteredResults = [];
//   selected.forEach(tag => {
//     let allRecipes = recipes.filter(recipe => {
//       return recipe.tags.includes(tag.id);
//     });
//     allRecipes.forEach(recipe => {
//       if (!filteredResults.includes(recipe)) {
//         filteredResults.push(recipe);
//       }
//     })
//   });
//   showAllRecipes();
//   if (filteredResults.length > 0) {
//     filterRecipes(filteredResults);
//   }
// }
//
// function filterRecipes(filtered) {
//   let foundRecipes = recipes.filter(recipe => {
//     return !filtered.includes(recipe);
//   });
//   hideUnselectedRecipes(foundRecipes)
// }
//
// function hideUnselectedRecipes(foundRecipes) {
//   foundRecipes.forEach(recipe => {
//     let domRecipe = document.getElementById(`${recipe.id}`);
//     domRecipe.style.display = "none";
//   });
// }
