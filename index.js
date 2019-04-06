var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
    res.sendFile(__dirname + '/static/index.html');
});

function randomId(checkList) {
    let newId = 0;
    do {
        newId = Date.now();
    } while (newId in checkList);
    return newId;
}

let users = {};
let games = {};

io.on('connection', function(socket) {
    console.log(socket.id);
    const userId = randomId(users);
    let gameId = 0;
    users[userId] = {
        _id: userId,
        socket: socket,
    };
    socket.emit('setId', userId);

    socket.on('disconnect', function() {
        console.log('disconnect');
        delete userId[userId];
        if (gameId) {
            const index = games[gameId].indexOf(gameId);
            if (index > -1) {
                games.splice(index, 1);
            }
        }
    });

    socket.on('setName', function(name) {
        console.log(`setName: ${name}`);
        users[userId].name = name;
    });

    socket.on('createGame', function() {
        console.log('createGame');
        gameId = randomId(games);
        games[gameId] = [ userId ];
        users[userId].gameId = gameId;
    });

    socket.on('joinGame', function(id) {
        console.log(`joinGame: ${id}`);
        if (id in games) {
            games[id].append(userId);
            users[userId].gameId = gameId;
        } else {
            return false;
        }
        return games[id];
    });

    socket.on('exitGame', function() {
        console.log('exitGame');
        if (gameId in games) {
            // remove user from game
            const index = games.indexOf(userId);
            if (index > -1) {
                games.splice(index, 1);
            }
        }
        return false;
    });

    socket.on('startGame', function() {
        let game = build_game(T_size, D_dimensions);
        let gameId = randomId();
        games[gameId] = game;
        let dim = 0;
        for (let gameUserId in games[gameId].playersIds) {

            let dim_x = dim % D_dimensions;
            let dim_y = (dim+1) % D_dimensions;

            users[gameUserId].dim_x = dim_x;
            users[gameUserId].dim_y = dim_y;

            let gameUser = users[gameUserId];

            let userSocket = gameUser.socket;
            let userInfo = newInfo(gameUser, game);
            userSocket.emit('new info', userInfo);
            ++dim;
        }
    });

    socket.on('left', function() {
        makeMovementAndNewInfo(users[userId], games[gameId], 'left');
    });
    socket.on('right', function () {
        makeMovementAndNewInfo(users[userId], games[gameId], 'right');
    });
    socket.on('up', function() {
        makeMovementAndNewInfo(users[userId], games[gameId], 'up');
    });
    socket.on('down', function () {
        makeMovementAndNewInfo(users[userId], games[gameId], 'down');
    });

});

io.on('connection', function(socket) {


});

function makeMovementAndNewInfo(user, game, movement) {
    let dim_x = user.dim_x;
    let dim_y = user.dim_y;

    if (movement === 'left') {
        game.position[dim_x] -= 1;
    }
    else if (movement === 'right') {
        game.position[dim_x] += 1;
    }
    else if (movement === 'up') {
        game.position[dim_y] += 1;
    }
    else if (movement === 'down') {
        game.position[dim_y] -= 1;
    }

    for (let userId in game.playersIds) {
        let user = users[userId];
        let userSocket = user.socket;
        let userInfo = newInfo(user, game);
        userSocket.emit('new info', userInfo);
    }
}

function newInfo(user, game) {
    let dim_x = user.dim_x;
    let dim_y = user.dim_y;
    let maze = game.maze;
    let position = game.position;
    let goal = game.goal;

    let userInfo = {
        blocks: game.t,
        dimensions: game.d,
        map: get_projection(maze, position, dim_x, dim_y),
        position: [position[dim_x], position[dim_y]],
        goal: {
            position: [goal[dim_x], goal[dim_y]],
            same_proj: isOnSameProjection(position, goal, dim_x, dim_y)
        },
        overall: {
            player: position,
            goal: goal
        },
        coordinates: [dim_x, dim_y]
    }

    return userInfo;
}

function isOnSameProjection(position, goal, dim_x, dim_y) {
    for (let i = 0; i < D_dimensions; ++i) {
        if (i !== dim_x && i !== dim_y && position[i] !== goal[i])
            return false;
    }
    return true;
}

http.listen(port, function(){
    console.log(`listening on *:${port}`);
});
