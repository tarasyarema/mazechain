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
    window.location.href = '/';
  });

  $('#start').click(function () {
    socket.emit('startGame');
  });

  socket.on('gameStarted', function(initialGame){
    $('#room').hide()
    $('#game').show();

    $('#goal')    .text(`Goal: (${initialGame.overall.goal})`);
    $('#local')   .text(`Local: (${initialGame.position})`);
    $('#position').text(`Position: (${initialGame.overall.player})`);

    init(initialGame);
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

      if (can_move(level.position, mov, level.map)) {
        socket.emit('movement', mov);
      }
    });

    console.log('Game has started!');
    draw();
    $('#local').text(`Local: (${level.position})`);
    $('#position').text(`Position: (${level.overall.player})`);
  })

  socket.on('gameUpdated', function(updatedGame){
    init(updatedGame);
    console.log('game update');
    $('#local').text(`Local: (${level.position})`);
    $('#position').text(`Position: (${level.overall.player})`);
  });

  socket.on('finalPosition', function() {
    setTimeout( () => {
      alert("Congratulations!")
    }, 1000);
    window.location.href = "/";
  });

  socket.on('disconnected', function() {
    console.log('Socket close.');
    socket.disconnect(true);
    window.location.href = "/";
  });
});
