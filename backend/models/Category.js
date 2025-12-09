const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        trim: true
    },
    species: {
        type: String,
        required: [true, 'Species is required'],
        trim: true
    },
    weightRange: {
        type: String,
        required: [true, 'Weight range is required'],
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Category', categorySchema);
