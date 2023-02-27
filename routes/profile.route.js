const express = require('express');
const authGuard = require('./guards/auth.guard');
const profileController = require('../controllers/profile.controller');

const router = express.Router();

router.get('/', authGuard.isAuth, profileController.redirect);

router.get('/:id', authGuard.isAuth, profileController.getProfile);

module.exports = router;