var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});

var users = [];

io.on('connection', function(socket){
    socket.on('new user', function(username){
        socket.username = username;
        users.push(username);
        socket.broadcast.emit('new user', socket.username);
        console.log(socket.username + ' connected');
        socket.emit('current users', users);
    });

    socket.on('disconnect', function(){
        console.log(socket.username + ' disconnected');
        users.splice(users.indexOf(socket.username), 1);
        io.emit('user left', socket.username);
    });

    socket.on('chat message', function(msg){
        console.log(socket.username + ': ' + msg);
        io.emit('chat message', {username : socket.username, msg : msg});
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});