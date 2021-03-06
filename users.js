const users = [];

const addUser = ({ id, name, roomId, peerId }) => {
    name = name.trim().toLowerCase();
    roomId = roomId.trim().toLowerCase();

    // Check for existing user
    const existingUser = users.find(
        (user) => user.roomId === roomId && user.name === name
    );
    if(!name || !roomId) return { error: 'Username and room are required.' };
    if (existingUser) return { error: 'Username is taken.' };

    const user = { id, name, roomId, peerId };
    console.log(user);
    users.push(user);
    return { user };
};

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);

    if (index !== -1) return users.splice(index, 1)[0];
};

const getUser = (id) => users.find((user) => user.id === id);

const listUsersInRoom = (roomId) =>
    users.filter((user) => user.roomId === roomId);

module.exports = { addUser, removeUser, getUser, listUsersInRoom };
