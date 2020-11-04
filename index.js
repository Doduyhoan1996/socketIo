var express = require('express');
var mysql = require('mysql'); // include thêm module mysql
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
        if (data) {
            socket.join(data);
            socket.Room = data;
            var ArrRoom = [];
            for (r in socket.adapter.rooms ) {
                ArrRoom.push(r)
            }
            io.sockets.emit('sever-send-room', ArrRoom);
            socket.emit('sever-send-room-socket', data);
        } else {
            socket.emit('sever-send-errors', 'room name not found');
        }

    });

    socket.on('leave-room', function(data){
        socket.leave(data);
    });

    // socket.on('client-send-color', function(color){
    //     io.sockets.emit('sever-send-color', color );
    // });
});


// Tạo kết nối với Database
var conn = mysql.createConnection({
    database: 'nodejs_chat_app',
    host: "localhost",
    user: "root",
    password: "123456"
});
conn.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

// Viết câu truy vấn sql
var arrMember = [];
var sql = 'SELECT * FROM `member`';// Thực hiện câu truy vấn và show dữ liệu
conn.query(sql, function(error, result){
    if (error) throw error;
    // console.log('– USER TABLE — ' , result);
    result.map(function(row) {
        arrMember.push(row);
    });
});

app.get('/', function(req, res){
    // render Home
    res.render('home');
})