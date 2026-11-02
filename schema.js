// This file defines the validation schemas for listings and reviews using the Joi library. The schemas specify the expected structure and validation rules for the data submitted when creating or updating listings and reviews in the Wanderlust application.

// The listingSchema defines the structure and validation rules for a listing object. It requires the title, price, description, location, country, image (with optional filename and URL), and category fields. The category field is validated against a predefined set of valid categories.

// The reviewSchema defines the structure and validation rules for a review object. It requires the comment and rating fields, with the rating being a number between 1 and 5.

// These schemas can be used in middleware functions to validate incoming data before processing it further in the application.

const joi = require("joi");

const listingSchema = joi.object({
    listing: joi.object({
        title: joi.string().required(),
        price: joi.number().required().min(0),
        description: joi.string().required(),
        location: joi.string().required(),
        country: joi.string().required(),
        image: joi.object({
            filename: joi.string().allow("", null),
            url: joi.string().allow("", null)
        }),
        category: joi.string().valid(
            "Trending",
            "Rooms",
            "Cities",
            "Mountains",
            "Castles",
            "Pools",
            "Camping",
            "Deserts",
            "Arctic",
            "Beaches",
            "Boats"
        ).required(),
    }).required()
});

const reviewSchema = joi.object({
    review: joi.object({
        comment: joi.string().required(),
        rating: joi.number().required().min(1).max(5)
    }).required()
});

module.exports = { listingSchema, reviewSchema };