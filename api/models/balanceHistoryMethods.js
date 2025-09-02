const { BalanceHistory } = require('~/db/models');
const { logger } = require('@librechat/data-schemas');

/**
 * Records a balance change in the balance history
 * @param {Object} params
 * @param {string} params.user - User ID
 * @param {number} params.previousBalance - Previous balance amount
 * @param {number} params.newBalance - New balance amount
 * @param {string} params.changeType - Type of change (refill, purchase, spend, adjustment, autoRefill)
 * @param {string} params.description - Description of the change
 * @param {string} [params.relatedTransactionId] - Related transaction ID if applicable
 * @param {Object} [params.metadata] - Additional metadata
 * @returns {Promise<Object>} The created balance history record
 */
async function recordBalanceChange({
  user,
  previousBalance,
  newBalance,
  changeType,
  description,
  relatedTransactionId = null,
  metadata = null,
}) {
  try {
    const changeAmount = newBalance - previousBalance;
    
    const balanceHistoryRecord = await BalanceHistory.create({
      user,
      previousBalance,
      newBalance,
      changeAmount,
      changeType,
      description,
      relatedTransactionId,
      metadata,
    });

    logger.debug('[BalanceHistory] Recorded balance change', {
      user,
      changeType,
      changeAmount,
      newBalance,
    });

    return balanceHistoryRecord;
  } catch (error) {
    logger.error('[BalanceHistory] Failed to record balance change', {
      user,
      changeType,
      error: error.message,
    });
    throw error;
  }
}

/**
 * Gets balance history for a user with pagination
 * @param {Object} params
 * @param {string} params.user - User ID
 * @param {number} [params.page=1] - Page number
 * @param {number} [params.limit=20] - Items per page
 * @param {string} [params.sort='-createdAt'] - Sort order
 * @param {string} [params.changeType] - Filter by change type
 * @returns {Promise<Object>} Balance history data with pagination
 */
async function getBalanceHistory({
  user,
  page = 1,
  limit = 20,
  sort = '-createdAt',
  changeType = null,
}) {
  try {
    const filter = { user };
    if (changeType) {
      filter.changeType = changeType;
    }

    const skip = (page - 1) * limit;
    
    const [history, total] = await Promise.all([
      BalanceHistory.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      BalanceHistory.countDocuments(filter),
    ]);

    return {
      history,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    logger.error('[BalanceHistory] Failed to get balance history', {
      user,
      error: error.message,
    });
    throw error;
  }
}

module.exports = {
  recordBalanceChange,
  getBalanceHistory,
};