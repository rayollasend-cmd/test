// src/pages/DashboardPage.jsx - User dashboard page

import { WalletCard } from '../components/WalletCard';
import { TransactionHistory } from '../components/TransactionHistory';

export function DashboardPage() {
  const wallets = [
    { currency: 'USD', balance: 1250.50 },
    { currency: 'JMD', balance: 187500 }
  ];

  const handleTopUp = (currency) => {
    console.log('Top up wallet:', currency);
    // TODO: Navigate to top-up page
  };

  const handleConvert = (currency) => {
    console.log('Convert currency:', currency);
    // TODO: Navigate to currency conversion page
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome, John</h1>
          <p className="text-gray-600">Manage your transfers and wallets</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <a
            href="/send-money"
            className="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 transition"
          >
            <div className="text-3xl mb-2">✈️</div>
            <h3 className="font-semibold">Send Money</h3>
            <p className="text-sm opacity-90">Transfer to recipients</p>
          </a>
          <a
            href="/recipients"
            className="bg-green-600 text-white p-6 rounded-lg hover:bg-green-700 transition"
          >
            <div className="text-3xl mb-2">👥</div>
            <h3 className="font-semibold">Recipients</h3>
            <p className="text-sm opacity-90">Manage beneficiaries</p>
          </a>
          <a
            href="/wallet"
            className="bg-purple-600 text-white p-6 rounded-lg hover:bg-purple-700 transition"
          >
            <div className="text-3xl mb-2">💰</div>
            <h3 className="font-semibold">Wallet</h3>
            <p className="text-sm opacity-90">View balances</p>
          </a>
          <a
            href="/profile"
            className="bg-orange-600 text-white p-6 rounded-lg hover:bg-orange-700 transition"
          >
            <div className="text-3xl mb-2">⚙️</div>
            <h3 className="font-semibold">Settings</h3>
            <p className="text-sm opacity-90">Account settings</p>
          </a>
        </div>

        {/* Wallets Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Your Wallets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {wallets.map(wallet => (
              <WalletCard
                key={wallet.currency}
                currency={wallet.currency}
                balance={wallet.balance}
                onTopUp={handleTopUp}
                onConvert={handleConvert}
              />
            ))}
          </div>
        </section>

        {/* Transaction History Section */}
        <section className="bg-white p-6 rounded-lg shadow">
          <TransactionHistory />
        </section>
      </div>
    </div>
  );
}

export default DashboardPage;
