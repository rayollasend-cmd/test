# Caribbean Remittance Platform - Design Document

## 1. Executive Summary

**Product Name:** CaribRemit (or RemitCarib/CaribSend)

A modern, mobile-first cross-border remittance platform designed specifically for the Caribbean region, enabling fast, affordable, and secure money transfers between Caribbean countries and the diaspora.

**Target Markets:**
- Caribbean nationals abroad (diaspora) sending money home
- Caribbean residents receiving remittances from family
- Small businesses transferring funds across Caribbean borders

---

## 2. Market Analysis

### Caribbean Remittance Context
- **Annual Volume:** $40+ billion remittances flow to Caribbean region
- **Key Corridors:** US↔Caribbean, Canada↔Caribbean, UK↔Caribbean
- **Pain Points:**
  - High fees (5-8% on average)
  - Slow transfer times (3-5 business days)
  - Limited digital payment options in some islands
  - Currency fluctuation risks
  - Lack of transparency in exchange rates
  - Regulatory fragmentation across islands

### Competitive Advantages
- Region-specific payment methods (Caribbean mobile money, local bank transfers)
- Competitive FX rates with clear pricing
- Instant or same-day delivery options
- Multi-currency wallets
- Local partnerships with Caribbean banks

---

## 3. Product Features

### Phase 1: MVP Features
1. **User Registration & Verification**
   - Email/phone verification
   - ID verification (passport, national ID)
   - Address verification
   - KYC/AML compliance

2. **Money Transfer**
   - Send money to bank accounts
   - Send money to mobile wallets
   - Send money to cash pickup locations
   - Real-time exchange rate quotes
   - Transfer status tracking

3. **Recipient Management**
   - Add and manage multiple recipients
   - Saved recipient profiles
   - Quick repeat transfers

4. **Wallet (Optional)**
   - Hold and manage multiple currencies
   - Receive funds from international sources
   - Currency conversion

5. **Dashboard**
   - Transfer history
   - Upcoming bills
   - Exchange rates
   - Profile management

### Phase 2: Advanced Features
- Scheduled recurring transfers
- Bills payment integration
- API for businesses (B2B remittance)
- Loyalty/referral programs
- Cryptocurrency payment options
- Mobile app (iOS/Android)

### Phase 3: Enterprise Features
- White-label solutions for Caribbean banks
- Settlement services
- Compliance & reporting dashboards

---

## 4. System Architecture

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────┐
│                    Frontend Layer                        │
│         (React/Vue - Web, React Native - Mobile)         │
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────┴───────────────────────────────────────┐
│                  API Gateway / LB                         │
│               (Kong or AWS API Gateway)                   │
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────┴──────────────────────────────────────┐
│            Microservices Layer                          │
├──────────────────────────────────────────────────────┤
│  • Auth Service      • Transaction Service           │
│  • User Service      • Payment Service               │
│  • Recipient Service • Notification Service          │
│  • Wallet Service    • Compliance Service            │
│  • FX Service        • Settlement Service            │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────┴──────────────────────────────────┐
│              Data & Cache Layer                     │
├──────────────────────────────────────────────────┤
│  • PostgreSQL (Primary DB)                        │
│  • Redis (Caching & Sessions)                     │
│  • MongoDB (Transaction logs)                     │
│  • Elasticsearch (Search & Analytics)             │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────┴──────────────────────────────┐
│         External Integrations                   │
├──────────────────────────────────────────────────┤
│  • Payment Processors (Stripe, PayPal)           │
│  • Caribbean Banks APIs                          │
│  • Mobile Money Operators                        │
│  • FX Rate Providers                             │
│  • Compliance Platforms (Plaid, etc.)            │
│  • SMS/Email Providers                           │
└──────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend:**
- Framework: React.js / Next.js with TypeScript
- State Management: Redux Toolkit / Zustand
- UI Library: Material-UI / Tailwind CSS
- Forms: React Hook Form + Zod validation
- Mobile: React Native / Flutter (future)

**Backend:**
- Runtime: Node.js + Express.js or Python FastAPI
- API: REST + GraphQL (for complex queries)
- Authentication: JWT + OAuth 2.0
- Rate Limiting: Token bucket algorithm

**Databases:**
- Primary: PostgreSQL (ACID compliance for financial transactions)
- Cache: Redis (sessions, rate limits, exchange rates)
- Logs: MongoDB or ELK stack
- Search: Elasticsearch

**Infrastructure:**
- Containerization: Docker
- Orchestration: Kubernetes or ECS
- Cloud: AWS / Google Cloud / Azure
- CDN: CloudFlare
- Message Queue: RabbitMQ or AWS SQS

**DevOps:**
- CI/CD: GitHub Actions / GitLab CI
- Monitoring: Datadog / NewRelic
- Logging: ELK Stack / CloudWatch
- Error Tracking: Sentry

---

## 5. Database Schema

### Core Entities

```sql
-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  date_of_birth DATE,
  nationality VARCHAR(100),
  kyc_status ENUM('pending', 'verified', 'rejected'),
  kyc_verified_at TIMESTAMP,
  profile_photo_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

-- User Addresses
CREATE TABLE user_addresses (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  address_type ENUM('residential', 'business'),
  street_address VARCHAR(255),
  city VARCHAR(100),
  state_province VARCHAR(100),
  country VARCHAR(100),
  postal_code VARCHAR(20),
  is_primary BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bank Accounts
CREATE TABLE bank_accounts (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  account_type ENUM('checking', 'savings'),
  account_number VARCHAR(255) ENCRYPTED,
  bank_code VARCHAR(10),
  bank_name VARCHAR(255),
  routing_number VARCHAR(20),
  country_code CHAR(2),
  currency_code CHAR(3),
  account_holder_name VARCHAR(255),
  is_verified BOOLEAN DEFAULT FALSE,
  verification_code VARCHAR(50),
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP,
  deleted_at TIMESTAMP
);

-- Recipients
CREATE TABLE recipients (
  id UUID PRIMARY KEY,
  sender_user_id UUID NOT NULL REFERENCES users(id),
  recipient_type ENUM('bank_account', 'mobile_wallet', 'cash_pickup'),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(255),
  country_code CHAR(2),
  relationship VARCHAR(50),
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

-- Recipient Details (polymorphic)
CREATE TABLE recipient_bank_details (
  id UUID PRIMARY KEY,
  recipient_id UUID NOT NULL REFERENCES recipients(id),
  bank_name VARCHAR(255),
  account_number VARCHAR(255) ENCRYPTED,
  account_type ENUM('checking', 'savings'),
  currency_code CHAR(3),
  routing_number VARCHAR(20),
  swift_code VARCHAR(20),
  iban VARCHAR(34)
);

CREATE TABLE recipient_mobile_details (
  id UUID PRIMARY KEY,
  recipient_id UUID NOT NULL REFERENCES recipients(id),
  mobile_operator VARCHAR(100),
  phone_number VARCHAR(20),
  country_code CHAR(2)
);

-- Transactions
CREATE TABLE transactions (
  id UUID PRIMARY KEY,
  sender_user_id UUID NOT NULL REFERENCES users(id),
  recipient_id UUID NOT NULL REFERENCES recipients(id),
  transaction_type ENUM('send_money', 'request_money', 'topup'),
  status ENUM('pending', 'processing', 'completed', 'failed', 'cancelled'),
  amount_sent DECIMAL(15, 2),
  currency_sent CHAR(3),
  amount_received DECIMAL(15, 2),
  currency_received CHAR(3),
  exchange_rate DECIMAL(10, 6),
  fee DECIMAL(10, 2),
  fee_currency CHAR(3),
  payment_method ENUM('bank_transfer', 'card', 'wallet', 'crypto'),
  delivery_method ENUM('bank_deposit', 'mobile_money', 'cash_pickup'),
  reference_number VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  expires_at TIMESTAMP
);

-- Transaction Timeline (for status tracking)
CREATE TABLE transaction_events (
  id UUID PRIMARY KEY,
  transaction_id UUID NOT NULL REFERENCES transactions(id),
  event_type VARCHAR(50),
  event_description TEXT,
  event_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Wallets (Multi-currency)
CREATE TABLE wallets (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  currency_code CHAR(3),
  balance DECIMAL(15, 2) DEFAULT 0,
  available_balance DECIMAL(15, 2) DEFAULT 0,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Exchange Rates (cache)
CREATE TABLE exchange_rates (
  id UUID PRIMARY KEY,
  from_currency CHAR(3),
  to_currency CHAR(3),
  rate DECIMAL(10, 6),
  source VARCHAR(100),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP
);

-- Fee Structure
CREATE TABLE fee_structure (
  id UUID PRIMARY KEY,
  from_country CHAR(2),
  to_country CHAR(2),
  transfer_method VARCHAR(50),
  recipient_type VARCHAR(50),
  amount_min DECIMAL(15, 2),
  amount_max DECIMAL(15, 2),
  fixed_fee DECIMAL(10, 2),
  percentage_fee DECIMAL(5, 3),
  processing_time_hours INT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Compliance & KYC
CREATE TABLE kyc_documents (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  document_type ENUM('passport', 'national_id', 'drivers_license', 'utility_bill'),
  document_url VARCHAR(500),
  document_number VARCHAR(100),
  expiration_date DATE,
  verified_at TIMESTAMP,
  verification_notes TEXT,
  created_at TIMESTAMP
);

CREATE TABLE suspicious_activity (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  transaction_id UUID REFERENCES transactions(id),
  risk_level ENUM('low', 'medium', 'high'),
  risk_factors TEXT[],
  reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('open', 'investigated', 'cleared', 'escalated')
);
```

---

## 6. API Design

### Authentication Endpoints
```
POST   /api/v1/auth/register          - User registration
POST   /api/v1/auth/login             - User login
POST   /api/v1/auth/refresh           - Refresh JWT token
POST   /api/v1/auth/logout            - User logout
POST   /api/v1/auth/verify-email      - Verify email address
POST   /api/v1/auth/resend-otp        - Resend OTP
POST   /api/v1/auth/forgot-password   - Initiate password reset
POST   /api/v1/auth/reset-password    - Complete password reset
```

### User Management Endpoints
```
GET    /api/v1/users/profile          - Get user profile
PUT    /api/v1/users/profile          - Update user profile
POST   /api/v1/users/addresses        - Add address
GET    /api/v1/users/addresses        - List addresses
PUT    /api/v1/users/addresses/:id    - Update address
DELETE /api/v1/users/addresses/:id    - Delete address
POST   /api/v1/users/bank-accounts    - Add bank account
GET    /api/v1/users/bank-accounts    - List bank accounts
DELETE /api/v1/users/bank-accounts/:id
```

### Recipients Endpoints
```
POST   /api/v1/recipients             - Create recipient
GET    /api/v1/recipients             - List recipients
GET    /api/v1/recipients/:id         - Get recipient details
PUT    /api/v1/recipients/:id         - Update recipient
DELETE /api/v1/recipients/:id         - Delete recipient
```

### Transaction Endpoints
```
POST   /api/v1/transactions/quote     - Get transfer quote
POST   /api/v1/transactions/initiate  - Initiate transfer
GET    /api/v1/transactions           - List transactions
GET    /api/v1/transactions/:id       - Get transaction details
PUT    /api/v1/transactions/:id/cancel - Cancel transaction
GET    /api/v1/transactions/:id/track - Track transaction status
```

### Wallet Endpoints
```
GET    /api/v1/wallets                - Get all wallets
GET    /api/v1/wallets/:currency      - Get wallet balance
POST   /api/v1/wallets/top-up         - Top-up wallet
POST   /api/v1/wallets/convert        - Currency conversion
POST   /api/v1/wallets/transfer       - Transfer between wallets
```

### Exchange Rate Endpoints
```
GET    /api/v1/rates                  - Get current rates
GET    /api/v1/rates/:from/:to        - Get specific rate
GET    /api/v1/rates/historical       - Historical rates
```

### Compliance Endpoints
```
POST   /api/v1/kyc/documents/upload   - Upload KYC document
GET    /api/v1/kyc/status             - Check KYC status
POST   /api/v1/kyc/verify             - Submit for verification
```

---

## 7. Security & Compliance Requirements

### Security Measures
1. **Data Encryption:**
   - TLS 1.3 for all data in transit
   - AES-256 encryption for sensitive data at rest
   - Field-level encryption for PII and financial data
   - HTTPS/SSL enforcement

2. **Authentication & Authorization:**
   - JWT with 15-minute expiration
   - Refresh tokens with 30-day expiration
   - 2FA (SMS/email/authenticator app)
   - Rate limiting (brute-force protection)
   - Session timeout (30 minutes inactive)

3. **PCI-DSS Compliance:**
   - PCI-DSS Level 1 certification target
   - Token payment processing (not storing full card numbers)
   - Secure payment gateway integration
   - Regular security audits

4. **GDPR/Data Protection:**
   - User data retention policies
   - Right to deletion
   - Data export functionality
   - Privacy by design

### Compliance Requirements

**AML/CFT (Anti-Money Laundering / Counter Terrorist Financing):**
- Know Your Customer (KYC) verification
- Know Your Business (KYB) for business accounts
- Sanctions screening against OFAC, UN, EU lists
- Transaction monitoring
- Suspicious activity reporting (SAR)

**Regional Regulations:**
- ECCB (Eastern Caribbean Central Bank) guidelines
- Individual island nation regulations
- FATCA compliance
- Banking secrecy laws

**Financial Regulations:**
- Money transmitter license requirements per jurisdiction
- Reserve requirements
- Transaction reporting thresholds
- Audit trails

---

## 8. User Flows

### Send Money Flow
1. User selects "Send Money"
2. Choose recipient or add new
3. Select destination country
4. Enter amount and select payment method
5. Get quote with fees and exchange rate
6. Review and confirm transfer
7. Complete payment authentication (2FA)
8. Transaction processed and confirmation sent

### Receive Money Flow
1. Recipient receives notification via SMS/email
2. Recipient verifies identity (optional for security)
3. Funds deposited to:
   - Bank account (1-3 business days)
   - Mobile money (instant)
   - Cash pickup location (instant)
4. Confirmation notification sent

### KYC Flow
1. User uploads ID document
2. Liveness check (optional - video selfie)
3. System validates document (automated + manual review)
4. Address verification
5. Approval/rejection notification
6. Access to full features after approval

---

## 9. UI/UX Structure

### Key Pages/Screens

**Desktop Web:**
- `/` - Homepage
- `/auth/signup` - Registration
- `/auth/login` - Login
- `/dashboard` - Main dashboard
- `/send-money` - Send money wizard
- `/recipients` - Manage recipients
- `/transactions` - Transaction history
- `/wallet` - Wallet management
- `/profile` - User profile
- `/settings` - Account settings
- `/help` - Help center

**Mobile App:**
- Home (quick actions)
- Send Money (simplified flow)
- Recipients
- My Transfers
- Wallet
- Profile

### Design System
- **Color Palette:** Caribbean-inspired (blues, turquoise, warm accents)
- **Typography:** Modern, accessible fonts
- **Spacing:** Consistent 8px grid
- **Components:** Reusable, documented components
- **Accessibility:** WCAG 2.1 AA compliance

---

## 10. Integration Partners

### Payment Processors
- Stripe (cards, ACH)
- PayPal (alternative)
- Local payment gateways

### Banks & Financial Institutions
- Caribbean Development Bank
- CIBC Caribbean
- FirstCaribbean International Bank
- NCB Financial Group
- Bank of the Bahamas

### Mobile Money Operators
- Digicel
- Flow (formerly Cable & Wireless)
- Bmobile-vodafone
- Lime (OECS countries)

### FX Providers
- XE.com
- Fixer.io
- Open Exchange Rates

---

## 11. Deployment Strategy

**Environments:**
- Development (local development)
- Staging (production-like testing)
- Production (live)

**Deployment:**
- Blue-green deployment for zero-downtime updates
- Automated rollback capabilities
- Canary deployments for risky changes

**Disaster Recovery:**
- Backup databases in multiple regions
- RTO: 4 hours
- RPO: 15 minutes

---

## 12. Success Metrics

### Business Metrics
- Total transaction volume
- Average transaction value
- Customer acquisition cost (CAC)
- Lifetime value (LTV)
- Monthly active users (MAU)

### Operational Metrics
- Transfer success rate (target: 99.95%)
- Average processing time
- Customer support response time
- Platform uptime (target: 99.99%)

### User Metrics
- User retention rate
- NPS score
- Feature adoption rate
- Customer churn rate

---

## 13. Roadmap

### Q1-Q2 2024: MVP Launch
- Core send money functionality
- User authentication & KYC
- Bank account deposits
- Android/iOS apps

### Q3-Q4 2024: Expansion
- Mobile money integrations
- Cash pickup locations
- Business accounts
- API for partners

### 2025: Scale
- White-label solutions
- Cryptocurrency support
- Bills payment
- International expansion

---

## 14. Risk Analysis

### Technical Risks
- Payment gateway outages
- Database failures
- Security breaches
- Regulatory changes

### Business Risks
- Regulatory approval delays
- Competition from established players
- User adoption challenges
- Currency volatility

### Mitigation Strategies
- Redundancy in critical systems
- Strong security audits
- Legal compliance team
- Hedge FX risks
- Community building & marketing

---

## Appendix: Technology Decision Matrix

| Component | Option 1 | Option 2 | Option 3 | Selected |
|-----------|----------|----------|----------|----------|
| Frontend | React | Vue | Angular | React |
| Backend | Node.js | Python | Java | Node.js |
| Database | PostgreSQL | MySQL | NoSQL | PostgreSQL |
| Auth | JWT | OAuth | Cognito | JWT + OAuth |
| Cache | Redis | Memcached | DynamoDB | Redis |
| Infrastructure | AWS | GCP | Azure | AWS |
| Container | Docker | Podman | - | Docker |
| Orchestration | Kubernetes | ECS | Docker Swarm | Kubernetes |

