import { useState } from 'react';
import { OGDialog, OGDialogContent, OGDialogHeader, OGDialogTitle, Button } from '@librechat/client';
import { useGetTransactionHistory } from '~/data-provider';
import { useLocalize } from '~/hooks';
import type { TTransactionHistoryResponse } from 'librechat-data-provider';

export default function TransactionHistory({ open, onOpenChange }) {
  const localize = useLocalize();
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const { data, isLoading }: { data: TTransactionHistoryResponse | undefined, isLoading: boolean } = useGetTransactionHistory(
    currentPage,
    limit,
    { enabled: open }
  );

  const transactions = data?.transactions || [];
  const pagination = data?.pagination || { page: 1, pages: 1, total: 0 };
  const hasNextPage = currentPage < pagination.pages;
  const hasPreviousPage = currentPage > 1;

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < pagination.pages) {
      setCurrentPage(currentPage + 1);
    }
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
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Tokens</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Cost</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Model</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Context</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction._id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 capitalize">
                        {transaction.tokenType?.replace('_', ' ') || 'Unknown'}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 font-mono">
                        {transaction.rawAmount?.toLocaleString() || '0'}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 font-mono">
                        {(transaction.tokenValue || 0).toFixed(0)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                        {transaction.model || 'N/A'}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm capitalize">
                        {transaction.context?.replace('_', ' ') || 'Unknown'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                 Page {currentPage} of {pagination.pages} ({pagination.total} total)
               </div>
              <div className="flex space-x-2">
                <Button
                   onClick={handlePreviousPage}
                   disabled={!hasPreviousPage}
                   variant="outline"
                   size="sm"
                 >
                   Previous
                 </Button>
                 <Button
                   onClick={handleNextPage}
                   disabled={!hasNextPage}
                   variant="outline"
                   size="sm"
                 >
                   Next
                 </Button>
              </div>
            </div>
          </div>
        )}
      </OGDialogContent>
    </OGDialog>
  );
}