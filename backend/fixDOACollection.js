const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function fixDOAIndexes() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const db = mongoose.connection.db;
        const doaCollection = db.collection('doas');

        // Check existing indexes
        console.log('\n📋 Current DOA collection indexes:');
        const indexes = await doaCollection.indexes();
        indexes.forEach(index => {
            console.log(`  - ${JSON.stringify(index.key)}`);
        });

        // Drop the entire collection to remove all old schema constraints
        try {
            await doaCollection.drop();
            console.log('\n✅ Dropped DOA collection (will be recreated with new schema)');
        } catch (error) {
            if (error.code === 26) {
                console.log('\n⚠️  DOA collection does not exist (will be created on first insert)');
            } else {
                throw error;
            }
        }

        console.log('\n✨ DOA collection reset successfully!\n');

        // Close connection
        await mongoose.connection.close();
        console.log('📡 Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error fixing DOA collection:', error);
        process.exit(1);
    }
}

fixDOAIndexes();
