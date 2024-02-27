const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

// async () : marks a function as asynchronous
const connectDB = async () => {
    try {
        await mongoose.connect(db); // Wait until the connection to MongoDB is established before proceeding further in the code
        console.log("MongoDB Connected...")
    } catch(err) {
        console.log(err.message);
        // Exit process with failure
        process.exit(1);
    }
}

module.exports = connectDB;