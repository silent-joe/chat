var wsocket;
var serviceLocation = "ws://webchat777-kickspring.rhcloud.com:8000/chat/";
var $nickName;
var $message;
var $chatWindow;
var room = '';
var audio = new Audio('resource/sound/hello.ogg');
audio.autoplay = true;

function onMessageReceived(evt) {
    var msg = JSON.parse(evt.data);
    var $messageLine = $('<tr><td class="received">' + msg.received
        + '</td><td  class="user2"><div class="user">' + msg.sender
        + '</div></td><td class="message">' + msg.message
        + '</td></tr><tr></tr>');
    document.getElementById('scroll').scrollTop = 10000000;
    var audio = new Audio('resource/sound/message.ogg');
    audio.autoplay = true;
    $chatWindow.append($messageLine);
}


function sendMessage() {
    var msg = '{"message":"' + $message.val() + '", "sender":"'
        + $nickName.val() + '", "received":""}';
    wsocket.send(msg);
    $message.val('').focus();
}

function connectToChatserver() {
    room = $('#chatroom option:selected').val();
    wsocket = new WebSocket(serviceLocation + room);
    wsocket.onmessage = onMessageReceived;
    var audio = new Audio('resource/sound/openchat.ogg');
    audio.autoplay = true;
}

function leaveRoom() {
    wsocket.close();
    $chatWindow.empty();
    $('.chat-wrapper').hide();
    $('.chat-signin').show();
    var audio = new Audio('resource/sound/leaveroom.ogg');
    audio.autoplay = true;
    $nickName.focus();
}

$(document).ready(function() {
    $nickName = $('#nickname');
    $message = $('#message');
    $chatWindow = $('#response');
    $('.chat-wrapper').hide();
    $nickName.focus();

    $('#enterRoom').click(function(evt) {
        evt.preventDefault();
        connectToChatserver();
        $('.chat-wrapper h2').text('Chat # '+$nickName.val() + "@" + room);
        $('.chat-signin').hide();
        $('.chat-wrapper').show();
        $message.focus();
    });
    $('#do-chat').submit(function(evt) {
        evt.preventDefault();
        sendMessage()
    });

    $('#leave-room').click(function(){
        leaveRoom();
    });
});