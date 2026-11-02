// This file defines a utility function called wrapAsync that wraps an asynchronous function (fn) and returns a new function. The purpose of this wrapper is to handle any errors that may occur during the execution of the asynchronous function and pass them to the next middleware in the Express.js application.

// The wrapAsync function takes a single parameter, fn, which is the asynchronous function to be wrapped. It returns a new function that takes three parameters: req (the request object), res (the response object), and next (the next middleware function). Inside the returned function, the original asynchronous function (fn) is called with the provided req, res, and next parameters. If an error occurs during the execution of fn, it is caught using the catch method and passed to the next middleware by calling next(err).

function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(next);
    };
}

module.exports = wrapAsync;