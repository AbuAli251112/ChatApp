const express = require('express');
const authGuard = require('./guards/auth.guard');
const friendController = require('../controllers/friend.controller');

const router = express.Router();

// router.post('/add', authGuard.isAuth, friendController.add);

router.post('/cancel', authGuard.isAuth, friendController.cancel);

router.post('/accept', authGuard.isAuth, friendController.accept);

router.post('/reject', authGuard.isAuth, friendController.reject);

router.post('/delete', authGuard.isAuth, friendController.delete);

module.exports = router;


