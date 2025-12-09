const express = require('express');
const router = express.Router();
const {
    getDOARecords,
    recordDOA,
    deleteDOA
} = require('../controllers/doaController');

router.route('/')
    .get(getDOARecords)
    .post(recordDOA);

router.route('/:id')
    .delete(deleteDOA);

module.exports = router;
