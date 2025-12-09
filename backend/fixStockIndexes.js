const mongoose = require('mongoose');
require('dotenv').config();

async function fixStockIndexes() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const db = mongoose.connection.db;
        const stockCollection = db.collection('stocks');

        // Check existing indexes
        console.log('\n📋 Current indexes:');
        const indexes = await stockCollection.indexes();
        indexes.forEach(index => {
            console.log(`  - ${JSON.stringify(index.key)}`);
        });

        // Drop the boxId index if it exists
        try {
            await stockCollection.dropIndex('boxId_1');
            console.log('\n✅ Dropped boxId unique index');
        } catch (error) {
            if (error.code === 27) {
                console.log('\n⚠️  boxId index does not exist (already removed or never existed)');
            } else {
                throw error;
            }
        }

        console.log('\n✨ Stock indexes fixed successfully!\n');

        // Close connection
        await mongoose.connection.close();
        console.log('📡 Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error fixing indexes:', error);
        process.exit(1);
    }
}

fixStockIndexes();
