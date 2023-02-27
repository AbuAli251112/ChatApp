const mongoose = require('mongoose');
const connectDB = require('../config/database');
require('dotenv').config();

const messgaeSchema = mongoose.Schema({
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'chat'
    },
    content: {
        type: String
    },
    sender: {
        type: String
    },
    timestamp: {
        type: Number
    }
});

const Message = mongoose.model('message', messgaeSchema);

exports.getMessages = async chatId => {
    try {
        let messages = await Message.find({chat: chatId}, null, {sort: {timestamp: 1}}).populate({
            path: 'chat',
            model: 'chat',
            populate: {
                path: 'users',
                model: 'user',
                select: 'username image'
            }
        });
        return messages;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
};

exports.newMessage = async msg => {
    try {
        await connectDB(process.env.MONGO_URL);
        msg.timestamp = Date.now();
        let newMsg = new Message(msg);
        await newMsg.save();
        return;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}