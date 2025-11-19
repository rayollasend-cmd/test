// src/components/TransactionHistory.jsx - Transaction history component

import { useState, useEffect } from 'react';

export function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // TODO: Fetch transactions from API
    const mockTransactions = [
      {
        id: '1',
        recipientName: 'Jane Doe',
        country: 'Jamaica',
        amountSent: 500,
        currencySent: 'USD',
        amountReceived: 75000,
        currencyReceived: 'JMD',
        status: 'completed',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        recipientName: 'John Smith',
        country: 'Trinidad',
        amountSent: 250,
        currencySent: 'USD',
        amountReceived: 1687,
        currencyReceived: 'TTD',
        status: 'completed',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        id: '3',
        recipientName: 'Maria Garcia',
        country: 'Bahamas',
        amountSent: 1000,
        currencySent: 'USD',
        amountReceived: 960,
        currencyReceived: 'BSD',
        status: 'processing',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
      }
    ];

    setTransactions(mockTransactions);
    setLoading(false);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'processing':
        return 'text-blue-600 bg-blue-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredTransactions = filter === 'all'
    ? transactions
    : transactions.filter(t => t.status === filter);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Transfer History</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="processing">Processing</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : filteredTransactions.length === 0 ? (
        <p className="text-center text-gray-500">No transactions found</p>
      ) : (
        <div className="space-y-3">
          {filteredTransactions.map(tx => (
            <div
              key={tx.id}
              className="flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition"
            >
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{tx.recipientName}</p>
                <p className="text-sm text-gray-600">{tx.country} • {formatDate(tx.createdAt)}</p>
              </div>
              <div className="text-right mr-6">
                <p className="font-semibold text-gray-900">
                  -{tx.amountSent} {tx.currencySent}
                </p>
                <p className="text-sm text-green-600">
                  +{tx.amountReceived} {tx.currencyReceived}
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(tx.status)}`}>
                {tx.status}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TransactionHistory;
