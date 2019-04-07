const messages = [
  'left',
  'up',
  'right',
  'down'
];

$(function () {
  $('#makeGame').hide();
  $('#room').hide();
  $('#game').hide();

  var socket = io();


  // Listeners

  socket.on('setId', function(id) {
    console.log(`setId: ${id}`);
    document.cookie = `${id}`;
  });

  socket.on('addCollab', function(collab) {
    $('#collaborators_list').append(`<li id="${collab._id}">${collab.name}</li>`);
  });

  socket.on('removeCollab', function(uid) {
    console.log(uid);
    $('#collaborators_list').find(`#${uid}`).remove();
  });

  socket.on('createGameCallback', function(res) {
    console.log(res);
    $('#roomText').text(`Room: ${res._id}`);
    $('#collaborators_list').append(`<li id="${res.user._id}">${res.user.name}</li>`);
  });

  socket.on('joinGameCallback', function(res) {
    if (res) {
      console.log(res);
      $('#roomText').text(`Room: ${res._id}`);
      res.collaborators.forEach(collab => {
        $('#collaborators_list').append(`<li id="${collab._id}">${collab.name}</li>`);
      });
    } else {
      alert(`No game with ID: ${gameId}`);
    }
  });

  socket.on('exitGameCallback', function(res) {
    console.log(res);
    $('#collaborators_list').empty();
  });


  // Rooms

  $('#submit').click(function () {
    const name = $('#name').val();
    socket.emit('setName', name);
    $('#login').hide();
    $('#makeGame').show();
  });

  $('#create').click(function () {
    socket.emit('createGame');
    $('#makeGame').hide();
    $('#room').show();
  });

  $('#join').click(function () {
    const gameId = $('#game_id').val();
    socket.emit('joinGame', gameId);
    $('#makeGame').hide();
    $('#room').show();
  });

  $('#leave').click(function () {
    socket.emit('exitGame');
    $('#collaborators_list').empty();
    $('#room').hide();
    $('#makeGame').show();

  });

  $('#start').click(function () {
    socket.emit('startGame');
    $('#room').hide();
    $('#game').show();

    let mov, message;

    $('#game').append(`<p>Goal: (${level.overall.goal})</p>`);
    $('#position').text(`Current overall position: (${level.overall.player})`);

    $('body').keypress(function(event) {
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
        socket.emit('movement', mov);
        level.position = vec_sum(level.position, mov);
        vec_sum_coord(level.coordinates, level.overall.player, mov);
      }
    });
  });


  socket.on('new info', function(msg){
    console.log(`New info: ${msg}`);
    $('#position').text(`Current overall position: (${level.overall.player})`);
  });
});
