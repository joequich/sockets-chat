const {io} = require('../server');
const { Users } = require('../classes/users');
const { createMessage } = require('../util/util');

const users = new Users();

io.on('connection', (client) => {
    client.on('enterChat', (data, callback) => {
        if(!data.name || !data.room) {
            return callback({
                error: true,
                message: 'Name/Room is require'
            });
        }
        client.join(data.room);

        let persons = users.addPerson(client.id, data.name, data.room);
        
        client.broadcast.to(data.room).emit('listPersons', users.getPersonByRoom(data.room));
        callback(users.getPersonByRoom(data.room));
    });


    client.on('createMessage', (data) => {
        let person = users.getPerson(client.id);
        let message = createMessage(person.name, data.message);
        client.broadcast.to(person.room).emit('createMessage', message);
    });

    client.on('disconnect', () => {
        let deletedPerson = users.deletePerson(client.id);
        client.broadcast.to(deletedPerson.room).emit('createMessage', createMessage('Administrator', `${deletedPerson.name} left the chat.`));
        client.broadcast.to(deletedPerson.room).emit('listPersons', users.getPersonByRoom(deletedPerson.room));
    });

    // private messages
    client.on('privateMessage', data => {
        let person = users.getPerson(client.id);

        client.broadcast.to(data.to).emit('privateMessage', createMessage(person.name, data.message));
    });



});