const {sendFriendRequest, getFriends} = require('../models/user.model');

module.exports = (io, socket) => {
    socket.on('sendFriendRequest', data => {
        sendFriendRequest(data).then(() => {
            socket.emit('requestSent');
            io.to(data.friendId).emit('newFriendRequest', {name: data.myName, id: data.myId});
        }).catch(err => {
            console.log(err);
            socket.emit('requestFailed');
        });
    });
    socket.on('getOnlineFriends', id => {
        getFriends(id).then(Friends => {
            let onlineFriends = Friends.friends.filter(friend => {
                return io.onlineUsers[friend.id];
            });
            socket.emit('onlineFriends', onlineFriends);
        }).catch(err => {
            console.log(err);
        })
    });
};