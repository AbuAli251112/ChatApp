const userModel = require('../models/user.model');

exports.getHome = (req, res) => {
    res.render('index', {
        pageTitle: 'home',
        isUser: req.session.userId,
        myId: req.session.userId,
        friendRequests: req.friendRequests
    });
};

exports.getFriends = (req, res, next) => {
    userModel.getFriends(req.session.userId).then(friends => {
        res.render("friends", {
            pageTitle: "Friends",
            isUser: req.session.userId,
            friendRequests: req.friendRequests,
            friends: friends,
            myId: req.session.userId,
        });
    }).catch(err => {
        res.redirect("/error");
    });
}

exports.getSearch = (req, res, next) => {
    if (!req.query.name) {
        res.render('search', {
            pageTitle: "Search",
            isUser: req.session.userId,
            friendRequests: req.friendRequests,
            users: null,
            searchMode: false,
            myId: req.session.userId
        })
    } else {
        userModel.getUsers({ username: {
            $regex: new RegExp("^" + req.query.name, "i")
        }}).then(users => {
            res.render('search', {
                pageTitle: "Search",
                isUser: req.session.userId,
                friendRequests: req.friendRequests,
                users: users,
                searchMode: true,
                myId: req.session.userId
            })
        }).catch(err => {
            res.redirect("/error");
        })
    }
};