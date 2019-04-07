var express = require('express');
const app = express();
var http = require('http').Server(app);
var path = require('path');
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var maze = require('./maze');

app.use(express.static(path.join(__dirname, 'static')));

function randomId(checkList) {
    let newId = 0;
    do {
        newId = Math.floor(Math.random()*1000);
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
        games[gameId] = {
            playersIds: [ userId ]
        };
        users[userId].gameId = gameId;
        socket.join(gameId);
        socket.emit('createGameCallback', {
            _id: gameId,
            user: {
                _id: userId,
                name: users[userId].name
            }
        });
    });

    socket.on('joinGame', function(id) {
        console.log(`joinGame: ${id}`);
        if (id in games) {
            games[id].playersIds.push(userId);
            gameId = id;
            users[userId].gameId = id;
            socket.to(id).emit('addCollab', {
                _id: userId,
                name: users[userId].name
            });
            socket.join(id);
            let collaborators = [];
            for (const index in games[id].playersIds) {
                const uid = games[id].playersIds[index];
                const u = users[uid];
                collaborators = [ ...collaborators, { _id: u._id, name: u.name }];
            }
            socket.emit('joinGameCallback', { _id: id, collaborators: collaborators });
        } else {
            socket.emit('joinGameCallback', false);
        }
    });

    socket.on('exitGame', function() {
        console.log('exitGame');
        if (gameId in games) {
            // remove user from game
            const index = games[gameId].indexOf(userId);
            if (index > -1) {
                games[gameId].splice(index, 1);
            }

        }
        socket.leave(gameId);
        socket.to(gameId).emit('removeCollab', userId);
        gameId = 0;
        users[userId].gameId = 0;
        socket.emit('exitGameCallback', false);
    });

    socket.on('startGame', function() {
        const D_dimensions = games[gameId].playersIds.length;
        games[gameId].game = maze.build_game(10, D_dimensions);
        let dim = 0;
        for (let index in games[gameId].playersIds) {
            const gameUserId = games[gameId].playersIds[index];

            let dim_x = dim % D_dimensions;
            let dim_y = (dim + 1) % D_dimensions;

            users[gameUserId].dim_x = dim_x;
            users[gameUserId].dim_y = dim_y;

            let gameUser = users[gameUserId];

            let userSocket = gameUser.socket;
            let userInfo = newInfo(gameUser, games[gameId].game);
            userSocket.emit('gameStarted', userInfo);
            ++dim;
        }
    });

    socket.on('movement', function(movement){
        makeMovementAndNewInfo(users[userId], games[gameId], movement);
    });

});

function makeMovementAndNewInfo(user, game, movement) {
    let dim_x = user.dim_x;
    let dim_y = user.dim_y;

    game.game.position[dim_x] += movement[0];
    game.game.position[dim_y] += movement[1];

    for (let index in game.playersIds) {
        let user = users[game.playersIds[index]];
        let userSocket = user.socket;
        let userInfo = newInfo(user, game.game);
        userSocket.emit('gameUpdated', userInfo);
    }
}

function newInfo(user, game) {
    let dim_x = user.dim_x;
    let dim_y = user.dim_y;
    let position = game.position;
    let goal = game.goal;

    return {
        blocks: game.t,
        dimensions: game.d,
        map: maze.get_projection(game.maze, position, dim_x, dim_y),
        position: [position[dim_x], position[dim_y]],
        goal: {
            position: [goal[dim_x], goal[dim_y]],
            same_proj: isOnSameProjection(position, goal, dim_x, dim_y, game.d)
        },
        overall: {
            player: position,
            goal: goal
        },
        coordinates: [dim_x, dim_y]
    };
}

function isOnSameProjection(position, goal, dim_x, dim_y, d) {
    for (let i = 0; i < d; ++i) {
        if (i !== dim_x && i !== dim_y && position[i] !== goal[i])
            return false;
    }
    return true;
}

http.listen(port, function(){
    console.log(`listening on *:${port}`);
});
