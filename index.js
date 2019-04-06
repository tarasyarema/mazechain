var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 8081;

var template_dir = __dirname;

app.get('/', function(req, res){
    res.sendFile(template_dir + '/index.html');
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
    io.emit('setId', userId);

    socket.on('disconnect', function() {
        console.log('disconnect');
        let index = delete userId[userId];
        if (index > -1) {
            users.splice(index, 1);
        }
        if (gameId) {
            index = games[gameId].indexOf(gameId);
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
});

http.listen(port, function(){
    console.log(`listening on *:${port}`);
});
