# CaribRemit Backend API

A Node.js/Express.js RESTful API for the Caribbean Remittance Platform. Provides secure money transfer, user management, and transaction processing endpoints.

## Features

- ✅ User authentication with JWT & 2FA
- ✅ 40+ RESTful API endpoints
- ✅ Sequelize ORM with PostgreSQL
- ✅ Redis caching & session management
- ✅ Rate limiting & security middleware
- ✅ Request validation with Joi
- ✅ Error handling & logging
- ✅ Transaction management
- ✅ KYC/AML compliance
- ✅ Exchange rate management
- ✅ Comprehensive test suite

## Prerequisites

- Node.js >= 18.0.0
- PostgreSQL >= 12
- Redis >= 6
- npm or yarn

## Installation

### 1. Clone and install dependencies

```bash
cd backend
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and set your configuration:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=carib_remit
DB_USER=postgres
DB_PASSWORD=your_password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRATION=15m

# Other services...
```

### 3. Create database

```bash
createdb carib_remit
```

### 4. Run migrations

```bash
npm run migrate
```

### 5. Seed database (optional)

```bash
npm run seed
```

## Running the Application

### Development

```bash
npm run dev
```

Starts on `http://localhost:3000` with hot-reload.

### Production

```bash
npm start
```

### With Docker

```bash
docker build -t carib-remit-backend .
docker run -p 3000:3000 carib-remit-backend
```

## Project Structure

```
backend/
├── src/
│   ├── app.js                 # Express app setup
│   ├── config/                # Configuration files
│   │   └── database.js        # Sequelize config
│   ├── middleware/            # Custom middleware
│   │   ├── authenticate.js    # JWT verification
│   │   ├── errorHandler.js    # Error handling
│   │   ├── rateLimit.js       # Rate limiting
│   │   ├── validateRequest.js # Request validation
│   │   └── authorize.js       # Authorization
│   ├── routes/                # API routes
│   │   ├── auth.js            # Authentication (8 endpoints)
│   │   ├── users.js           # Users (9 endpoints)
│   │   ├── recipients.js      # Recipients (5 endpoints)
│   │   ├── transactions.js    # Transactions (6 endpoints)
│   │   ├── wallets.js         # Wallets (5 endpoints)
│   │   └── rates.js           # Exchange rates (3 endpoints)
│   ├── controllers/           # Route controllers (coming soon)
│   ├── models/                # Sequelize models
│   │   ├── User.js
│   │   ├── Transaction.js
│   │   ├── Recipient.js
│   │   ├── Wallet.js
│   │   ├── ExchangeRate.js
│   │   ├── FeeStructure.js
│   │   ├── KYCDocument.js
│   │   └── index.js           # Models & associations
│   ├── services/              # Business logic
│   │   ├── authService.js
│   │   ├── transactionService.js
│   │   ├── recipientService.js
│   │   ├── walletService.js
│   │   ├── rateService.js
│   │   └── kycService.js
│   ├── utils/                 # Utility functions
│   ├── migrations/            # Database migrations
│   │   └── 001_init_schema.sql
│   └── tests/                 # Test files
│       ├── authService.test.js
│       └── transactionService.test.js
├── Dockerfile
├── .dockerignore
├── package.json
├── .env.example
└── README.md
```

## API Endpoints

### Authentication (8 endpoints)

```
POST   /api/v1/auth/register          Register a new user
POST   /api/v1/auth/login             User login
POST   /api/v1/auth/refresh           Refresh JWT token
POST   /api/v1/auth/logout            Logout user
POST   /api/v1/auth/verify-email      Verify email address
POST   /api/v1/auth/forgot-password   Request password reset
POST   /api/v1/auth/reset-password    Complete password reset
```

### User Management (9 endpoints)

```
GET    /api/v1/users/profile          Get user profile
PUT    /api/v1/users/profile          Update user profile
POST   /api/v1/users/addresses        Add address
GET    /api/v1/users/addresses        List addresses
PUT    /api/v1/users/addresses/:id    Update address
DELETE /api/v1/users/addresses/:id    Delete address
POST   /api/v1/users/bank-accounts    Add bank account
GET    /api/v1/users/bank-accounts    List bank accounts
DELETE /api/v1/users/bank-accounts/:id Delete bank account
```

### Recipients (5 endpoints)

```
POST   /api/v1/recipients             Create recipient
GET    /api/v1/recipients             List recipients
GET    /api/v1/recipients/:id         Get recipient details
PUT    /api/v1/recipients/:id         Update recipient
DELETE /api/v1/recipients/:id         Delete recipient
```

### Transactions (6 endpoints)

```
POST   /api/v1/transactions/quote     Get transfer quote
POST   /api/v1/transactions/initiate  Initiate transfer
GET    /api/v1/transactions           List transactions
GET    /api/v1/transactions/:id       Get transaction details
POST   /api/v1/transactions/:id/cancel Cancel transaction
GET    /api/v1/transactions/:id/track Track transfer status
```

### Wallets (5 endpoints)

```
GET    /api/v1/wallets                Get all wallets
GET    /api/v1/wallets/:currency      Get wallet balance
POST   /api/v1/wallets/top-up         Top up wallet
POST   /api/v1/wallets/convert        Convert currency
POST   /api/v1/wallets/transfer       Transfer between wallets
```

### Exchange Rates (3 endpoints)

```
GET    /api/v1/rates                  Get current rates
GET    /api/v1/rates/:from/:to        Get specific rate
GET    /api/v1/rates/historical/:from/:to Get historical rates
```

### Health Check

```
GET    /health                        Check API health
```

## Testing

### Run all tests

```bash
npm test
```

### Run tests in watch mode

```bash
npm run test:watch
```

### Run tests with coverage

```bash
npm test -- --coverage
```

## Database Models

### User
- ID (UUID)
- Email (unique)
- Phone (unique)
- Password Hash
- KYC Status (pending, verified, rejected)
- 2FA Support
- Relationships: Wallets, Recipients, Transactions, KYC Documents

### Transaction
- ID (UUID)
- Sender User ID
- Recipient ID
- Status (pending, processing, completed, failed, cancelled)
- Amounts & Currencies (sent, received)
- Exchange Rate & Fee
- Payment & Delivery Methods
- Reference Number

### Recipient
- ID (UUID)
- Sender User ID
- Type (bank_account, mobile_wallet, cash_pickup)
- Contact Information
- Verification Status
- Relationships: Bank Details, Mobile Details

### Wallet
- ID (UUID)
- User ID
- Currency (multi-currency support)
- Balance & Available Balance
- Unique per user per currency

### Exchange Rate
- From Currency
- To Currency
- Rate
- Source
- Expiration Time

## Middleware

### Authentication
Verifies JWT tokens and attaches user info to request.

### Error Handler
Catches and formats all errors with proper HTTP status codes.

### Rate Limiting
Token bucket algorithm limiting to 100 requests per 15 minutes per IP.

### Request Validation
Validates request body against Joi schemas.

### Authorization
Role-based access control for protected routes.

## Security Features

- ✅ JWT authentication with expiration
- ✅ Password hashing with bcrypt
- ✅ CORS protection
- ✅ Helmet.js for HTTP headers
- ✅ Rate limiting
- ✅ Input validation & sanitization
- ✅ SQL injection prevention (Sequelize)
- ✅ Error message sanitization

## Environment Variables

```
# Application
NODE_ENV              # development, production, test
PORT                  # API port (default: 3000)
API_URL              # API base URL
FRONTEND_URL         # Frontend URL for CORS

# Database
DB_HOST              # PostgreSQL host
DB_PORT              # PostgreSQL port
DB_NAME              # Database name
DB_USER              # Database user
DB_PASSWORD          # Database password
DB_POOL_MIN          # Minimum pool size
DB_POOL_MAX          # Maximum pool size

# Redis
REDIS_HOST           # Redis host
REDIS_PORT           # Redis port
REDIS_PASSWORD       # Redis password

# JWT
JWT_SECRET           # JWT signing key
JWT_EXPIRATION       # Token expiration time
JWT_REFRESH_SECRET   # Refresh token key
JWT_REFRESH_EXPIRATION

# Security
BCRYPT_ROUNDS        # Bcrypt hash rounds
RATE_LIMIT_WINDOW_MS # Rate limit window
RATE_LIMIT_MAX_REQUESTS # Max requests per window

# Email
SMTP_HOST            # SMTP server
SMTP_PORT            # SMTP port
SMTP_USER            # SMTP username
SMTP_PASSWORD        # SMTP password

# SMS (Twilio)
TWILIO_ACCOUNT_SID   # Twilio account
TWILIO_AUTH_TOKEN    # Twilio token
TWILIO_PHONE_NUMBER  # Twilio phone

# Payments
STRIPE_SECRET_KEY    # Stripe key
STRIPE_WEBHOOK_SECRET
PAYPAL_CLIENT_ID
PAYPAL_CLIENT_SECRET

# External APIs
FX_API_KEY           # FX rate API key
```

## Logging

Uses Morgan for HTTP request logging and custom logging for application events.

## Error Handling

All errors are caught and returned in standard format:

```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    { "field": "email", "message": "Invalid email" }
  ]
}
```

## Useful Commands

```bash
npm run dev              # Start development server
npm start               # Start production server
npm test                # Run tests
npm run test:watch      # Watch mode tests
npm run lint            # Lint code
npm run migrate         # Run database migrations
npm run seed            # Seed database
npm run docker:build    # Build Docker image
npm run docker:run      # Run Docker container
```

## Performance

- Database connection pooling (min: 2, max: 10)
- Redis caching for exchange rates
- Request rate limiting
- Indexed database queries
- Compression for responses

## Deployment

### Docker Deployment

```bash
docker build -t carib-remit-backend .
docker run -p 3000:3000 \
  -e DB_HOST=db.example.com \
  -e DB_USER=postgres \
  carib-remit-backend
```

### Environment-specific configs

Development environment variables are in `.env`
Production should use secure vaults (AWS Secrets Manager, etc.)

## Troubleshooting

### Database connection failed
- Check DB_HOST, DB_PORT, DB_USER, DB_PASSWORD
- Ensure PostgreSQL is running
- Verify network connectivity

### Redis connection failed
- Check REDIS_HOST, REDIS_PORT
- Ensure Redis is running
- Check firewall rules

### Rate limit hit
- Check RATE_LIMIT_WINDOW_MS and RATE_LIMIT_MAX_REQUESTS
- Implement exponential backoff in clients

## Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Commit changes: `git commit -am 'feat: add feature'`
3. Push to branch: `git push origin feature/name`
4. Submit pull request

## License

MIT License - See LICENSE file for details

## Support

For issues and questions:
- GitHub Issues: [project repository]
- Email: support@caribremit.com

---

**Built with ❤️ for the Caribbean**
