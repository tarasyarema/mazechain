const connection = 'http://localhost:3000/';

$(function () {
  var socket = io(connection);
  console.log(user.position);
  $("body").keypress(function(event) {
    console.log(event.which);
    switch(event.which) {
      case 97:
        --user.position[0];
        socket.emit('left');
        break;
      case 119:
        --user.position[1];
        socket.emit('up');
        break;
      case 100:
        ++user.position[0];
        socket.emit('right');
        break;
      case 115:
        ++user.position[1];
        socket.emit('down');
        break;
    }
    return false;
  });

  socket.on('new message', function(msg){
    level = msg;
    $('#position').text(msg);
  });
});