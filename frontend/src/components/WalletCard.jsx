// src/components/WalletCard.jsx - Wallet balance card component

export function WalletCard({ currency, balance, onTopUp, onConvert }) {
  const formatCurrency = (amount, curr) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: curr,
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-lg shadow-lg">
      <p className="text-sm opacity-90 mb-2">Balance</p>
      <h3 className="text-4xl font-bold my-2">
        {formatCurrency(balance, currency)}
      </h3>
      <p className="text-sm opacity-90">{currency}</p>

      <div className="mt-6 flex gap-2">
        <button
          onClick={() => onTopUp(currency)}
          className="flex-1 bg-white text-blue-600 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
        >
          + Top Up
        </button>
        <button
          onClick={() => onConvert(currency)}
          className="flex-1 bg-white text-blue-600 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
        >
          ⇄ Convert
        </button>
      </div>
    </div>
  );
}

export default WalletCard;
