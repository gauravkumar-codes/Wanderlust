const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Review = require('./reviews.js');
const { required } = require('joi');

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

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;