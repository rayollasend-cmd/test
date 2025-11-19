// src/components/SendMoneyForm.jsx - Multi-step send money form

import { useState } from 'react';

const CURRENCIES = [
  { code: 'USD', name: 'United States Dollar' },
  { code: 'JMD', name: 'Jamaican Dollar' },
  { code: 'TTD', name: 'Trinidad & Tobago Dollar' },
  { code: 'BDS', name: 'Barbados Dollar' },
  { code: 'KYD', name: 'Cayman Islands Dollar' }
];

export function SendMoneyForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    recipientId: '',
    amount: '',
    sendCurrency: 'USD',
    receiveCurrency: 'JMD'
  });
  const [quote, setQuote] = useState(null);

  const handleGetQuote = async () => {
    // TODO: Call API to get quote
    const mockQuote = {
      exchangeRate: 150.25,
      feeBreakdown: { percentage: 2, fixed: 0, total: 10 },
      amountSent: parseFloat(formData.amount),
      amountReceived: (parseFloat(formData.amount) - 10) * 150.25,
      estimatedDeliveryHours: 24
    };
    setQuote(mockQuote);
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Send Money</h2>

      {/* Step Indicator */}
      <div className="flex justify-between mb-8">
        {[1, 2, 3].map(s => (
          <div
            key={s}
            className={`flex-1 h-2 mx-1 rounded ${
              s <= step ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Step 1: Select Recipient */}
      {step === 1 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Select Recipient</h3>
          <select
            value={formData.recipientId}
            onChange={(e) => setFormData({ ...formData, recipientId: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
          >
            <option value="">-- Choose a recipient --</option>
            <option value="1">Jane Doe (Jamaica)</option>
            <option value="2">John Smith (Trinidad)</option>
            <option value="3">+ Add New Recipient</option>
          </select>
        </div>
      )}

      {/* Step 2: Enter Amount */}
      {step === 2 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Enter Amount</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Amount to Send</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="Enter amount"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Currency</label>
              <select
                value={formData.sendCurrency}
                onChange={(e) => setFormData({ ...formData, sendCurrency: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                {CURRENCIES.map(c => (
                  <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Recipient Gets</label>
            <select
              value={formData.receiveCurrency}
              onChange={(e) => setFormData({ ...formData, receiveCurrency: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleGetQuote}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Get Quote
          </button>
        </div>
      )}

      {/* Step 3: Review Transfer */}
      {step === 3 && quote && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Review Transfer</h3>
          <div className="bg-gray-50 p-6 rounded-lg mb-4 space-y-3">
            <div className="flex justify-between">
              <span>Amount to send:</span>
              <span className="font-semibold">{formData.amount} {formData.sendCurrency}</span>
            </div>
            <div className="flex justify-between">
              <span>Exchange rate:</span>
              <span className="font-semibold">{quote.exchangeRate}</span>
            </div>
            <div className="flex justify-between text-red-600">
              <span>Fee:</span>
              <span className="font-semibold">{quote.feeBreakdown.total}</span>
            </div>
            <div className="border-t pt-3 flex justify-between text-lg">
              <span>Amount to receive:</span>
              <span className="font-bold">{quote.amountReceived.toFixed(2)} {formData.receiveCurrency}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Estimated delivery:</span>
              <span>{quote.estimatedDeliveryHours} hours</span>
            </div>
          </div>
          <button
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 font-semibold"
          >
            Confirm & Pay
          </button>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-2 mt-6">
        {step > 1 && (
          <button
            onClick={handleBack}
            className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
          >
            Back
          </button>
        )}
        {step < 3 && (
          <button
            onClick={handleNext}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}

export default SendMoneyForm;
