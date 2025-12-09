const Stock = require('../models/Stock');
const Category = require('../models/Category');

// @desc    Get all stock with filters and pagination
// @route   GET /api/stock
exports.getStock = async (req, res, next) => {
    try {
        const { search, category, status, page = 1, limit = 20 } = req.query;

        // Build query
        let query = {};

        // Search by category name
        if (search) {
            const categories = await Category.find({
                name: { $regex: search, $options: 'i' }
            }).select('_id');

            const categoryIds = categories.map(cat => cat._id);
            query.category = { $in: categoryIds };
        }

        // Filter by category ID
        if (category && category !== 'all') {
            query.category = category;
        }

        // Filter by status
        if (status && status !== 'all') {
            query.status = status;
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Execute query
        const stock = await Stock.find(query)
            .populate('category', 'name species weightRange')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Stock.countDocuments(query);

        res.json({
            success: true,
            data: stock,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single stock item
// @route   GET /api/stock/:id
exports.getStockById = async (req, res, next) => {
    try {
        const stock = await Stock.findById(req.params.id)
            .populate('category', 'name species weightRange');

        if (!stock) {
            return res.status(404).json({
                success: false,
                message: 'Stock item not found'
            });
        }

        res.json({
            success: true,
            data: stock
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get available stock for invoice
// @route   GET /api/stock/available
exports.getAvailableStock = async (req, res, next) => {
    try {
        const stock = await Stock.find({
            status: 'Available',
            quantity: { $gt: 0 }
        })
            .populate('category', 'name species weightRange')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: stock
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new stock
// @route   POST /api/stock
exports.createStock = async (req, res, next) => {
    try {
        const { category, quantity, weight, unitPrice, location, notes } = req.body;

        // Verify category exists
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(400).json({
                success: false,
                message: 'Category not found'
            });
        }

        const stock = await Stock.create({
            category,
            quantity,
            weight,
            unitPrice,
            location,
            notes,
            status: 'Available'
        });

        const populatedStock = await Stock.findById(stock._id)
            .populate('category', 'name species weightRange');

        res.status(201).json({
            success: true,
            data: populatedStock
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update stock
// @route   PUT /api/stock/:id
exports.updateStock = async (req, res, next) => {
    try {
        const { category, quantity, weight, unitPrice, location, notes } = req.body;

        const stock = await Stock.findByIdAndUpdate(
            req.params.id,
            { category, quantity, weight, unitPrice, location, notes },
            { new: true, runValidators: true }
        ).populate('category', 'name species weightRange');

        if (!stock) {
            return res.status(404).json({
                success: false,
                message: 'Stock item not found'
            });
        }

        res.json({
            success: true,
            data: stock
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete stock
// @route   DELETE /api/stock/:id
exports.deleteStock = async (req, res, next) => {
    try {
        const stock = await Stock.findByIdAndDelete(req.params.id);

        if (!stock) {
            return res.status(404).json({
                success: false,
                message: 'Stock item not found'
            });
        }

        res.json({
            success: true,
            message: 'Stock item deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
