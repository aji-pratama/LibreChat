import { ColumnDef } from '@tanstack/react-table';
import { formatDate } from '~/utils';
import { useLocalize } from '~/hooks';

type Transaction = {
  _id: string;
  userId: string;
  tokenType: string;
  rawAmount: number;
  tokenValue: number;
  model?: string;
  context?: string;
  conversationId?: string;
  createdAt: string;
};

export const transactionColumns: ColumnDef<Transaction>[] = [
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }) => {
      const dateString = row.getValue('createdAt') as string;
      return formatDate(dateString);
    },
  },
  {
    accessorKey: 'tokenType',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.getValue('tokenType') as string;
      return (
        <span className="capitalize">
          {type?.replace('_', ' ') || 'Unknown'}
        </span>
      );
    },
  },
  {
    accessorKey: 'rawAmount',
    header: 'Tokens',
    cell: ({ row }) => {
      const amount = row.getValue('rawAmount') as number;
      return (
        <span className="font-mono">
          {amount?.toLocaleString() || '0'}
        </span>
      );
    },
  },
  {
    accessorKey: 'tokenValue',
    header: 'Cost',
    cell: ({ row }) => {
      const value = row.getValue('tokenValue') as number;
      return (
        <span className="font-mono">
          {(value || 0).toFixed(6)}
        </span>
      );
    },
  },
  {
    accessorKey: 'model',
    header: 'Model',
    cell: ({ row }) => {
      const model = row.getValue('model') as string;
      return (
        <span className="text-sm text-gray-600">
          {model || 'N/A'}
        </span>
      );
    },
  },
  {
    accessorKey: 'context',
    header: 'Context',
    cell: ({ row }) => {
      const context = row.getValue('context') as string;
      return (
        <span className="text-sm capitalize">
          {context?.replace('_', ' ') || 'Unknown'}
        </span>
      );
    },
  },
];