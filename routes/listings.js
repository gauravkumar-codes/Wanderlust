// This file defines the routes for handling listings in the Wanderlust application. It uses the Express.js framework to create a router and define various routes for listing-related operations.

// The router is created using the express.Router() method, and it defines routes for listing operations such as creating, reading, updating, and deleting listings. Each route is associated with a specific HTTP method (GET, POST, PUT, DELETE) and a corresponding controller function that handles the request and response.

// The routes are organized using the router.route() method, which allows for chaining multiple route handlers for the same path. Middleware functions such as isLoggedIn, isOwner, and validateListing are used to enforce authentication, authorization, and validation checks before executing the controller functions.

// The router also uses the multer middleware for handling file uploads when creating or updating listings. The storage configuration for multer is defined in the cloudConfig.js file.

// Finally, the router is exported as a module so that it can be used in the main application file (app.js) to handle requests related to listings.

const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const ExpressError = require("../utils/ExpressError.js");
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },   // 5 MB max per image
    fileFilter: (req, file, cb) => {
        if (/^image\/(png|jpe?g|webp)$/.test(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new ExpressError("Only PNG, JPG, JPEG or WEBP images are allowed", 400));
        }
    },
});

// Home Route
router.route("/")
    .get(wrapAsync(listingController.index))        // Index Route
    .post(isLoggedIn, upload.single("listing[image][url]"), validateListing, wrapAsync(listingController.createListing));   // Create Route

// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
    .get(wrapAsync(listingController.showListing))    // Show Route
    .put(isLoggedIn, isOwner, upload.single("listing[image][url]"), validateListing, wrapAsync(listingController.updateListing))     // Update Route
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing))    // Delete Route

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;