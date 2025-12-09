const Category = require('../models/Category');
const Stock = require('../models/Stock');

// @desc    Get all categories
// @route   GET /api/categories
exports.getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new category
// @route   POST /api/categories
exports.createCategory = async (req, res, next) => {
    try {
        const { name, species, weightRange } = req.body;

        const category = await Category.create({
            name,
            species,
            weightRange
        });

        res.status(201).json({
            success: true,
            data: category
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update category
// @route   PUT /api/categories/:id
exports.updateCategory = async (req, res, next) => {
    try {
        const { name, species, weightRange } = req.body;

        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { name, species, weightRange },
            { new: true, runValidators: true }
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        res.json({
            success: true,
            data: category
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
exports.deleteCategory = async (req, res, next) => {
    try {
        // Check if any stock items reference this category
        const stockCount = await Stock.countDocuments({ category: req.params.id });

        if (stockCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete category. ${stockCount} stock item(s) are using this category.`
            });
        }

        const category = await Category.findByIdAndDelete(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        res.json({
            success: true,
            message: 'Category deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
