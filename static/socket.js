const connection = 'http://localhost:3000/';
const messages = [
  'left',
  'up',
  'right',
  'down'
];

$(function () {
  let socket = io(connection);
  let mov, message;
  $('body').append(`<p>Goal: (${level.overall.goal})</p>`);
  $('#position').text(`Current overall position: (${level.overall.player})`);

  $("body").keypress(function(event) {
    mov = [0, 0];

    switch(event.which) {
      case 97:
        mov = [-1, 0];
        message = 0;
        break;
      case 119:
        mov = [0, -1];
        message = 1;
        break;
      case 100:
        mov = [1, 0];
        message = 2;
        break;
      case 115:
        mov = [0, 1];
        message = 3;
        break;
    }

    if (can_move(level.position, mov, level.map)) {
      socket.emit(messages[message]);
      level.position = vec_sum(level.position, mov);
      vec_sum_coord(level.coordinates, level.overall.player, mov);
    }
  });

  socket.on('new info', function(msg){
    $('#position').text(`Current overall position: (${level.overall.player})`);
  });
});