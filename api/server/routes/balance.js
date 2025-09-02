const express = require('express');
const router = express.Router();
const controller = require('../controllers/Balance');
const transactionController = require('../controllers/TransactionHistory');
const balanceHistoryController = require('../controllers/BalanceHistory');
const { requireJwtAuth } = require('../middleware/');

router.get('/', requireJwtAuth, controller);
router.get('/transactions', requireJwtAuth, transactionController);
router.get('/history', requireJwtAuth, balanceHistoryController);

module.exports = router;
