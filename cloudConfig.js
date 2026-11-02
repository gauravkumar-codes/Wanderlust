// This file configures the Cloudinary service for image storage in the Wanderlust application. It sets up the Cloudinary API credentials and defines a storage configuration using the multer-storage-cloudinary package.

// The cloudinary.config() method is used to set the cloud name, API key, and API secret for the Cloudinary account. These credentials are retrieved from environment variables to keep them secure and prevent hardcoding sensitive information in the codebase.

// The CloudinaryStorage class from the multer-storage-cloudinary package is used to create a storage configuration for multer, which handles file uploads. The storage configuration specifies the Cloudinary instance to use and defines parameters such as the folder name where uploaded images will be stored and the allowed file formats (PNG, JPG, JPEG).

// Finally, the cloudinary instance and storage configuration are exported as modules so that they can be used in other parts of the application, such as in routes that handle image uploads.

const cloudinary = require('cloudinary').v2;  // library for interacting with the Cloudinary API
const { CloudinaryStorage } = require('multer-storage-cloudinary');  // library for integrating Cloudinary with multer for file uploads

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "Wanderlust_DEV",
        allowed_formats: ["png", "jpg", "jpeg", "webp"],
    },
});

// Removes an image from Cloudinary. Never throws, so a failed cleanup can't break the request.
// The seed data uses the placeholder filename "listingimage", which doesn't exist on Cloudinary.
const deleteImage = async (filename) => {
    if (!filename || filename === "listingimage") return;
    try {
        await cloudinary.uploader.destroy(filename);
    } catch (err) {
        console.error("Cloudinary cleanup failed for", filename, err.message);
    }
};

module.exports = {
    cloudinary,
    storage,
    deleteImage,
};