const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');

async function addUser() {
    try {
        // Get user details from command line arguments
        const username = process.argv[2];
        const email = process.argv[3];
        const password = process.argv[4];
        const role = process.argv[5] || 'user'; // Default to 'user' if not specified

        // Validate inputs
        if (!username || !email || !password) {
            console.error('❌ Error: Missing required arguments');
            console.log('\nUsage: node addUser.js <username> <email> <password> [role]');
            console.log('Example: node addUser.js john john@example.com MyPass123 user');
            console.log('\nRole options: user, admin (default: user)');
            process.exit(1);
        }

        if (password.length < 6) {
            console.error('❌ Error: Password must be at least 6 characters long');
            process.exit(1);
        }

        if (!['user', 'admin'].includes(role)) {
            console.error('❌ Error: Role must be either "user" or "admin"');
            process.exit(1);
        }

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            console.error(`❌ Error: User with email "${email}" or username "${username}" already exists`);
            await mongoose.connection.close();
            process.exit(1);
        }

        // Create new user
        const newUser = await User.create({
            username,
            email,
            password,
            role
        });

        console.log('\n✅ User created successfully!');
        console.log('\n📋 User Details:');
        console.log(`  Username: ${newUser.username}`);
        console.log(`  Email: ${newUser.email}`);
        console.log(`  Role: ${newUser.role}`);
        console.log(`  Created: ${newUser.createdAt}`);

        // Close connection
        await mongoose.connection.close();
        console.log('\n📡 Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error adding user:', error.message);
        process.exit(1);
    }
}

addUser();
