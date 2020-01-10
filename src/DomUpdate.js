import $ from 'jquery';

class DomUpdate {

  displayAvailableRooms(rooms) {
    $('.rooms-available-today').text(`${rooms.length} Available Rooms`);
  }

  displayRevenue(revenue) {
    $('.todays-revenue').text(`$${revenue} in Revenue Today`);
  }

  displayPercentageOccupied(occupied) {
    $('.rooms-occupied-today').text(`${occupied}% of Rooms are Occupied`);
  }

}


export default DomUpdate;
