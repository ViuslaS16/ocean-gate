const Stock = require('../models/Stock');
const Invoice = require('../models/Invoice');
const DOA = require('../models/DOA');
const Category = require('../models/Category');

// @desc    Get dashboard metrics
// @route   GET /api/dashboard/metrics
exports.getDashboardMetrics = async (req, res, next) => {
    try {
        // Total stock (quantity and weight)
        const stockAggregation = await Stock.aggregate([
            { $match: { status: 'Available' } },
            {
                $group: {
                    _id: null,
                    totalQuantity: { $sum: '$quantity' },
                    totalWeight: { $sum: '$weight' },
                    totalBoxes: { $sum: 1 }
                }
            }
        ]);

        const totalStock = stockAggregation[0] || {
            totalQuantity: 0,
            totalWeight: 0,
            totalBoxes: 0
        };

        // This week's income (only Finalized invoices)
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const weeklyIncome = await Invoice.aggregate([
            {
                $match: {
                    status: 'Finalized',
                    createdAt: { $gte: startOfWeek }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$total' }
                }
            }
        ]);

        const thisWeekIncome = weeklyIncome[0]?.total || 0;

        // Total DOA weight
        const doaAggregation = await DOA.aggregate([
            {
                $group: {
                    _id: null,
                    totalWeight: { $sum: '$weight' }
                }
            }
        ]);

        const totalDOAWeight = doaAggregation[0]?.totalWeight || 0;

        // Recent stock additions (last 10)
        const recentStock = await Stock.find()
            .populate('category', 'name species weightRange')
            .sort({ createdAt: -1 })
            .limit(10);

        // Recent invoices (last 10)
        const recentInvoices = await Invoice.find()
            .sort({ createdAt: -1 })
            .limit(10);

        // Weekly stock movement (last 7 days)
        const weeklyMovement = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);

            const endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);

            const stockOnDay = await Stock.aggregate([
                {
                    $match: {
                        createdAt: { $lte: endDate }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalWeight: { $sum: '$weight' }
                    }
                }
            ]);

            weeklyMovement.push({
                date: date.toISOString().split('T')[0],
                weight: stockOnDay[0]?.totalWeight || 0
            });
        }

        // Category distribution
        const categoryDistribution = await Stock.aggregate([
            { $match: { status: 'Available' } },
            {
                $group: {
                    _id: '$category',
                    weight: { $sum: '$weight' },
                    quantity: { $sum: '$quantity' }
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'categoryInfo'
                }
            },
            {
                $unwind: '$categoryInfo'
            },
            {
                $project: {
                    name: '$categoryInfo.name',
                    weight: 1,
                    quantity: 1
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                metrics: {
                    totalStock: {
                        quantity: totalStock.totalQuantity,
                        weight: totalStock.totalWeight
                    },
                    thisWeekIncome,
                    totalDOAWeight,
                    availableBoxes: totalStock.totalBoxes
                },
                recentStock,
                recentInvoices,
                weeklyMovement,
                categoryDistribution
            }
        });
    } catch (error) {
        next(error);
    }
};
