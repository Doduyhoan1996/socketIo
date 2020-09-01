var express = require('express');
var app = express();
app.use(express.static('public')); 
app.set('view engine', 'ejs');
app.set('views', './views');


var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(3000);

io.on('connection', function (socket) {
    console.log(socket.id + ' connection.' );

    socket.on('disconnect', function(){
        console.log(socket.id + ' disconnected!');
    });

    socket.on('client-send-message', function(message){
        // emit tất cả
        io.sockets.emit('sever-send-message', message );

        // emit chính nó
        // socket.emit('sever-send-message', message );

        // emit tất cả trừ nó
        // socket.broadcast.emit('sever-send-message', message );


    });

    socket.on('client-send-color', function(color){
        io.sockets.emit('sever-send-color', color );
    });
});


app.get('/', function(req, res){
    res.render('home');
})