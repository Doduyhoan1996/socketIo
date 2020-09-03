var socket = io('http://localhost:3000');
socket.on('sever-send-message', function(data) {
    console.log(socket)
    if ( data.message ) {
        var class_mess = ( data.socket_id == socket.id ) ? 'message-me' : '';
        var message = "<div class='" + class_mess + "'><span></span><span> " + data.message + "</span></div>";
        $('#content').append(message);
    }
    
});

socket.on('sever-send-color', function(color) {
    $('#content').css("background-color", color);
});

$(document).ready(function(){
    
    $('#action_menu_btn').click(function(){
        $('.action_menu').toggle();
    });

    $('#sendMessage').click(function(){
        sendMessage();
    });

    $('#message').keypress(function(){
        if ( event.which == 13 ) {
            sendMessage();
        }
    });

    function sendMessage(){
        var message = $('#message').val();
        socket.emit('client-send-message', message);
        $('#message').val('');
    }

    $('.change-color').click(function(){
        var color = $(this).css('background-color');
        socket.emit('client-send-color', color);
    });
});
