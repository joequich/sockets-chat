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
        callback(persons);
    });
});