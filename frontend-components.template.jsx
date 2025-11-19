// src/components/ - React component templates

// ============ LOGIN FORM COMPONENT ============
// components/Auth/LoginForm.jsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional()
});

export function LoginForm({ onSuccess }) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Call auth API
      // const response = await authService.login(data);
      // Store JWT token
      // Redirect to dashboard
      onSuccess?.();
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md mx-auto">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Email</label>
        <input
          type="email"
          {...register('email')}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="your@email.com"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Password</label>
        <input
          type="password"
          {...register('password')}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="••••••••"
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}

// ============ SEND MONEY FORM ============
// components/Transaction/SendMoneyForm.jsx
export function SendMoneyForm() {
  const [step, setStep] = useState(1); // Multi-step form
  const [formData, setFormData] = useState({
    recipientId: '',
    amount: '',
    currency: 'USD'
  });
  const [quote, setQuote] = useState(null);

  const handleGetQuote = async () => {
    // Call API to get quote
    // setQuote(response);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {step === 1 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Select Recipient</h2>
          {/* Recipient list/selection */}
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Enter Amount</h2>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            placeholder="Amount"
            className="w-full px-4 py-2 border rounded-lg mb-4"
          />
          <select
            value={formData.currency}
            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg mb-4"
          >
            <option value="USD">USD - United States Dollar</option>
            <option value="JMD">JMD - Jamaican Dollar</option>
            <option value="TTD">TTD - Trinidad & Tobago Dollar</option>
            <option value="BDS">BDS - Barbados Dollar</option>
          </select>
          <button onClick={handleGetQuote} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            Get Quote
          </button>
        </div>
      )}

      {step === 3 && quote && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Review Transfer</h2>
          <div className="bg-gray-50 p-6 rounded-lg mb-4">
            <p className="mb-2">Amount to send: <strong>{quote.amountSent}</strong></p>
            <p className="mb-2">Exchange rate: <strong>{quote.exchangeRate}</strong></p>
            <p className="mb-2">Fees: <strong>{quote.fee}</strong></p>
            <p className="mb-2">Amount to receive: <strong>{quote.amountReceived}</strong></p>
            <p>Estimated delivery: <strong>{quote.estimatedDelivery}</strong></p>
          </div>
          <button className="w-full bg-green-600 text-white py-2 rounded-lg">
            Confirm & Pay
          </button>
        </div>
      )}

      <div className="flex gap-2 mt-6">
        {step > 1 && (
          <button onClick={() => setStep(step - 1)} className="flex-1 bg-gray-300 py-2 rounded-lg">
            Back
          </button>
        )}
        {step < 3 && (
          <button onClick={() => setStep(step + 1)} className="flex-1 bg-blue-600 text-white py-2 rounded-lg">
            Next
          </button>
        )}
      </div>
    </div>
  );
}

// ============ TRANSACTION HISTORY ============
// components/Transaction/TransactionHistory.jsx
import { useState, useEffect } from 'react';
import { formatCurrency, formatDate } from '../../utils/formatting';

export function TransactionHistory({ userId }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: '30days'
  });

  useEffect(() => {
    // Fetch transactions
    // setTransactions(response);
    // setLoading(false);
  }, [filters]);

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4">Transfer History</h2>

      <div className="mb-4 flex gap-2">
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-2">
          {transactions.map(tx => (
            <div key={tx.id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50">
              <div>
                <p className="font-semibold">{tx.recipientName}</p>
                <p className="text-sm text-gray-600">{formatDate(tx.createdAt)}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatCurrency(tx.amountSent, tx.currencySent)}</p>
                <p className="text-sm" style={{ color: tx.status === 'completed' ? 'green' : 'orange' }}>
                  {tx.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============ RECIPIENT LIST ============
// components/Recipient/RecipientList.jsx
export function RecipientList({ onSelectRecipient, onAddNew }) {
  const [recipients, setRecipients] = useState([]);

  useEffect(() => {
    // Fetch recipients
    // setRecipients(response);
  }, []);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">My Recipients</h2>
        <button
          onClick={onAddNew}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add Recipient
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recipients.map(recipient => (
          <div
            key={recipient.id}
            onClick={() => onSelectRecipient(recipient)}
            className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
          >
            <p className="font-semibold">{recipient.firstName} {recipient.lastName}</p>
            <p className="text-sm text-gray-600">{recipient.country}</p>
            <p className="text-sm text-gray-600">{recipient.phone}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ WALLET CARD ============
// components/Wallet/WalletCard.jsx
export function WalletCard({ currency, balance, onAction }) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-lg">
      <p className="text-sm opacity-90">Balance</p>
      <h3 className="text-4xl font-bold my-2">{formatCurrency(balance, currency)}</h3>
      <p className="text-sm opacity-90">{currency}</p>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => onAction('topup')}
          className="flex-1 bg-white text-blue-600 py-2 rounded font-semibold hover:bg-blue-50"
        >
          Top Up
        </button>
        <button
          onClick={() => onAction('convert')}
          className="flex-1 bg-white text-blue-600 py-2 rounded font-semibold hover:bg-blue-50"
        >
          Convert
        </button>
      </div>
    </div>
  );
}

// ============ DASHBOARD STATS ============
// components/Dashboard/StatsCard.jsx
export function StatsCard({ title, value, icon: Icon, trend }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <h3 className="text-3xl font-bold mt-2">{value}</h3>
          {trend && (
            <p className={`text-sm mt-2 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
            </p>
          )}
        </div>
        {Icon && <Icon className="text-3xl text-blue-600 opacity-50" />}
      </div>
    </div>
  );
}
