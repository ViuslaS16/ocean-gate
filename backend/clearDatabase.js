const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Import all models
const Stock = require('./models/Stock');
const DOA = require('./models/DOA');
const Invoice = require('./models/Invoice');
const Category = require('./models/Category');

async function clearDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear all collections
        console.log('\n🗑️  Clearing all collections...\n');

        await Stock.deleteMany({});
        console.log('✅ Cleared Stock collection');

        await DOA.deleteMany({});
        console.log('✅ Cleared DOA collection');

        await Invoice.deleteMany({});
        console.log('✅ Cleared Invoice collection');

        await Category.deleteMany({});
        console.log('✅ Cleared Category collection');

        console.log('\n✨ Database cleared successfully! All data has been removed.\n');

        // Close connection
        await mongoose.connection.close();
        console.log('📡 Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error clearing database:', error);
        process.exit(1);
    }
}

clearDatabase();
