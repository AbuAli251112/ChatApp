const mongoose = require("mongoose");
const connectDB = require('../config/database');
const Chat = require('./chat.model').Chat;
require('dotenv').config();

const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    image: { type: String, default: "default-user-image.png" },
    friends: {
        type: [{ name: String, image: String, id: String, chatId: String }],
        default: []
    },
    friendRequests: {
        type: [{ name: String, id: String }],
        default: []
    },
    sentRequests: {
        type: [{ name: String, id: String }],
        default: []
    }
});

const User = mongoose.model("user", userSchema);

exports.User = User;

exports.getUsers = async query => {
    try {
        await connectDB(process.env.MONGO_URL);
        let users = await User.find(query);
        return users;
    } catch(err) {
        mongoose.disconnect();
        throw new Error(error);
    }
};

exports.getUserData = (id => {
    return new Promise((resolve, reject) => {
        connectDB(process.env.MONGO_URL).then(() => {
            return User.findById(id)
        }).then(data => {
            resolve(data);
        }).catch(err => {
            reject(err);
        })
    });
});

exports.sendFriendRequest = async (data) => {
    try {
        await connectDB(process.env.MONGO_URL);
        await User.updateOne({_id: data.friendId}, {$push: {friendRequests: {name: data.myName, id: data.myId}}});
        await User.updateOne({_id: data.myId}, {$push: {sentRequests: {name: data.friendName, id: data.friendId}}});
        return;
    } catch (error) {
        throw new Error(error);
    }
}

exports.cancelFriendRequest = async (data) => {
    try {
        await connectDB(process.env.MONGO_URL);
        await User.updateOne({_id: data.friendId}, {$pull: {friendRequests: {id: data.myId}}});
        await User.updateOne({_id: data.myId}, {$pull: {sentRequests: {id: data.friendId}}});
        return;
    } catch (error) {
        throw new Error(error);
    }
}

exports.acceptFriendRequest = async (data) => {
    try {
        await connectDB(process.env.MONGO_URL);
        await User.updateOne({_id: data.friendId}, {$pull: {sentRequests: {id: data.myId}}});
        await User.updateOne({_id: data.myId}, {$pull: {friendRequests: {id: data.friendId}}});
        let newChat = new Chat({
            users: [data.myId, data.friendId]
        });
        let chatDoc = await newChat.save();
        await User.updateOne({_id: data.friendId}, {$push: {friends: {name: data.myName, id: data.myId, image: data.myImage, chatId: chatDoc._id}}});
        await User.updateOne({_id: data.myId}, {$push: {friends: {name: data.friendName, id: data.friendId, image: data.friendImage, chatId: chatDoc._id}}});
        return;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

exports.rejectFriendRequest = async (data) => {
    try {
        await connectDB(process.env.MONGO_URL);
        await User.updateOne({_id: data.friendId}, {$pull: {sentRequests: {id: data.myId}}});
        await User.updateOne({_id: data.myId}, {$pull: {friendRequests: {id: data.friendId}}});
        return;
    } catch (error) {
        throw new Error(error);
    }
}

exports.deleteFriend = async (data) => {
    try {
        await connectDB(process.env.MONGO_URL);
        await User.updateOne({_id: data.friendId}, {$pull: {friends: {id: data.myId}}});
        await User.updateOne({_id: data.myId}, {$pull: {friends: {id: data.friendId}}});
        return;
    } catch (error) {
        throw new Error(error);
    }
}

exports.getFriendRequests = async (id) => {
    try {
        await connectDB(process.env.MONGO_URL);
        let data = await User.findById(id, {friendRequests: true});
        return data.friendRequests;
    } catch (error) {
        throw new Error(error);
    }
}

exports.getFriends = async id => {
    try {
        await connectDB(process.env.MONGO_URL);
        let data = await User.findById(id, { friends: true });
        mongoose.disconnect();
        return data.friends;
    } catch (error) {
        mongoose.disconnect();
        throw new Error(error);
    }
};