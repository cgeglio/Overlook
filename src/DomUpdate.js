import $ from 'jquery';

class DomUpdate {

  displayAvailableRooms(rooms) {
    $('.rooms-available-today').text(rooms.length);
  }

}


export default DomUpdate;
