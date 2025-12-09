const mongoose = require('mongoose');

const doaSchema = new mongoose.Schema({
    stock: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stock',
        required: true
    },
    quantity: {
        type: Number,
        required: [true, 'DOA quantity is required'],
        min: [1, 'DOA quantity must be at least 1']
    },
    weight: {
        type: Number,
        required: [true, 'DOA weight is required'],
        min: [0, 'DOA weight cannot be negative']
    },
    notes: {
        type: String,
        trim: true,
        default: ''
    },
    recordedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('DOA', doaSchema);
