const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");
const rateLimit = require("../utils/rateLimit.js");

// Max 10 login/signup attempts per IP every 15 minutes
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });

router.route("/signup")
    .get(userController.renderSignUpForm)      // Sign Up Form Route
    .post(authLimiter, wrapAsync(userController.signUp));    // Sign Up Route

router.route("/login")
    .get(userController.renderLogInForm)      // Log In Form Route
    .post(authLimiter, saveRedirectUrl, passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    userController.logIn          
);         // Log In Route

// Log Out Route
router.get("/logout", userController.logOut);

module.exports = router;