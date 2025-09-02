import { Schema } from 'mongoose';
import type * as t from '~/types';

const balanceHistorySchema = new Schema<t.IBalanceHistory>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true,
  },
  previousBalance: {
    type: Number,
    required: true,
  },
  newBalance: {
    type: Number,
    required: true,
  },
  changeAmount: {
    type: Number,
    required: true,
  },
  changeType: {
    type: String,
    enum: ['refill', 'purchase', 'spend', 'adjustment', 'autoRefill'],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  relatedTransactionId: {
    type: Schema.Types.ObjectId,
    ref: 'Transaction',
    required: false,
  },
  metadata: {
    type: Schema.Types.Mixed,
    required: false,
  },
}, {
  timestamps: true,
});

// Index for efficient queries
balanceHistorySchema.index({ user: 1, createdAt: -1 });
balanceHistorySchema.index({ user: 1, changeType: 1, createdAt: -1 });

export default balanceHistorySchema;