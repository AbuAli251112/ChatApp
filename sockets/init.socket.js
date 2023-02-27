module.exports = (io, socket) => {
    socket.on('joinNotificationsRoom', id => {
        socket.join(id);
        console.log('Joined', id);
    });
    socket.on('goOnline', id => {
        io.onlineUsers[id] = true;
        socket.on('disconnect', () => {
            io.onlineUsers[id] = false;
        })
    });
};