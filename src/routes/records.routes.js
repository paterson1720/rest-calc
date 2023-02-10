const express = require('express');
const router = express.Router();

const recordsController = require('../controllers/records.controller');
const { requireAuth } = require('../middlewares');

router.get('/records', requireAuth, recordsController.getAllPaginated);
router.delete('/record/:recordId', requireAuth, recordsController.deleteOneRecord)

module.exports = router;
