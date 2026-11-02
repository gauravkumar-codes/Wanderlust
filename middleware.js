// This file contains middleware functions for the Wanderlust application. These functions are used to handle authentication, authorization, and validation of requests related to listings and reviews.

// The isLoggedIn middleware checks if the user is authenticated before allowing access to certain routes. If the user is not logged in, it saves the original URL they were trying to access and redirects them to the login page with an error message.

// The saveRedirectUrl middleware saves the redirect URL in the response locals if it exists in the session. This allows the application to redirect the user back to their original destination after successful login.

// The isOwner middleware checks if the currently logged-in user is the owner of a specific listing. If not, it flashes an error message and redirects them back to the listing page.

// The validateListing middleware uses the listingSchema defined in schema.js to validate incoming data for creating or updating listings. If the data is invalid, it throws an ExpressError with a status code of 400.

// The validateReview middleware uses the reviewSchema defined in schema.js to validate incoming data for creating reviews. If the data is invalid, it throws an ExpressError with a status code of 400.

// The isReviewAuthor middleware checks if the currently logged-in user is the author of a specific review. If not, it flashes an error message and redirects them back to the listing page.

const ExpressError = require('./utils/ExpressError.js');
const Listing = require('./models/listings.js');
const Review = require('./models/reviews.js');
const { listingSchema, reviewSchema } = require('./schema.js');
const { deleteImage } = require('./cloudConfig.js');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        if (req.method === "GET") {
            req.session.redirectUrl = req.originalUrl;
        }
        else {
            req.session.redirectUrl = "/listings";
        }
        req.flash("error", "You must be logged in for this action!!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Cannot find that listing!");
        return res.redirect("/listings");
    }
    if (!listing.owner || !listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }

    next();
}

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        // The image was already uploaded by multer before validation ran, so remove it.
        if (req.file) deleteImage(req.file.filename);
        let errorMessage = error.details.map(el => el.message).join(',');
        throw new ExpressError(errorMessage, 400);
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errorMessage = error.details.map(el => el.message).join(',');
        throw new ExpressError(errorMessage, 400);
    } else {
        next();
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review) {
        req.flash("error", "Cannot find that review!");
        return res.redirect(`/listings/${id}`);
    }
    if (!review.author || !review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }

    next();
}