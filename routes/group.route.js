const express = require("express");
const authGuard = require("./guards/auth.guard");
const groupController = require("../controllers/group.controller");

const router = express.Router();

router.get("/", authGuard.isAuth, groupController.getUserGroups);

router.get("/create", authGuard.isAuth, groupController.getCreateGroup);

router.post("/create", authGuard.isAuth, groupController.postCreateGroup);

router.get("/:id", authGuard.isAuth, groupController.getGroup);

module.exports = router;