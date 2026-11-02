if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

// Fail fast if a required environment variable is missing
const requiredEnv = ["ATLASDB_URL", "SESSION_SECRET", "MAP_TOKEN", "CLOUD_NAME", "CLOUD_API_KEY", "CLOUD_API_SECRET"];
const missingEnv = requiredEnv.filter((name) => !process.env[name]);
if (missingEnv.length > 0) {
    console.error(`Missing required environment variables: ${missingEnv.join(", ")}`);
    process.exit(1);
}

const isProduction = process.env.NODE_ENV === "production";

const express = require('express');
const app = express();
const mongoose = require('mongoose');  // mongoose is a library that allows us to interact with MongoDB in a more structured way. It provides a schema-based solution to model our application data, making it easier to define the structure of our documents and perform CRUD operations.
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/users.js');

const listingRouter = require('./routes/listings.js');
const reviewRouter = require('./routes/reviews.js');
const userRouter = require('./routes/user.js');

// Behind Render's proxy, trust it so secure cookies and req.ip work correctly
if (isProduction) {
    app.set('trust proxy', 1);
}
app.disable('x-powered-by');

// Basic security headers
app.use((req, res, next) => {
    res.set({
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
    });
    next();
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));


// Database connection
const dbUrl = process.env.ATLASDB_URL;
// const MONGO_URL = 'mongodb://localhost:27017/wanderlust';

main()
    .then(() => {
        console.log('Connected to DB');
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(dbUrl);
    // await mongoose.connect(MONGO_URL);
}

// Session configuration
const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.log("ERROR inMONGO SESSION STORE", err);
});

const sessionOptions = {
    store,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        sameSite: 'lax',
        secure: isProduction,
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;
    next();
});

// Routes
app.use('/listings', listingRouter);
app.use('/listings/:id/reviews', reviewRouter);
app.use('/', userRouter);


// Error handling middleware
app.use((req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
});

// Error handling middleware for catching errors and rendering an error page
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    // An invalid ObjectId in the URL (e.g. /listings/abc) is treated as "not found"
    if (err.name === "CastError") {
        err = new ExpressError("Page Not Found", 404);
    }
    // Multer upload errors
    if (err.name === "MulterError") {
        const msg = err.code === "LIMIT_FILE_SIZE" ? "Image is too large (maximum 5 MB)" : err.message;
        err = new ExpressError(msg, 400);
    }

    const statusCode = err.statusCode || err.status || 500;
    if (statusCode >= 500) {
        console.error(err);   // log the real error, but don't show internals to the user
    }
    const message = statusCode >= 500 ? "Something went wrong" : err.message;
    res.status(statusCode).render("error.ejs", { message });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});