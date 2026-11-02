// This file defines a custom error class called ExpressError that extends the built-in Error class in JavaScript. It allows you to create error objects with a message and a status code, which can be used for error handling in an Express.js application.

// The constructor takes two parameters: message (the error message) and statusCode (the HTTP status code associated with the error). When an instance of ExpressError is created, it sets the message and statusCode properties accordingly. This custom error class can be used to throw errors with specific messages and status codes, making it easier to handle errors in a consistent manner throughout the application.

class ExpressError extends Error {
    constructor(message, statusCode) {
        super();
        this.message = message;
        this.statusCode = statusCode;
    }
}

module.exports = ExpressError;