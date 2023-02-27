const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./user.model").User;
const connectDB = require('../config/database');
require('dotenv').config();

exports.createNewUser = (username, email, password) => {

    return new Promise((resolve, reject) => {
        connectDB(process.env.MONGO_URL).then(() => {
            return User.findOne({ email: email })
        }).then(user => {
            if (user) {
                reject("email is used");
            } else {
                return bcrypt.hash(password, 10);
            }
        }).then((hashedPassword) => {
            let user = new User({
                username: username,
                email: email,
                password: hashedPassword
            });
            return user.save();
        }).then(() => {
            resolve();
        }).catch((err) => {
            reject(err);
        })
    });

};

exports.login = (email, password) => {

    return new Promise((resolve, reject) => {
        connectDB(process.env.MONGO_URL).then(() => {
            return User.findOne({ email: email })
        }).then((user) => {
            if (!user) {
                reject("there is no user matches this email");
            } else {
                bcrypt.compare(password, user.password).then(same => {
                    if (!same) {
                        reject("password is incorrect");
                    } else {
                        resolve(user);
                    }
                });
            }
        }).catch((err) => {
            reject(err);
        })
    });

};