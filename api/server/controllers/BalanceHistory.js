const { Balance } = require('~/db/models');

/**
 * Controller for fetching balance history data
 * Fetches data directly from balances collection
 */
async function balanceHistoryController(req, res) {
  try {
    const { page = 1, limit = 20 } = req.query;
    const userId = req.user.id;

    // Get current balance
    const currentBalance = await Balance.findOne(
      { user: userId },
      'tokenCredits'
    ).lean();

    if (!currentBalance) {
      return res.status(404).json({ error: 'Balance not found' });
    }

    // Get all balance records for this user (treating each as history)
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const balanceRecords = await Balance.find(
      { user: userId }
    )
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .lean();

    const total = await Balance.countDocuments({ user: userId });

    // Format balance records as history
    const balanceHistory = balanceRecords.map(record => ({
      date: record.updatedAt || record.createdAt,
      type: 'balance',
      amount: record.tokenCredits,
      balance: record.tokenCredits,
      description: `Balance: ${record.tokenCredits} credits`,
      metadata: {
        autoRefillEnabled: record.autoRefillEnabled,
        refillAmount: record.refillAmount,
        lastRefill: record.lastRefill
      },
    }));

    res.status(200).json({
      currentBalance: currentBalance.tokenCredits,
      balanceHistory,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching balance history:', error);
    res.status(500).json({ error: 'Failed to fetch balance history' });
  }
}

module.exports = balanceHistoryController;