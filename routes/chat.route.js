const express = require('express');
const authGuard = require('./guards/auth.guard');
const chatController = require('../controllers/chat.controller');

const router = express.Router();

router.get('/:id', authGuard.isAuth, chatController.getChat);

module.exports = router;