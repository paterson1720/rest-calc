const express = require('express');
const router = express.Router();

const operationsController = require('../controllers/operations.controller');
const { requireAuth } = require('../middlewares');

router.post('/operations/calculate', requireAuth, operationsController.calculate);
router.get('/operations', operationsController.getAllOperations);

module.exports = router;
