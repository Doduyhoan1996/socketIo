var socket = io('http://localhost:3000');
socket.on('sever-send-message', function(data) {
    console.log(socket)
    if ( data.message ) {
        var templateMessage = $('template#templateMessage').html();
        var place = (data.socket_id == socket.id) ? 'end' : 'start';
        var class_message = (data.socket_id == socket.id) ? 'msg_cotainer_send' : 'msg_cotainer';

        templateMessage = templateMessage.replace(new RegExp('{{place}}', 'g'), place);
        templateMessage = templateMessage.replace(new RegExp('{{class_message}}', 'g'), class_message);
        templateMessage = templateMessage.replace(new RegExp('{{message}}', 'g'), data.message);
        
        $('#content').append(templateMessage);

        $('#content').animate({ scrollTop: $("#content div").last().offset().top },'slow');

    }
    
});

socket.on('sever-send-color', function(color) {
    $('#content').css("background-color", color);
});

socket.on('sever-send-room', function(data) {
    $('#list-room').html('');
    data.map(function(room) {
        var templateRoom = $('template#templateRoom').html();
        templateRoom = templateRoom.replace(new RegExp('{{name_room}}', 'g'), room);
        $('#list-room').append(templateRoom);
    });

});

socket.on('sever-send-room-socket', function(data) {
    $('.msg_head .name_room').html('Chat Room '+ data);
    
    $('#list-room .name_room').each(function(index) {
        if ($(this).text() == data){
            $(this).parents('li:first').addClass('active');
        }
    })
});

socket.on('sever-send-errors', function(data) {
    alert(data);
});

$(document).ready(function(){
    
    $('#action_menu_btn').click(function(){
        $('.action_menu').toggle();
    });

    $('.create_room').click(function(){
        var room_name = $('#create_name_room').val();
        if (room_name) {
            socket.emit('create-room', room_name );
            $('#create_name_room').val('');
        }
        
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
