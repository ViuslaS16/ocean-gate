const mongoose = require('mongoose');

const lineItemSchema = new mongoose.Schema({
    stockId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stock',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    unitPrice: {
        type: Number,
        required: true,
        min: 0
    },
    subtotal: {
        type: Number,
        required: true
    }
});

const invoiceSchema = new mongoose.Schema({
    invoiceNumber: {
        type: String,
        required: true,
        unique: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    customer: {
        name: {
            type: String,
            required: [true, 'Customer name is required']
        },
        address: {
            type: String,
            required: [true, 'Customer address is required']
        },
        phone: {
            type: String,
            required: false
        },
        email: {
            type: String,
            required: false
        }
    },
    shipping: {
        awbNumber: {
            type: String,
            required: [true, 'AWB number is required']
        },
        flightNumber: {
            type: String,
            required: [true, 'Flight number is required']
        },
        code: {
            type: String,
            required: [true, 'Code is required'],
            default: '100'
        },
        hcNumber: {
            type: String,
            required: false
        },
        parkingCenter: {
            type: String,
            required: false,
            default: 'Isabela Sea Foods'
        }
    },
    lineItems: [lineItemSchema],
    status: {
        type: String,
        enum: ['Draft', 'Finalized', 'Deleted'],
        default: 'Draft'
    },
    subtotal: {
        type: Number,
        required: true,
        default: 0
    },
    tax: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        required: true,
        default: 0
    },
    totalWeight: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Invoice', invoiceSchema);
