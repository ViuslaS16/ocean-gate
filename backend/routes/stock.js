const express = require('express');
const router = express.Router();
const {
    getStock,
    getStockById,
    getAvailableStock,
    createStock,
    updateStock,
    deleteStock
} = require('../controllers/stockController');

router.get('/available', getAvailableStock);

router.route('/')
    .get(getStock)
    .post(createStock);

router.route('/:id')
    .get(getStockById)
    .put(updateStock)
    .delete(deleteStock);

module.exports = router;
