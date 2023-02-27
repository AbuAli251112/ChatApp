const express = require('express');
const authGuard = require('./guards/auth.guard');
const homeController = require('../controllers/home.controller');

const router = express.Router();

router.get('/', authGuard.isAuth, homeController.getHome);

// New 

router.get("/friends", authGuard.isAuth, homeController.getFriends);

router.get("/search", authGuard.isAuth, homeController.getSearch)

module.exports = router;