const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Review = require('./reviews.js');

// This file defines the Mongoose schema for listings in the Wanderlust application. It specifies the structure and data types for a listing document in the MongoDB database. The schema includes fields such as title, description, image, price, location, country, reviews, owner, geometry, and category. Each field has its own data type and validation rules.

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        filename: {
            type : String,
            default: "listingimage",
        },
        url : {
            type : String,
            default: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmVhY2glMjB3YWxscGFwZXJ8ZW58MHx8MHx8fDA%3D",
            set: (v) => 
                v === "" 
                    ? "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmVhY2glMjB3YWxscGFwZXJ8ZW58MHx8MHx8fDA%3D"
                    : v,
        },
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    },
    category: {
        type: String,
        enum: [
            "Trending",
            "Rooms",
            "Cities",
            "Mountains",
            "Castles",
            "Pools",
            "Camping",
            "Arctic",
            "Beaches",
            "Boats",
            "Deserts",
        ],
        required: true,
    },
});

listingSchema.index({ category: 1 });

// This middleware function is triggered after a listing is deleted using the findOneAndDelete method. It checks if the deleted listing exists and, if so, deletes all associated reviews from the Review collection that have their _id present in the listing's reviews array. This ensures that when a listing is removed, its related reviews are also cleaned up from the database, maintaining data integrity and preventing orphaned review documents.

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;