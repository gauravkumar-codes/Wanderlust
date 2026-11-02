const User = require("../models/users");

// This file defines the controller functions for handling user-related operations in the Wanderlust application. It includes functions for rendering the sign-up and login forms, processing user registration and login, and handling user logout. Each function is responsible for processing the request, interacting with the database, and rendering the appropriate response or view.

module.exports.renderSignUpForm = (req, res) => {
    res.render('users/signup.ejs');
};

module.exports.signUp = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Welcome to Wanderlust!');
            res.redirect('/listings');
        })
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};

module.exports.renderLogInForm = (req, res) => {
    res.render('users/login.ejs');
};

module.exports.logIn = async (req, res) => {
    req.flash('success', 'Welcome back to Wanderlust!');
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};


module.exports.logOut = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    })
};