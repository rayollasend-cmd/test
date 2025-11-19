// src/components/CryptoTrading.jsx - Crypto trading component

import { useState, useEffect } from 'react';

export function CryptoTrading() {
  const [cryptos, setCryptos] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [tradeType, setTradeType] = useState('buy');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // TODO: Fetch supported cryptos from API
    // cryptoService.getSupportedCryptos()
    const mockCryptos = [
      { symbol: 'BTC', name: 'Bitcoin', price: 43500, change24h: 2.5 },
      { symbol: 'ETH', name: 'Ethereum', price: 2300, change24h: 1.8 },
      { symbol: 'USDC', name: 'USD Coin', price: 1.00, change24h: 0 },
      { symbol: 'USDT', name: 'Tether', price: 1.00, change24h: 0 }
    ];
    setCryptos(mockCryptos);
  }, []);

  const handleTrade = async (e) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Call cryptoService.buyCrypto() or sellCrypto()
    // TODO: Handle response
    // TODO: Show confirmation
    setLoading(false);
  };

  const calculateTotal = () => {
    if (!selectedCrypto || !amount) return 0;
    if (tradeType === 'buy') {
      return (parseFloat(amount) * selectedCrypto.price).toFixed(2);
    } else {
      return (parseFloat(amount) * selectedCrypto.price).toFixed(2);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Cryptocurrency Trading</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Crypto List */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Available Cryptocurrencies</h3>
          <div className="space-y-2">
            {cryptos.map(crypto => (
              <div
                key={crypto.symbol}
                onClick={() => setSelectedCrypto(crypto)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                  selectedCrypto?.symbol === crypto.symbol
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{crypto.name}</p>
                    <p className="text-sm text-gray-600">{crypto.symbol}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${crypto.price.toLocaleString()}</p>
                    <p className={`text-sm ${crypto.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {crypto.change24h > 0 ? '+' : ''}{crypto.change24h}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trade Form */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Trade</h3>
          {selectedCrypto ? (
            <form onSubmit={handleTrade} className="bg-white p-6 rounded-lg shadow space-y-4">
              {/* Trade Type */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setTradeType('buy')}
                  className={`flex-1 py-2 rounded-lg font-semibold transition ${
                    tradeType === 'buy'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Buy
                </button>
                <button
                  type="button"
                  onClick={() => setTradeType('sell')}
                  className={`flex-1 py-2 rounded-lg font-semibold transition ${
                    tradeType === 'sell'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Sell
                </button>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {tradeType === 'buy' ? 'USD Amount' : 'Crypto Amount'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="0.00"
                    step="0.01"
                    required
                  />
                  <span className="absolute right-4 top-2.5 text-gray-600">
                    {tradeType === 'buy' ? 'USD' : selectedCrypto.symbol}
                  </span>
                </div>
              </div>

              {/* Conversion */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Price</span>
                  <span className="font-semibold">${selectedCrypto.price}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-600">You {tradeType === 'buy' ? 'get' : 'receive'}</span>
                  <span className="font-bold">
                    {tradeType === 'buy'
                      ? (parseFloat(amount) / selectedCrypto.price).toFixed(8)
                      : calculateTotal()}{' '}
                    {tradeType === 'buy' ? selectedCrypto.symbol : 'USD'}
                  </span>
                </div>
              </div>

              {/* Fee */}
              <div className="text-sm text-gray-600">
                Fee: $10.00 (0.5%)
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!amount || loading}
                className={`w-full py-2 rounded-lg font-semibold text-white transition ${
                  tradeType === 'buy'
                    ? 'bg-green-600 hover:bg-green-700 disabled:bg-gray-300'
                    : 'bg-red-600 hover:bg-red-700 disabled:bg-gray-300'
                }`}
              >
                {loading ? 'Processing...' : `${tradeType === 'buy' ? 'Buy' : 'Sell'} ${selectedCrypto.symbol}`}
              </button>
            </form>
          ) : (
            <div className="bg-gray-50 p-6 rounded-lg text-center text-gray-600">
              Select a cryptocurrency to start trading
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CryptoTrading;
