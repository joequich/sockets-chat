var socket = io();

var params = new URLSearchParams( window.location.search);

if(!params.has('name')) {
    throw new Error('Name is require');
}

var user = {
    name: params.get('name')
}

// on - listen information
socket.on('connect', function() {
    console.log('Connected to the server');

    socket.emit('enterChat', user, function(resp) {
        console.log('Online Users ', resp);
    });
});

socket.on('disconnect', function() {
    console.log('We lost connection with the server');
});

// emit - send information
socket.emit('sendMessage',{
    user: 'Joseph',
    message: 'Hello there'
}, function(resp) {
    console.log('Response server ', resp);
});

// on - listen information
socket.on('createMessage', function(message) {
    console.log('Server:',message);
});

// listen hwen a user enter or left the chat
socket.on('listPersons', function(message) {
    console.log('Persons:',message);
});
