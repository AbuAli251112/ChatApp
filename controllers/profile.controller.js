const userModel = require('../models/user.model');

exports.redirect = ((req, res) => {
    res.redirect('/profile/' + req.session.userId);
});

exports.getProfile = ((req, res) => {
    let id = req.params.id;
    if (!id) {
        return res.redirect('/profile/' + req.session.userId);
    }
    userModel.getUserData(id).then((data) => {
        res.render('profile', {
            pageTitle: data.username,
            isUser: true,
            friendRequests: req.friendRequests,
            myId: req.session.userId,
            myName: req.session.name,
            myImage: req.session.image,
            friendId: data._id,
            username: data.username,
            userImage: data.image,
            isOwner: id === req.session.userId,
            isFriends: data.friends.find(friend => friend.id === req.session.userId),
            isRequestSent: data.friendRequests.find(friend => friend.id === req.session.userId),
            isRequestRecieved: data.sentRequests.find(friend => friend.id === req.session.userId)
        });
    }).catch(err => {
        res.redirect('/error');
    });
});