import { useMemo } from 'react';
import { OGDialog, OGDialogContent, OGDialogHeader, OGDialogTitle, DataTable } from '@librechat/client';
import { useTransactionHistoryInfiniteQuery } from '~/data-provider';
import { transactionColumns } from '~/components/Chat/Input/Files/TransactionColumns';
import { useLocalize } from '~/hooks';

export default function TransactionHistory({ open, onOpenChange }) {
  const localize = useLocalize();

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useTransactionHistoryInfiniteQuery(
    { limit: 20 },
    { enabled: open }
  );

  const transactions = useMemo(() => {
    return data?.pages.flatMap(page => page.transactions) || [];
  }, [data]);

  const handleFetchNextPage = async () => {
    await fetchNextPage();
  };

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
          <DataTable 
            columns={transactionColumns} 
            data={transactions}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            fetchNextPage={handleFetchNextPage}
            isLoading={isLoading}
          />
        )}
      </OGDialogContent>
    </OGDialog>
  );
}