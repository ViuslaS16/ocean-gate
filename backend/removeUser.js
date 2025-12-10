const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');

async function removeUser() {
    try {
        // Get email from command line argument
        const email = process.argv[2];

        // Validate input
        if (!email) {
            console.error('❌ Error: Please provide user email');
            console.log('\nUsage: node removeUser.js <email>');
            console.log('Example: node removeUser.js john@example.com');
            process.exit(1);
        }

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Find user first
        const user = await User.findOne({ email });

        if (!user) {
            console.error(`❌ Error: User with email "${email}" not found`);
            await mongoose.connection.close();
            process.exit(1);
        }

        // Display user info before deletion
        console.log('\n⚠️  Found user:');
        console.log(`  Username: ${user.username}`);
        console.log(`  Email: ${user.email}`);
        console.log(`  Role: ${user.role}`);

        // Delete user
        await User.deleteOne({ email });

        console.log('\n✅ User deleted successfully!');
        console.log('📋 The user can no longer login to the application.');

        // Close connection
        await mongoose.connection.close();
        console.log('\n📡 Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error removing user:', error.message);
        process.exit(1);
    }
}

removeUser();
