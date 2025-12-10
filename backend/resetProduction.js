const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Import all models
const Stock = require('./models/Stock');
const DOA = require('./models/DOA');
const Invoice = require('./models/Invoice');
const Category = require('./models/Category');
const User = require('./models/User');

async function resetProductionDatabase() {
    try {
        // Get new password from command line argument
        const newPassword = process.argv[2];

        if (!newPassword) {
            console.error('❌ Error: Please provide a new admin password');
            console.log('Usage: node resetProduction.js <new-password>');
            process.exit(1);
        }

        if (newPassword.length < 6) {
            console.error('❌ Error: Password must be at least 6 characters long');
            process.exit(1);
        }

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');
        console.log(`📦 Database: ${mongoose.connection.name}`);

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

        // Update admin password
        console.log('\n🔐 Updating admin password...\n');

        const admin = await User.findOne({ email: 'admin@oceangateintl.com' });

        if (admin) {
            admin.password = newPassword;
            await admin.save();
            console.log('✅ Admin password updated successfully');
        } else {
            console.log('⚠️  Admin user not found, creating new admin user...');
            await User.create({
                name: 'Admin',
                email: 'admin@oceangateintl.com',
                password: newPassword,
                role: 'admin'
            });
            console.log('✅ New admin user created');
        }

        console.log('\n✨ Production database reset successfully!\n');
        console.log('📋 Summary:');
        console.log('  • All data cleared');
        console.log('  • Admin password updated');
        console.log('  • Ready for fresh start\n');

        // Close connection
        await mongoose.connection.close();
        console.log('📡 Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error resetting database:', error);
        process.exit(1);
    }
}

resetProductionDatabase();
