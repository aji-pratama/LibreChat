const { getTransactions } = require('~/models/Transaction');

async function transactionHistoryController(req, res) {
  try {
    const { page = 1, limit = 20, sort = '-createdAt' } = req.query;
    const userId = req.user.id;

    // Build filter for user's transactions
    const filter = { user: userId };

    // Get transactions with pagination
    const transactions = await getTransactions({
      filter,
      sort,
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
    });

    // Get total count for pagination
    const { Transaction } = require('~/db/models');
    const total = await Transaction.countDocuments(filter);

    res.status(200).json({
      transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    res.status(500).json({ error: 'Failed to fetch transaction history' });
  }
}

module.exports = transactionHistoryController;