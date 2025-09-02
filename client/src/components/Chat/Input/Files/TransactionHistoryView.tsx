import { OGDialog, OGDialogContent, OGDialogHeader, OGDialogTitle } from '@librechat/client';
import { useGetTransactionHistory } from '~/data-provider';
import { DataTable } from './Table';
import { transactionColumns } from '~/components/Chat/Input/Files/TransactionColumns';
import { useLocalize } from '~/hooks';

export default function TransactionHistory({ open, onOpenChange }) {
  const localize = useLocalize();

  const { data, isLoading } = useGetTransactionHistory(1, 10, { enabled: open });
  const transactions = data?.transactions || [];

  return (
    <OGDialog open={open} onOpenChange={onOpenChange}>
      <OGDialogContent
        title="Transaction History"
        className="w-11/12 bg-background text-text-primary shadow-2xl"
      >
        <OGDialogHeader>
          <OGDialogTitle>Transaction History</OGDialogTitle>
        </OGDialogHeader>
        {isLoading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <DataTable columns={transactionColumns} data={transactions} />
        )}
      </OGDialogContent>
    </OGDialog>
  );
}