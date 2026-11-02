const Listing = require("../models/listings");
const { deleteImage } = require("../cloudConfig.js");

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// This file defines the controller functions for handling listings in the Wanderlust application. It includes functions for listing operations such as creating, reading, updating, and deleting listings. Each function is responsible for processing the request, interacting with the database, and rendering the appropriate response or view.

const PAGE_SIZE = 12;

// Escape regex special characters so user input is treated as plain text (prevents ReDoS / broken patterns)
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Convert a location string into a GeoJSON point. Returns null when Mapbox finds nothing.
const geocode = async (location) => {
    const response = await geocodingClient
        .forwardGeocode({ query: location, limit: 1 })
        .send();
    const feature = response.body.features[0];
    return feature ? feature.geometry : null;
};

module.exports.index = async (req, res) => {
    // Query values must be plain strings (a repeated param like ?category=a&category=b would be an array)
    const category = typeof req.query.category === "string" ? req.query.category : "";
    const search = typeof req.query.search === "string" ? req.query.search : "";

    let filter = {};
    if (category) {
        filter.category = category;
    }

    if (search.trim() !== "" && !category) {
        const searchRegex = new RegExp(escapeRegex(search.trim()), "i");
        filter.$or = [
            { title: searchRegex },
            { location: searchRegex },
            { country: searchRegex },
            { category: searchRegex},
        ];
    }

    // Pagination
    const requestedPage = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const totalListings = await Listing.countDocuments(filter);
    const totalPages = Math.max(Math.ceil(totalListings / PAGE_SIZE), 1);
    const currentPage = Math.min(requestedPage, totalPages);

    const allListings = await Listing.find(filter)
        .sort({ _id: 1 })
        .skip((currentPage - 1) * PAGE_SIZE)
        .limit(PAGE_SIZE);

    // Query string (without page) reused by the pagination links so filters/search are kept
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (search) params.set("search", search);
    const baseQuery = params.toString();

    res.render("listings/index.ejs", {
        allListings,
        selectedCategory: category,
        searchQuery: search,
        currentPage,
        totalPages,
        totalListings,
        baseQuery,
    });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
        .populate({ 
            path: "reviews", 
            populate: {
                path: "author",
            },
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Cannot find that listing!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
};

module.exports.createListing = async (req, res, next) => {
    if (!req.file) {
        req.flash("error", "Please upload an image for the listing.");
        return res.redirect("/listings/new");
    }

    let url = req.file.path;
    let filename = req.file.filename;

    const geometry = await geocode(req.body.listing.location);
    if (!geometry) {
        await deleteImage(filename);
        req.flash("error", "We couldn't find that location. Please enter a more specific place name.");
        return res.redirect("/listings/new");
    }

    // Only copy the fields users are allowed to set
    const { title, description, price, location, country, category } = req.body.listing;
    const newListing = new Listing({ title, description, price, location, country, category });
    newListing.owner = req.user._id;
    newListing.image = { filename, url };
    newListing.geometry = geometry;
    await newListing.save();
    req.flash("success", "Successfully made a new listing!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Cannot find that listing!");
        return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", {listing, originalImageUrl});
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;

    const geometry = await geocode(req.body.listing.location);
    if (!geometry) {
        if (req.file) await deleteImage(req.file.filename);
        req.flash("error", "We couldn't find that location. Please enter a more specific place name.");
        return res.redirect(`/listings/${id}/edit`);
    }

    // Only copy the fields users are allowed to change
    const { title, description, price, location, country, category } = req.body.listing;
    let listing = await Listing.findByIdAndUpdate(
        id,
        { title, description, price, location, country, category, geometry },
        { new: true }
    );

    if (typeof req.file !== "undefined") {
        const oldFilename = listing.image && listing.image.filename;
        listing.image = { filename: req.file.filename, url: req.file.path };
        await listing.save();
        await deleteImage(oldFilename);   // remove the replaced image from Cloudinary
    }

    req.flash("success", "Successfully updated the listing!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    if (deletedListing && deletedListing.image) {
        await deleteImage(deletedListing.image.filename);
    }
    req.flash("success", "Successfully deleted the listing!");
    res.redirect("/listings");
};