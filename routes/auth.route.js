const router = require("express").Router();
const body = require("express-validator").body;
const authGuard = require("./guards/auth.guard");
const authController = require("../controllers/auth.controller");

router.get("/signup", authGuard.notAuth, authController.getSignup);

router.post(
    "/signup",
    authGuard.notAuth,
    body("username")
        .not()
        .isEmpty()
        .withMessage("username is required"),
    body("email")
        .not()
        .isEmpty()
        .withMessage("email is required")
        .isEmail()
        .withMessage("invalid format"),
    body("password")
        .not()
        .isEmpty()
        .withMessage("password is required")
        .isLength({ min: 6 })
        .withMessage("password must be at least 6 charachters"),
    body("confirmPassword").custom((value, { req }) => {
        if (value === req.body.password) return true;
        else throw "passwords dont equal";
    }),
    authController.postSignup
);

router.get("/login", authGuard.notAuth, authController.getLogin);

router.post(
    "/login",
    authGuard.notAuth,
    body("email")
        .not()
        .isEmpty()
        .withMessage("email is required")
        .isEmail()
        .withMessage("invalid format"),
    body("password")
        .not()
        .isEmpty()
        .withMessage("password is required")
        .isLength({ min: 6 })
        .withMessage("password must be at least 6 charachters"),
    authController.postLogin
);

router.all("/logout", authGuard.isAuth, authController.logout);

module.exports = router;