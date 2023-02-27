const mongoose = require("mongoose");
const connectDB = require('../config/database');
require('dotenv').config();

const groupSchema = mongoose.Schema({
    name: String,
    image: { type: String, default: "default-group-image.png" },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }]
});

const Group = mongoose.model("group", groupSchema);

exports.createGroup = async data => {
    try {
        await connectDB(process.env.MONGO_URL);
        let group = new Group(data);
        let groupData = await group.save();
        mongoose.disconnect();
        return groupData._id;
    } catch (error) {
        console.log(error);
        mongoose.disconnect();
        throw new Error(error);
    }
};

exports.getUserGroups = async userId => {
    try {
        await connectDB(process.env.MONGO_URL);
        let groups = await Group.find({
            users: {
                $all: [userId]
            }
        });
        await mongoose.disconnect();
        return groups;
    } catch (error) {
        console.log(error);
        mongoose.disconnect();
        throw new Error(error);
    }
};

exports.getGroupInfo = async groupId => {
    try {
        await connectDB(process.env.MONGO_URL);
        let group = await Group.findById(groupId).populate({
            path: "users",
            model: "user",
            select: "username image"
        });
        mongoose.disconnect();
        return group;
    } catch (error) {
        console.log(error);
        mongoose.disconnect();
        throw new Error(error);
    }
};