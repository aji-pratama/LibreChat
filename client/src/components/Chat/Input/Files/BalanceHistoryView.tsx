import { useState } from 'react';
import { OGDialog, OGDialogContent, OGDialogHeader, OGDialogTitle, Button } from '@librechat/client';
import { useGetBalanceHistory } from '~/data-provider';
import { useLocalize } from '~/hooks';

interface BalanceHistoryItem {
  date: string;
  type: 'spend' | 'refill' | 'purchase';
  amount: number;
  balance: number;
  description: string;
}

export default function BalanceHistoryView({ open, onOpenChange }) {
  const localize = useLocalize();
  const [showBuyBalance, setShowBuyBalance] = useState(false);

  const { data, isLoading } = useGetBalanceHistory(1, 50, { enabled: open });
  const balanceHistory = data?.balanceHistory || [];

  const handleBuyBalance = () => {
    setShowBuyBalance(true);
    // TODO: Implement buy balance functionality
    console.log('Buy balance clicked');
  };

  return (
    <OGDialog open={open} onOpenChange={onOpenChange}>
      <OGDialogContent
        title="Balance History"
        className="w-11/12 bg-background text-text-primary shadow-2xl"
      >
        <OGDialogHeader>
          <OGDialogTitle className="flex items-center justify-between">
            <span>Balance History</span>
            <Button
              onClick={handleBuyBalance}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Buy Balance
            </Button>
          </OGDialogTitle>
        </OGDialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {balanceHistory.length === 0 ? (
              <div className="text-center p-4 text-gray-500">
                No balance history found
              </div>
            ) : (
              <div className="space-y-2">
                {balanceHistory.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-block w-2 h-2 rounded-full ${
                            item.type === 'spend'
                              ? 'bg-red-500'
                              : item.type === 'refill'
                              ? 'bg-blue-500'
                              : 'bg-green-500'
                          }`}
                        ></span>
                        <span className="font-medium">{item.description}</span>
                      </div>
                      <div className="text-sm text-gray-500">{item.date}</div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`font-medium ${
                          item.amount >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {item.amount >= 0 ? '+' : ''}{new Intl.NumberFormat().format(item.amount)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Balance: {new Intl.NumberFormat().format(item.balance)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </OGDialogContent>
    </OGDialog>
  );
}