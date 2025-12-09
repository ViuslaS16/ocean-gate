const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);

        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Clear all data on fresh server start (as per requirements)
        if (process.env.NODE_ENV === 'development') {
            await clearAllData();
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const clearAllData = async () => {
    try {
        const collections = await mongoose.connection.db.collections();

        for (let collection of collections) {
            await collection.deleteMany({});
        }

        console.log('All data cleared for fresh start');
    } catch (error) {
        console.error('Error clearing data:', error.message);
    }
};

module.exports = connectDB;
