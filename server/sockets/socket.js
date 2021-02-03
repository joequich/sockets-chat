const {io} = require('../server');
const { Users } = require('../classes/users');

const users = new Users();

io.on('connection', (client) => {
    client.on('enterChat', (data, callback) => {
        if(!data.name) {
            return callback({
                error: true,
                message: 'Name is require'
            });
        }

        let persons = users.addPerson(client.id, data.name);
        
        client.broadcast.emit('listPersons', users.getPersons());
        callback(persons);
    });

    client.on('disconnect', () => {
        let deletedPerson = users.deletePerson(client.id);
        client.broadcast.emit('createMessage', { user: 'Administrator', message: `${deletedPerson.name} left the chat.`})
        client.broadcast.emit('listPersons', users.getPersons());
    });
});