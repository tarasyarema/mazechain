var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var template_dir = __dirname + '/templates';

app.get('/', function(req, res){
    res.sendFile(template_dir + '/index.html');
});


io.on('connection', function(socket) {
    const user_id = random_id();
    assigned_ids[user_id] = socket;

    socket.on('disconnect', function(){
        if (!delete assigned_ids[user_id]) { throw new Error(); }
        console.log('user \'' + user_id + '\' disconnected -- remaining ' + Object.keys(assigned_ids).length);
    });

    const num_ids = Object.keys(assigned_ids).length;
    console.log('user \'' + user_id + '\' connected -- remaining ' + num_ids);
    if (num_ids === N_dimensions){
        for (const user_id in assigned_ids) {
            let sock = assigned_ids[user_id];
            sock.emit('game', 'ayy lmao');
        }
    }
});


var assigned_ids = {};
function random_id() {
    new_id = 0;
    do {
        new_id = 1+Math.floor(Math.random()*10000000);
    } while (new_id in assigned_ids);
    return new_id;
}

var N_dimensions = 3;


http.listen(3000, function(){
    console.log('listening on *:3000');
});