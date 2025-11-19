// src/components/BillsPayment.jsx - Bills payment component

import { useState, useEffect } from 'react';

export function BillsPayment() {
  const [bills, setBills] = useState([]);
  const [showAddBill, setShowAddBill] = useState(false);
  const [formData, setFormData] = useState({
    billType: '',
    provider: '',
    amount: '',
    dueDate: '',
    isRecurring: false,
    recurringFrequency: 'monthly'
  });

  useEffect(() => {
    // TODO: Fetch bills from API
    // setBills(response.data);
  }, []);

  const handleAddBill = async (e) => {
    e.preventDefault();
    // TODO: Call billService.addBill(formData)
    // TODO: Update bills list
    // TODO: Show success message
    setShowAddBill(false);
    setFormData({
      billType: '',
      provider: '',
      amount: '',
      dueDate: '',
      isRecurring: false,
      recurringFrequency: 'monthly'
    });
  };

  const handlePayBill = async (billId) => {
    // TODO: Call billService.payBill(billId)
    // TODO: Update bill status
    // TODO: Show confirmation
  };

  const getBillIcon = (billType) => {
    const icons = {
      electricity: '⚡',
      water: '💧',
      internet: '📡',
      mobile: '📱',
      insurance: '🛡️',
      tuition: '🎓',
      other: '📋'
    };
    return icons[billType] || '📋';
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Bills Payment</h2>
        <button
          onClick={() => setShowAddBill(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add Bill
        </button>
      </div>

      {/* Add Bill Form */}
      {showAddBill && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">Add New Bill</h3>
          <form onSubmit={handleAddBill} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Bill Type</label>
                <select
                  value={formData.billType}
                  onChange={(e) => setFormData({ ...formData, billType: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                >
                  <option value="">Select type</option>
                  <option value="electricity">Electricity</option>
                  <option value="water">Water</option>
                  <option value="internet">Internet</option>
                  <option value="mobile">Mobile</option>
                  <option value="insurance">Insurance</option>
                  <option value="tuition">Tuition</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Provider</label>
                <input
                  type="text"
                  value={formData.provider}
                  onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Provider name"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Amount</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="0.00"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isRecurring}
                  onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="ml-2">Recurring Bill</span>
              </label>

              {formData.isRecurring && (
                <div>
                  <label className="block text-sm font-medium mb-2">Frequency</label>
                  <select
                    value={formData.recurringFrequency}
                    onChange={(e) => setFormData({ ...formData, recurringFrequency: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="annually">Annually</option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
              >
                Add Bill
              </button>
              <button
                type="button"
                onClick={() => setShowAddBill(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Bills List */}
      <div className="space-y-3">
        {bills.length === 0 ? (
          <p className="text-center text-gray-500">No bills added yet</p>
        ) : (
          bills.map(bill => (
            <div key={bill.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getBillIcon(bill.billType)}</span>
                  <div>
                    <h4 className="font-semibold">{bill.provider}</h4>
                    <p className="text-sm text-gray-600">
                      Due: {new Date(bill.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-right mr-6">
                <p className="text-lg font-bold">${bill.amount.toFixed(2)}</p>
                <p className="text-sm text-gray-600">{bill.status}</p>
              </div>
              {bill.status === 'pending' && (
                <button
                  onClick={() => handlePayBill(bill.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Pay Now
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default BillsPayment;
