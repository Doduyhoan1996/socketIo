var express = require('express');
var app = express();
app.use(express.static('public')); 
app.set('view engine', 'ejs');
app.set('views', './views');


var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(3000);

io.on('connection', function (socket) {
    // console.log(socket.id + ' connection.' );

    // show rooms
    // console.log(socket.adapter.rooms);

    socket.on('disconnect', function(){
        // console.log(socket.id + ' disconnected!');
    });

    socket.on('client-send-message', function(message){
        var data = {
            socket_id: socket.id,
            message: message,
        }
        // emit tất cả
        // io.sockets.emit('sever-send-message', data );

        // emit in room
        console.log(socket.Room);
        io.sockets.in(socket.Room).emit('sever-send-message', data );

        // emit chính nó
        // socket.emit('sever-send-message', data );

        // emit tất cả trừ nó
        // socket.broadcast.emit('sever-send-message', data );


    });

    socket.on('create-room', function(data){
        socket.join(data);
        socket.Room = data;

        var ArrRoom = [];
        for (r in socket.adapter.rooms ) {
            ArrRoom.push(r)
        }
        io.sockets.emit('sever-send-room', ArrRoom);
        socket.emit('sever-send-room-socket', data)

    });

    socket.on('leave-room', function(data){
        socket.leave(data);
    });

    // socket.on('client-send-color', function(color){
    //     io.sockets.emit('sever-send-color', color );
    // });
});


app.get('/', function(req, res){
    res.render('home');
})