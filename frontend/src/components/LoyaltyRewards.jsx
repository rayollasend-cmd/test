// src/components/LoyaltyRewards.jsx - Loyalty rewards component

import { useState, useEffect } from 'react';

export function LoyaltyRewards() {
  const [loyalty, setLoyalty] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // TODO: Fetch loyalty status from API
    // loyaltyService.getLoyaltyStatus()
    const mockLoyalty = {
      tier: 'silver',
      points: 1500,
      totalPoints: 5000,
      cashbackRate: 1.5,
      nextTierProgress: 75,
      referralCode: 'CARIB123ABC',
      referralBonus: 500
    };
    setLoyalty(mockLoyalty);
  }, []);

  const handleCopyReferralCode = () => {
    navigator.clipboard.writeText(loyalty?.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTierColor = (tier) => {
    const colors = {
      bronze: 'bg-amber-100 text-amber-800',
      silver: 'bg-slate-100 text-slate-800',
      gold: 'bg-yellow-100 text-yellow-800',
      platinum: 'bg-purple-100 text-purple-800'
    };
    return colors[tier] || colors.bronze;
  };

  if (!loyalty) return <div>Loading...</div>;

  return (
    <div className="w-full space-y-6">
      <h2 className="text-2xl font-bold">Loyalty Rewards</h2>

      {/* Tier Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold">Your Tier</h3>
            <p className="text-gray-600">Earn rewards on every transfer</p>
          </div>
          <span className={`px-4 py-2 rounded-full font-semibold capitalize ${getTierColor(loyalty.tier)}`}>
            {loyalty.tier}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Progress to next tier</span>
            <span className="text-sm font-semibold">{loyalty.nextTierProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${loyalty.nextTierProgress}%` }}
            />
          </div>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Cashback Rate</p>
            <p className="text-2xl font-bold">{loyalty.cashbackRate}%</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Monthly Limit</p>
            <p className="text-2xl font-bold">$10,000</p>
          </div>
        </div>
      </div>

      {/* Points Balance */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Points Balance</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm opacity-90">Available Points</p>
            <p className="text-4xl font-bold">{loyalty.points.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm opacity-90">Lifetime Points</p>
            <p className="text-4xl font-bold">{loyalty.totalPoints.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Referral Program */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Referral Program</h3>
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-600 mb-2">Your Referral Code</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={loyalty.referralCode}
              readOnly
              className="flex-1 px-4 py-2 bg-white border rounded-lg font-mono"
            />
            <button
              onClick={handleCopyReferralCode}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Earn ${loyalty.referralBonus / 100} for each successful referral
          </p>
        </div>

        {/* Share Options */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Share with friends</p>
          <div className="flex gap-2">
            <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
              📘 Facebook
            </button>
            <button className="flex-1 bg-blue-400 text-white py-2 rounded-lg hover:bg-blue-500">
              𝕏 Twitter
            </button>
            <button className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
              💬 WhatsApp
            </button>
          </div>
        </div>
      </div>

      {/* Referral Earnings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Referral Earnings</h3>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Referrals</p>
            <p className="text-3xl font-bold">10</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Active Referrals</p>
            <p className="text-3xl font-bold">8</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Earned</p>
            <p className="text-3xl font-bold">$2,500</p>
          </div>
        </div>

        {referrals.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold">Recent Referrals</h4>
            {referrals.map((ref, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{ref.name}</p>
                  <p className="text-sm text-gray-600">{new Date(ref.date).toLocaleDateString()}</p>
                </div>
                <p className="font-semibold text-green-600">+${ref.bonus.toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rewards Marketplace */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Redeem Rewards</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border-2 border-gray-200 rounded-lg p-4 text-center">
            <p className="text-2xl mb-2">💰</p>
            <p className="font-semibold">$10 Cashback</p>
            <p className="text-sm text-gray-600">1,000 points</p>
            <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              Redeem
            </button>
          </div>
          <div className="border-2 border-gray-200 rounded-lg p-4 text-center">
            <p className="text-2xl mb-2">🎟️</p>
            <p className="font-semibold">Fee Waiver</p>
            <p className="text-sm text-gray-600">500 points</p>
            <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              Redeem
            </button>
          </div>
          <div className="border-2 border-gray-200 rounded-lg p-4 text-center">
            <p className="text-2xl mb-2">👑</p>
            <p className="font-semibold">Premium Support</p>
            <p className="text-sm text-gray-600">2,000 points</p>
            <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              Redeem
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoyaltyRewards;
