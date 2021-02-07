var socket = io();

if(!params.has('name') || !params.has('room')) {
    window.location = 'index.html';
    throw new Error('Name and chat room are require');
}

var user = {
    name: params.get('name'),
    room: params.get('room')
}

// on - listen information
socket.on('connect', function() {
    console.log('Connected to the server');

    socket.emit('enterChat', user, function(resp) {
        renderUser(resp);
    });
});

socket.on('disconnect', function() {
    console.log('We lost connection with the server');
});

// on - listen information
socket.on('createMessage', function(message) {
    renderMessage(message,false);
    scrollBottom(false);
});

// listen hwen a user enter or left the chat
socket.on('listPersons', function(persons) {
    renderUser(persons);
});


// private messages
socket.on('privateMessage', function(message) {
    console.log('Private Message',message);
});