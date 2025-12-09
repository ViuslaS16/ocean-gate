const Invoice = require('../models/Invoice');
const Stock = require('../models/Stock');
const mongoose = require('mongoose');

// Generate invoice number
const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');

    return `INV-${year}${month}${day}-${random}`;
};

// @desc    Get all invoices
// @route   GET /api/invoices
exports.getInvoices = async (req, res, next) => {
    try {
        const invoices = await Invoice.find()
            .sort({ createdAt: -1 })
            .populate('lineItems.stockId', 'boxId category');

        res.json({
            success: true,
            data: invoices
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single invoice
// @route   GET /api/invoices/:id
exports.getInvoiceById = async (req, res, next) => {
    try {
        const invoice = await Invoice.findById(req.params.id)
            .populate('lineItems.stockId', 'boxId category');

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: 'Invoice not found'
            });
        }

        res.json({
            success: true,
            data: invoice
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new invoice
// @route   POST /api/invoices
exports.createInvoice = async (req, res, next) => {
    try {
        const {
            date,
            customer,
            shipping,
            lineItems,
            subtotal,
            tax,
            total,
            totalWeight,
            totalBoxes
        } = req.body;

        // Validate that all stock items are available if finalizing
        for (const item of lineItems) {
            const stock = await Stock.findById(item.stockId);

            if (!stock) {
                return res.status(400).json({
                    success: false,
                    message: `Stock item ${item.boxId} not found`
                });
            }

            if (stock.status !== 'Available') {
                return res.status(400).json({
                    success: false,
                    message: `Stock item ${item.boxId} is not available`
                });
            }

            if (stock.quantity < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient quantity for ${item.boxId}. Available: ${stock.quantity}, Requested: ${item.quantity}`
                });
            }
        }

        const invoiceNumber = generateInvoiceNumber();

        const invoice = await Invoice.create({
            invoiceNumber,
            date,
            customer,
            shipping,
            lineItems,
            subtotal,
            tax,
            total,
            totalWeight,
            totalBoxes,
            status: 'Draft'
        });

        const populatedInvoice = await Invoice.findById(invoice._id)
            .populate('lineItems.stockId', 'boxId category');

        res.status(201).json({
            success: true,
            data: populatedInvoice
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Finalize invoice (deduct stock)
// @route   PUT /api/invoices/:id/finalize
exports.finalizeInvoice = async (req, res, next) => {
    try {
        const invoice = await Invoice.findById(req.params.id);

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: 'Invoice not found'
            });
        }

        if (invoice.status === 'Finalized') {
            return res.status(400).json({
                success: false,
                message: 'Invoice is already finalized'
            });
        }

        // Validate all stock items first
        for (const item of invoice.lineItems) {
            const stock = await Stock.findById(item.stockId);

            if (!stock) {
                return res.status(400).json({
                    success: false,
                    message: `Stock item not found: ${item.boxId}`
                });
            }

            if (stock.quantity < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient quantity for ${item.boxId}. Available: ${stock.quantity}, Requested: ${item.quantity}`
                });
            }
        }

        // Deduct stock quantities
        for (const item of invoice.lineItems) {
            const stock = await Stock.findById(item.stockId);

            // Deduct quantity
            stock.quantity -= item.quantity;

            // Update status if quantity reaches 0
            if (stock.quantity === 0) {
                stock.status = 'Sold';
            }

            await stock.save();
        }

        // Update invoice status
        invoice.status = 'Finalized';
        await invoice.save();

        const populatedInvoice = await Invoice.findById(invoice._id)
            .populate('lineItems.stockId', 'boxId category');

        res.json({
            success: true,
            data: populatedInvoice
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete invoice
// @route   DELETE /api/invoices/:id
exports.deleteInvoice = async (req, res, next) => {
    try {
        const invoice = await Invoice.findById(req.params.id);

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: 'Invoice not found'
            });
        }

        if (invoice.status === 'Finalized') {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete finalized invoice'
            });
        }

        await invoice.deleteOne();

        res.json({
            success: true,
            message: 'Invoice deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
