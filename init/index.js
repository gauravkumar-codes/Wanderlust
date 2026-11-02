// This file initializes the MongoDB database with sample data for the Wanderlust application. It connects to the MongoDB server, clears any existing listings in the database, and inserts a predefined set of sample listings. Each listing is associated with a specific owner ID. The purpose of this script is to provide a starting point for testing and development by populating the database with initial data.

// The script uses the Mongoose library to interact with the MongoDB database and perform CRUD operations. It defines an asynchronous function called initDB that handles the database initialization process. The function first deletes all existing listings in the database using the deleteMany method. Then, it maps over the sample data and adds an owner field to each listing object, associating it with a specific owner ID. Finally, it inserts the modified sample data into the database using the insertMany method.

// The script also includes error handling to catch any potential errors that may occur during the database connection or data insertion process. If an error occurs, it will be logged to the console for debugging purposes.

// To run this script, make sure you have MongoDB installed and running on your local machine. You can execute the script using Node.js by running the command `node init/index.js` in your terminal. This will connect to the MongoDB server, initialize the database with sample data, and log a success message to the console.

// Note: Before running this script, ensure that you have the necessary dependencies installed, including Mongoose and the required models. You may need to adjust the database connection URL and owner ID based on your specific setup and requirements.

const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listings.js');

const MONGO_URL = 'mongodb://localhost:27017/wanderlust';

main()
    .then(() => {
        console.log('Connected to DB');
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: "6a495fcbfba62ddefe9a8795",
    }));
    await Listing.insertMany(initData.data);
    console.log('Database initialized with sample data.');
};

initDB();