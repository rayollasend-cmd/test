# CaribRemit - Advanced Features

Complete documentation of all advanced features added to CaribRemit.

## Overview

Beyond the core money transfer functionality, CaribRemit includes:
1. Bills Payment
2. Cryptocurrency Trading
3. Scheduled/Recurring Transfers
4. Loyalty & Rewards Program

## 1. Bills Payment

### Overview

Allow users to pay bills directly through CaribRemit with support for recurring/scheduled payments.

### Features

- **Bill Types:**
  - Electricity
  - Water
  - Internet
  - Mobile
  - Insurance
  - Tuition
  - Other

- **Payment Options:**
  - One-time payment
  - Recurring payments (weekly, bi-weekly, monthly, quarterly, annually)
  - Scheduled future payments

- **Functionality:**
  - Add and manage bills
  - Set up automatic payments
  - Get reminders for due bills
  - View payment history
  - Cancel recurring bills

### Database Model

```javascript
Bill {
  id: UUID
  userId: UUID
  billType: ENUM (electricity, water, internet, mobile, insurance, tuition, other)
  provider: STRING
  accountNumber: STRING
  amount: DECIMAL
  currency: CHAR(3)
  dueDate: DATE
  status: ENUM (pending, scheduled, paid, overdue, cancelled)
  isRecurring: BOOLEAN
  recurringFrequency: ENUM (weekly, biweekly, monthly, quarterly, annually)
  nextBillDate: DATE
  paymentMethod: STRING
  notes: TEXT
  timestamps
}
```

### API Endpoints

```
POST   /bills              Add bill
GET    /bills              Get user's bills
PUT    /bills/:id          Update bill
DELETE /bills/:id          Delete bill
POST   /bills/:id/pay      Pay bill now
POST   /bills/:id/schedule Schedule payment
GET    /bills/upcoming     Get upcoming bills
POST   /bills/:id/cancel   Cancel recurring
```

### Service Methods

```javascript
billService.addBill(userId, billData)
billService.getBills(userId, filters)
billService.payBill(billId, userId, paymentMethod)
billService.scheduleBillPayment(billId, userId, date)
billService.getUpcomingBills(userId)
billService.setupRecurringBill(userId, billData)
billService.cancelBill(billId, userId)
```

### Frontend Component

```javascript
<BillsPayment />
```

**Features:**
- Add new bills with form
- List bills with due dates
- Pay bills instantly
- Setup recurring payments
- View upcoming bills

---

## 2. Cryptocurrency Trading

### Overview

Enable users to buy, sell, and manage cryptocurrencies with real-time prices.

### Supported Cryptocurrencies

- Bitcoin (BTC)
- Ethereum (ETH)
- USD Coin (USDC)
- Tether (USDT)
- *(Expandable based on demand)*

### Features

- **Trading:**
  - Buy crypto with fiat (USD, JMD, etc.)
  - Sell crypto for fiat
  - Send crypto to wallets
  - Real-time price updates

- **Wallet:**
  - Generate deposit addresses
  - Track balance in multiple cryptos
  - View USD equivalent values
  - Transaction history

- **Security:**
  - Non-custodial or custodial options
  - Address verification
  - Transaction confirmations

### Database Model

```javascript
CryptoTransaction {
  id: UUID
  userId: UUID
  transactionType: ENUM (send, receive, buy, sell)
  cryptocurrency: STRING (BTC, ETH, etc.)
  amount: DECIMAL(18, 8)
  fiatAmount: DECIMAL(15, 2)
  fiatCurrency: CHAR(3)
  exchangeRate: DECIMAL(15, 2)
  fee: DECIMAL(10, 2)
  walletAddress: STRING
  transactionHash: STRING
  status: ENUM (pending, processing, confirmed, failed, cancelled)
  confirmations: INTEGER
  network: STRING
  notes: TEXT
  timestamps
}
```

### API Endpoints

```
GET    /crypto/supported      Get supported cryptos
GET    /crypto/:symbol/price  Get crypto price
POST   /crypto/buy            Buy cryptocurrency
POST   /crypto/sell           Sell cryptocurrency
POST   /crypto/send           Send crypto to address
GET    /crypto/balance/:symbol Get crypto balance
GET    /crypto/history        Get transaction history
GET    /crypto/:txId/track    Track transaction
POST   /crypto/deposit-address Generate deposit address
POST   /crypto/convert        Convert crypto to fiat
```

### Service Methods

```javascript
cryptoService.getSupportedCryptos()
cryptoService.getCryptoPrice(symbol)
cryptoService.buyCrypto(userId, cryptoData)
cryptoService.sellCrypto(userId, cryptoData)
cryptoService.sendCrypto(userId, cryptoData)
cryptoService.getCryptoBalance(userId, cryptocurrency)
cryptoService.getCryptoHistory(userId, filters)
cryptoService.trackCryptoTransaction(transactionId, userId)
cryptoService.convertCryptoToFiat(userId, cryptoData)
cryptoService.generateDepositAddress(userId, cryptocurrency)
```

### Frontend Component

```javascript
<CryptoTrading />
```

**Features:**
- Browse available cryptocurrencies
- View real-time prices
- Buy/Sell crypto with live conversion
- View transaction history
- Track blockchain confirmations

### Pricing Integration

- Uses real-time price feeds (CoinGecko, Binance, etc.)
- Competitive exchange rates
- Transparent fee display
- Historical price charts

---

## 3. Scheduled/Recurring Transfers

### Overview

Allow users to set up automated, recurring transfers to recipients.

### Features

- **Frequency Options:**
  - One-time
  - Weekly
  - Bi-weekly
  - Monthly
  - Quarterly
  - Annually

- **Functionality:**
  - Create scheduled transfers
  - Auto-execute on schedule
  - Pause/Resume transfers
  - Edit transfer amount
  - Retry failed transfers
  - Upcoming transfer notifications
  - Execution history

- **Automation:**
  - Background job processes scheduled transfers
  - Automatic retry on failure (up to 3 times)
  - Email/SMS notifications
  - Recipient notifications

### Database Model

```javascript
ScheduledTransfer {
  id: UUID
  userId: UUID
  recipientId: UUID
  amount: DECIMAL(15, 2)
  currency: CHAR(3)
  frequency: ENUM (once, weekly, biweekly, monthly, quarterly, annually)
  startDate: DATE
  endDate: DATE (optional)
  nextExecutionDate: DATE
  paymentMethod: STRING
  status: ENUM (active, paused, completed, cancelled)
  executionCount: INTEGER
  lastExecutionDate: DATE
  remainingExecutions: INTEGER
  notifyBefore: INTEGER (days)
  timestamps
}
```

### API Endpoints

```
POST   /scheduled-transfers          Create
GET    /scheduled-transfers          List
PUT    /scheduled-transfers/:id      Update
DELETE /scheduled-transfers/:id      Cancel
POST   /scheduled-transfers/:id/pause Pause
POST   /scheduled-transfers/:id/resume Resume
GET    /scheduled-transfers/upcoming Get upcoming
GET    /scheduled-transfers/:id/history Get execution history
POST   /scheduled-transfers/:id/retry Retry failed
```

### Service Methods

```javascript
scheduledTransferService.createScheduledTransfer(userId, transferData)
scheduledTransferService.getScheduledTransfers(userId)
scheduledTransferService.updateScheduledTransfer(transferId, userId, updates)
scheduledTransferService.pauseScheduledTransfer(transferId, userId)
scheduledTransferService.resumeScheduledTransfer(transferId, userId)
scheduledTransferService.cancelScheduledTransfer(transferId, userId)
scheduledTransferService.getExecutionHistory(transferId, userId)
scheduledTransferService.executePendingTransfers() // Background job
scheduledTransferService.getUpcomingTransfers(userId, days)
scheduledTransferService.retryFailedTransfer(transferId, userId)
```

### Background Job

A scheduled job (using node-cron or Bull queue) runs periodically to:
1. Find transfers with nextExecutionDate <= now
2. Execute transfer
3. Update nextExecutionDate based on frequency
4. Send notifications
5. Log execution
6. Handle errors and retries

---

## 4. Loyalty & Rewards Program

### Overview

Reward users for using the platform with points, cashback, and tiered benefits.

### Tier System

```
Bronze (default)
├─ Cashback: 0.5%
├─ Monthly Limit: $5,000
└─ Features: Basic support

Silver
├─ Cashback: 1.5%
├─ Monthly Limit: $10,000
├─ Features: Priority support, Exclusive offers
└─ Requirement: 2,500 lifetime points

Gold
├─ Cashback: 2.5%
├─ Monthly Limit: $25,000
├─ Features: VIP support, Premium offers, Fee waiver
└─ Requirement: 10,000 lifetime points

Platinum
├─ Cashback: 3.5%
├─ Monthly Limit: $50,000
├─ Features: Personal manager, Exclusive events, Custom rates
└─ Requirement: 50,000 lifetime points
```

### Features

- **Points System:**
  - Earn points on every transfer
  - Earn bonus points on bills, crypto
  - Points never expire
  - Track lifetime and available points

- **Cashback:**
  - Automatic cashback on all transactions
  - Tier-based percentage (0.5% - 3.5%)
  - Monthly spending limits
  - Automatic redemption

- **Referral Program:**
  - Generate unique referral codes
  - Share with friends
  - Earn $25 for each successful referral
  - Unlimited referral earnings

- **Rewards Marketplace:**
  - $10 Cashback (1,000 points)
  - Transfer Fee Waiver (500 points)
  - Premium Support (2,000 points)
  - Custom redemptions

- **Gamification:**
  - Progress bars to next tier
  - Achievement badges
  - Leaderboards
  - Monthly bonuses

### Database Model

```javascript
Loyalty {
  id: UUID
  userId: UUID (unique)
  tier: ENUM (bronze, silver, gold, platinum)
  points: INTEGER
  totalPoints: INTEGER
  referralCode: STRING (unique)
  referralBonus: DECIMAL
  totalReferrals: INTEGER
  cashbackRate: DECIMAL(5, 3)
  monthlyLimit: DECIMAL(15, 2)
  monthlyUsed: DECIMAL(15, 2)
  lastTierUpgrade: DATE
  nextTierProgress: DECIMAL(3, 2)
  timestamps
}
```

### API Endpoints

```
GET    /loyalty/status               Get loyalty status
POST   /loyalty/points/:amount       Add points manually
POST   /loyalty/redeem/:pointsAmount Redeem points
GET    /loyalty/referral/code        Get referral code
POST   /loyalty/referral/:code       Apply referral code
GET    /loyalty/referral/earnings    Get referral earnings
GET    /loyalty/tier/:tier/benefits  Get tier benefits
GET    /loyalty/marketplace          Get rewards to redeem
GET    /loyalty/history              Get points history
POST   /loyalty/upgrade              Upgrade tier manually
```

### Service Methods

```javascript
loyaltyService.getLoyaltyStatus(userId)
loyaltyService.addPoints(userId, amount, reason)
loyaltyService.redeemPoints(userId, amount)
loyaltyService.generateReferralCode(userId)
loyaltyService.applyReferralCode(userId, code)
loyaltyService.getReferralEarnings(userId)
loyaltyService.upgradeTier(userId, newTier)
loyaltyService.getTierBenefits(tier)
loyaltyService.recordTransactionCashback(userId, amount, transactionId)
loyaltyService.getRewardsMarketplace()
loyaltyService.getPointsHistory(userId, limit)
```

### Frontend Component

```javascript
<LoyaltyRewards />
```

**Features:**
- View tier and progress
- Show available points
- Display cashback rate
- Referral code management
- Share to social media
- View referral earnings
- Redeem rewards
- Points history

---

## Integration with Core Features

### Bills + Remittance

Users can pay bills as recipients:
```javascript
// Send money for bill payment
{
  recipientType: 'bill_payment',
  billId: '123...',
  amount: 100,
  currency: 'USD'
}
```

### Crypto + Wallet

Users can hold crypto in wallets:
```javascript
wallet = {
  currency: 'BTC',
  balance: 0.5,
  usdValue: 21750
}
```

### Scheduled + Loyalty

Points earned on each scheduled execution:
```javascript
scheduledTransfer.executionCount++
loyaltyService.recordTransactionCashback(userId, amount)
```

---

## Implementation Roadmap

### Phase 1: Core Integration (Week 1-2)
- [ ] Add database models
- [ ] Create API endpoints
- [ ] Implement services
- [ ] Add backend routes

### Phase 2: Frontend Implementation (Week 3)
- [ ] Create React components
- [ ] Add Redux slices
- [ ] Integrate with API
- [ ] Add UI/UX

### Phase 3: Testing (Week 4)
- [ ] Unit tests for services
- [ ] Integration tests for APIs
- [ ] Component tests for UI
- [ ] E2E testing

### Phase 4: Polish & Deploy (Week 5)
- [ ] Performance optimization
- [ ] Security audit
- [ ] Documentation
- [ ] Deployment

---

## Performance Considerations

### Scheduled Transfers

- Use background job queue (Bull, Celery)
- Process in batches for efficiency
- Implement retry logic with exponential backoff
- Cache frequently accessed schedules

### Crypto Prices

- Cache prices for 1-5 minutes
- Use WebSocket for real-time updates
- Background job to refresh prices hourly
- Alert users of significant price movements

### Loyalty Points

- Cache tier benefits
- Batch point calculations
- Monthly aggregation of spending
- Nightly job to update tier status

---

## Security Considerations

### Cryptocurrency

- Never store private keys on server
- Use hardware wallet for large amounts
- Implement 2FA for crypto transactions
- Address whitelisting for sends

### Bills

- Encrypt account numbers
- Verify ownership before payment
- Rate limit payment attempts
- Audit all payments

### Loyalty

- Prevent point farming
- Monitor unusual referral activity
- Prevent code/point sharing
- Track fraud patterns

---

## Future Enhancements

1. **Insurance**: Payment protection for transfers
2. **Savings**: Auto-save rounded amounts
3. **Investments**: Low-risk investment options
4. **P2P**: Peer-to-peer transfers
5. **Corporate**: Business account features

---

## Testing Checklist

- [ ] Bills can be added, paid, and tracked
- [ ] Scheduled transfers execute on time
- [ ] Crypto prices update in real-time
- [ ] Points earn and redeem correctly
- [ ] Referral codes work as expected
- [ ] Tier upgrades happen automatically
- [ ] Notifications are sent correctly
- [ ] All integrations work together

---

## Documentation Links

- [API Documentation](./backend/README.md)
- [Frontend Guide](./frontend/README.md)
- [Local Setup](./LOCAL_SETUP.md)
- [API Integration](./API_INTEGRATION.md)

---

**Complete advanced feature set ready for development! 🚀**
