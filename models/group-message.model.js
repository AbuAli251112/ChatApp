const mongoose = require("mongoose");
const connectDB = require('../config/database');
require('dotenv').config();

const messageSchema = mongoose.Schema({
    group: { type: mongoose.Schema.Types.ObjectId, ref: "group" },
    content: String,
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    timestamp: Number
});

const Message = mongoose.model("group-message", messageSchema);

exports.getMessages = async groupId => {
    try {
        await connectDB(process.env.MONGO_URL);
        let messages = await Message.find({ group: groupId }, null, {
            sort: {
                timestamp: 1
            }
        })
            .populate({
                path: "group", 
                model: "group",
                populate: {
                    path: "users",
                    model: "user",
                    select: "username image"
                }
            })
            .populate({
                path: "sender",
                model: "user",
                select: "username image"
            });
        mongoose.disconnect();
        return messages;
    } catch (error) {
        console.log(error);
        mongoose.disconnect();
        throw new Error(error);
    }
};

exports.newMessage = async msg => {
    try {
        await  connectDB(process.env.MONGO_URL);
        msg.timestamp = Date.now();
        let newMsg = new Message(msg);
        await newMsg.save();
        mongoose.disconnect;
        return;
    } catch (error) {
        console.log(error);
        mongoose.disconnect();
        throw new Error(error);
    }
};