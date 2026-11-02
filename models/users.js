const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose').default;

// This file defines the Mongoose schema for users in the Wanderlust application. It specifies the structure and data types for a user document in the MongoDB database. The schema includes an email field, which is required for user registration and authentication. The passport-local-mongoose plugin is applied to the schema to handle password hashing and authentication functionality, making it easier to manage user accounts and login processes.

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    }
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

module.exports = User;