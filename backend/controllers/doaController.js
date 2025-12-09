const DOA = require('../models/DOA');
const Stock = require('../models/Stock');

// @desc    Get all DOA records
// @route   GET /api/doa
exports.getDOARecords = async (req, res, next) => {
    try {
        const doaRecords = await DOA.find()
            .populate({
                path: 'stock',
                populate: {
                    path: 'category',
                    select: 'name species weightRange'
                }
            })
            .sort({ recordedAt: -1 });

        res.json({
            success: true,
            data: doaRecords
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Record DOA
// @route   POST /api/doa
exports.recordDOA = async (req, res, next) => {
    try {
        const { stockId, quantity, notes } = req.body;

        // Get stock item
        const stock = await Stock.findById(stockId);

        if (!stock) {
            return res.status(404).json({
                success: false,
                message: 'Stock item not found'
            });
        }

        // Validate DOA quantity
        if (quantity > stock.quantity) {
            return res.status(400).json({
                success: false,
                message: `DOA quantity (${quantity}) cannot exceed available quantity (${stock.quantity})`
            });
        }

        // Calculate DOA weight proportionally
        const doaWeight = (stock.weight / stock.quantity) * quantity;

        // Create DOA record
        const doa = await DOA.create({
            stock: stockId,
            quantity,
            weight: doaWeight,
            notes
        });

        // Update stock quantity and weight
        stock.quantity -= quantity;
        stock.weight -= doaWeight;

        // If all items are DOA, mark stock as DOA
        if (stock.quantity === 0) {
            stock.status = 'DOA';
        }

        await stock.save();

        const populatedDOA = await DOA.findById(doa._id)
            .populate('stock', 'category')
            .populate({
                path: 'stock',
                populate: {
                    path: 'category',
                    select: 'name species weightRange'
                }
            });

        res.status(201).json({
            success: true,
            data: populatedDOA
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete DOA record
// @route   DELETE /api/doa/:id
exports.deleteDOA = async (req, res, next) => {
    try {
        const doa = await DOA.findByIdAndDelete(req.params.id);

        if (!doa) {
            return res.status(404).json({
                success: false,
                message: 'DOA record not found'
            });
        }

        res.json({
            success: true,
            message: 'DOA record deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
