const mongoose = require('mongoose');
const connectDB = require('../config/database');
require('dotenv').config();

const chatSchema = mongoose.Schema({
    users: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'user'
    }
});

const Chat = mongoose.model('chat', chatSchema);

exports.Chat = Chat;

exports.getChat = async chatId => {
    try {
        await connectDB(process.env.MONGO_URL);
        let chat = await Chat.findById(chatId).populate("users");
        return chat;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
};