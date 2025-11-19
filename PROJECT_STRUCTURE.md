# Project Structure

## Recommended Directory Layout

```
carib-remit/
├── backend/                    # Node.js/Express backend
│   ├── src/
│   │   ├── config/             # Configuration files
│   │   │   ├── database.js
│   │   │   ├── redis.js
│   │   │   └── environment.js
│   │   ├── controllers/        # Route controllers
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   ├── transactionController.js
│   │   │   ├── recipientController.js
│   │   │   ├── walletController.js
│   │   │   └── rateController.js
│   │   ├── models/             # Database models
│   │   │   ├── User.js
│   │   │   ├── Transaction.js
│   │   │   ├── Recipient.js
│   │   │   ├── Wallet.js
│   │   │   └── ExchangeRate.js
│   │   ├── routes/             # API routes
│   │   │   ├── auth.js
│   │   │   ├── users.js
│   │   │   ├── transactions.js
│   │   │   ├── recipients.js
│   │   │   ├── wallets.js
│   │   │   └── rates.js
│   │   ├── middleware/         # Custom middleware
│   │   │   ├── authenticate.js
│   │   │   ├── authorize.js
│   │   │   ├── validateRequest.js
│   │   │   ├── errorHandler.js
│   │   │   └── rateLimit.js
│   │   ├── services/           # Business logic
│   │   │   ├── authService.js
│   │   │   ├── transactionService.js
│   │   │   ├── kycService.js
│   │   │   ├── paymentService.js
│   │   │   ├── notificationService.js
│   │   │   └── rateService.js
│   │   ├── utils/              # Utility functions
│   │   │   ├── encryption.js
│   │   │   ├── validation.js
│   │   │   ├── logger.js
│   │   │   └── errorHandler.js
│   │   ├── migrations/         # Database migrations
│   │   │   ├── 001_init_schema.sql
│   │   │   └── ...
│   │   ├── tests/              # Unit & integration tests
│   │   │   ├── auth.test.js
│   │   │   ├── transaction.test.js
│   │   │   └── ...
│   │   └── app.js              # Express app setup
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   ├── docker-compose.yml
│   └── README.md
│
├── frontend/                   # React frontend
│   ├── public/                 # Static assets
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   │   ├── Auth/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   └── SignupForm.jsx
│   │   │   ├── Transaction/
│   │   │   │   ├── SendMoneyWizard.jsx
│   │   │   │   ├── TransactionHistory.jsx
│   │   │   │   └── TransactionDetail.jsx
│   │   │   ├── Recipient/
│   │   │   │   ├── RecipientList.jsx
│   │   │   │   ├── AddRecipient.jsx
│   │   │   │   └── RecipientForm.jsx
│   │   │   ├── Layout/
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── Footer.jsx
│   │   │   ├── Common/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Form.jsx
│   │   │   │   └── Loading.jsx
│   │   │   └── Wallet/
│   │   │       ├── WalletCard.jsx
│   │   │       └── CurrencyConverter.jsx
│   │   ├── pages/              # Page components
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── SendMoneyPage.jsx
│   │   │   ├── RecipientsPage.jsx
│   │   │   ├── TransactionsPage.jsx
│   │   │   ├── WalletPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── SettingsPage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   ├── hooks/              # Custom React hooks
│   │   │   ├── useAuth.js
│   │   │   ├── useTransaction.js
│   │   │   ├── useFetch.js
│   │   │   └── useForm.js
│   │   ├── services/           # API services
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── transactionService.js
│   │   │   ├── userService.js
│   │   │   └── rateService.js
│   │   ├── store/              # Redux store
│   │   │   ├── store.js
│   │   │   ├── slices/
│   │   │   │   ├── authSlice.js
│   │   │   │   ├── transactionSlice.js
│   │   │   │   ├── userSlice.js
│   │   │   │   └── uiSlice.js
│   │   │   └── selectors/
│   │   ├── styles/             # Global styles
│   │   │   ├── index.css
│   │   │   ├── variables.css
│   │   │   └── theme.js
│   │   ├── utils/              # Utility functions
│   │   │   ├── validation.js
│   │   │   ├── formatting.js
│   │   │   ├── errorHandler.js
│   │   │   └── storage.js
│   │   ├── App.jsx             # Main App component
│   │   ├── index.jsx           # Entry point
│   │   └── config.js           # App configuration
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   ├── vite.config.js          # Vite configuration
│   ├── tailwind.config.js      # Tailwind CSS config
│   └── README.md
│
├── mobile/                     # React Native mobile app (future)
│   ├── app/
│   ├── src/
│   ├── package.json
│   └── README.md
│
├── docs/                       # Documentation
│   ├── API.md                  # API documentation
│   ├── DEVELOPMENT.md          # Development guide
│   ├── DEPLOYMENT.md           # Deployment guide
│   ├── SECURITY.md             # Security guidelines
│   └── TESTING.md              # Testing guide
│
├── docker-compose.yml          # Docker Compose for local dev
├── .github/                    # GitHub workflows
│   ├── workflows/
│   │   ├── ci.yml              # CI pipeline
│   │   ├── test.yml            # Testing pipeline
│   │   └── deploy.yml          # Deployment pipeline
│   └── CONTRIBUTING.md
│
├── DESIGN.md                   # System design document
├── PROJECT_STRUCTURE.md        # This file
├── README.md                   # Project overview
├── LICENSE                     # License
└── .gitignore
```

## Key Directories

### Backend (`/backend`)
- **config/**: Configuration for databases, external services
- **controllers/**: Route handlers
- **models/**: Database schemas and ORM models
- **routes/**: API route definitions
- **middleware/**: Authentication, validation, error handling
- **services/**: Business logic separated from routes
- **utils/**: Helper functions
- **migrations/**: Database schema changes
- **tests/**: Test files

### Frontend (`/frontend`)
- **components/**: Reusable UI components
- **pages/**: Full page components
- **hooks/**: Custom React hooks for logic
- **services/**: API client code
- **store/**: Redux state management
- **styles/**: CSS and theming
- **utils/**: Helper functions

### Documentation (`/docs`)
- Guides for developers
- API documentation
- Deployment instructions
- Security best practices

## Naming Conventions

### Files
- Components: `PascalCase` (e.g., `TransactionForm.jsx`)
- Utilities: `camelCase` (e.g., `formatCurrency.js`)
- Config: `camelCase` (e.g., `database.js`)
- Tests: `*.test.js` or `*.spec.js`

### Git Branches
- Feature: `feature/description`
- Bug fix: `bugfix/description`
- Release: `release/version`
- Hotfix: `hotfix/description`

### Commits
- Format: `[type]: description`
- Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`
- Example: `feat: add send money functionality`

