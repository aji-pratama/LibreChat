import { Document, Types } from 'mongoose';

export interface IBalanceHistory extends Document {
  user: Types.ObjectId;
  previousBalance: number;
  newBalance: number;
  changeAmount: number;
  changeType: 'refill' | 'purchase' | 'spend' | 'adjustment' | 'autoRefill';
  description: string;
  relatedTransactionId?: Types.ObjectId;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}