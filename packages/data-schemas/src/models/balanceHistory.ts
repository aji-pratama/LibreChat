import balanceHistorySchema from '~/schema/balanceHistory';
import type * as t from '~/types';

/**
 * Creates or returns the BalanceHistory model using the provided mongoose instance and schema
 */
export function createBalanceHistoryModel(mongoose: typeof import('mongoose')) {
  return mongoose.models.BalanceHistory || mongoose.model<t.IBalanceHistory>('BalanceHistory', balanceHistorySchema);
}