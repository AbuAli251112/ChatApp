const messageModel = require('../models/message.model');
const chatModel = require('../models/chat.model');

exports.getChat = (req, res) => {
    let chatId = req.params.id;
    messageModel.getMessages(chatId).then((messages) => {
        if (messages.length === 0) {
            chatModel.getChat(chatId).then((chat) => {
                let friendData = chat.users.find((user) => {
                    return user._id != req.session.userId;
                });
                res.render('chat', {
                    pageTitle: friendData.username,
                    isUser: req.session.userId,
                    myId: req.session.userId,
                    friendRequests: req.friendRequests,
                    messages: messages,
                    friendData: friendData,
                    chatId: chatId
                })
            });
        } else {
            let friendData = messages[0].chat.users.find((user) => {
                return user._id != req.session.userId;
            });
            res.render('chat', {
                pageTitle: friendData.username,
                isUser: req.session.userId,
                myId: req.session.userId,
                friendRequests: req.friendRequests,
                messages: messages,
                friendData: friendData,
                chatId: chatId
            })
        }
    }).catch((err) => {
        console.log(err);
    })
};