const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    getInvoices,
    getInvoiceById,
    createInvoice,
    finalizeInvoice,
    deleteInvoice
} = require('../controllers/invoiceController');

router.route('/')
    .get(getInvoices)
    .post(createInvoice);

router.route('/:id')
    .get(getInvoiceById)
    .delete(auth, deleteInvoice);

router.put('/:id/finalize', finalizeInvoice);

module.exports = router;
