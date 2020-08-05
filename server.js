const http = require('http');
const express = require('express');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

const { addUser, removeUser, getUser, listUsersInRoom } = require('./users');

app.use(cors());

app.get('/', (req, res) => {
    res.send({ response: 'Server is up and running.' }).status(200);
});

// Specify socket for user
io.on('connection', (socket) => {
    console.log('New connection');
    socket.on('join-room', ({ name, roomId, peerId }, callback) => {
        const { error, user } = addUser({
            id: socket.id,
            name,
            roomId,
            peerId,
        });

        if (error) callback(error);

        socket.emit('message', {
            user: '',
            text: 'You joined the room.',
            sentAt: new Date().toJSON().slice(11, 16),
        });

        socket.broadcast.to(user.roomId).emit('message', {
            user: '',
            text: `${user.name} has joined.`,
            sentAt: new Date().toJSON().slice(11, 16),
        });

        socket.to(user.roomId).broadcast.emit('user-connected', user.peerId);

        socket.join(user.roomId);

        io.to(user.roomId).emit('roomData', {
            roomId: user.roomId,
            users: listUsersInRoom(user.roomId),
        });

        callback();
    });

    socket.on('send-message', (message, callback) => {
        const user = getUser(socket.id);
        io.to(user.roomId).emit('message', {
            user: user.name,
            text: message,
            sentAt: new Date().toJSON().slice(11, 16),
        });

        callback();
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if (user) {
            socket
                .to(user.roomId)
                .broadcast.emit('user-disconnected', user.peerId);
            io.to(user.roomId).emit('message', {
                user: '',
                text: `${user.name} has left.`,
            });
            io.to(user.roomId).emit('roomData', {
                roomId: user.roomId,
                users: listUsersInRoom(user.roomId),
            });
        }
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
