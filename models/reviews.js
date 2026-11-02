const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// This file defines the Mongoose schema for reviews in the Wanderlust application. It specifies the structure and data types for a review document in the MongoDB database. The schema includes fields such as comment, rating, createdAt, and author. Each field has its own data type and validation rules.

const reviewSchema = new Schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;