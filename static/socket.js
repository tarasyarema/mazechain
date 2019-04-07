$(function () {
  $('#makeGame').hide();
  $('#room').hide();
  $('#game').hide();

  var socket = io();
  let level;

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

    // if (level != undefined) {
    //   $('#game').append(`<p class="position">Goal: <b>(${level.overall.goal})</b></p>`);
    //   $('#position').text(`Current overall position: <b>(${level.overall.player})</b>`);
    // }

    $('body').keypress(function(event) {
      let mov = [0, 0];

      switch(event.which) {
        case 97:
          mov = [-1, 0];
          break;
        case 119:
          mov = [0, -1];
          break
        case 100:
          mov = [1, 0];
          break;
        case 115:
          mov = [0, 1];
          break;
      }
      
      // if (level != undefined)
      if (can_move(level.position, mov, level.map)) {
        console.log(`Socket.js: ${mov}`);
        socket.emit('movement', mov);
        level.position = vec_sum(level.position, mov);
        vec_sum_coord(level.coordinates, level.overall.player, mov);
      }
    });
  });

  socket.on('new info', function(msg){
    console.log('New info:');
    level = msg;
    console.log(level);
    init(level);
    $('#position').text(`Current overall position: (${level.overall.player})`);
  });
});
