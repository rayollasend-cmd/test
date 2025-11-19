# API Integration Guide

Complete guide for connecting the CaribRemit frontend to the backend API.

## Overview

The frontend uses Axios for HTTP requests with Redux for state management. All API calls are centralized in service files and integrated with Redux actions.

## Architecture

```
Frontend Request Flow:
┌─────────────┐
│  Component  │
└──────┬──────┘
       │ calls hook (useAuth, useTransaction)
       ▼
┌─────────────────────┐
│  Custom Hook        │
│  (useAuth.js)       │
└──────┬──────────────┘
       │ dispatches action
       ▼
┌─────────────────────┐
│  Redux Action       │
│  (authSlice.js)     │
└──────┬──────────────┘
       │ calls service
       ▼
┌─────────────────────┐
│  API Service        │
│  (authService.js)   │
└──────┬──────────────┘
       │ HTTP request
       ▼
┌─────────────────────┐
│  Axios Client       │
│  (api.js)           │
└──────┬──────────────┘
       │ HTTP
       ▼
┌─────────────────────┐
│  Backend API        │
│  (Express.js)       │
└─────────────────────┘
```

## Services

### 1. API Client (services/api.js)

Axios instance with global configuration and interceptors.

**Configuration:**
- Base URL: `VITE_API_URL` from environment
- Default timeout: `VITE_API_TIMEOUT` (30000ms)
- Content-Type: application/json

**Request Interceptor:**
- Automatically attaches JWT token from localStorage
- Sets Authorization header: `Bearer {token}`

**Response Interceptor:**
- Handles 401 Unauthorized (logs out user)
- Passes errors to component error handlers

**Usage:**
```javascript
import api from '../services/api';

// GET request
const response = await api.get('/users/profile');

// POST request
const response = await api.post('/transactions/quote', data);

// Request with headers
const response = await api.get('/endpoint', {
  headers: { 'X-Custom': 'value' }
});
```

### 2. Auth Service (services/authService.js)

Handles all authentication API calls.

**Methods:**
```javascript
// Registration
await authService.register({
  email: 'user@example.com',
  password: 'Password123!',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+1234567890'
});

// Login
await authService.login({
  email: 'user@example.com',
  password: 'Password123!'
});

// Refresh token
await authService.refreshToken(refreshToken);

// Logout
await authService.logout();

// Verify email
await authService.verifyEmail(token);

// Password reset
await authService.forgotPassword('user@example.com');
await authService.resetPassword(token, newPassword);
```

**Response Format:**
```javascript
{
  success: true,
  user: {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'user@example.com',
    firstName: 'John',
    kycStatus: 'verified'
  },
  token: 'jwt_token_here',
  refreshToken: 'refresh_token_here'
}
```

### 3. Transaction Service (services/transactionService.js)

Handles all transaction-related API calls.

**Methods:**
```javascript
// Get quote
const quote = await transactionService.getQuote(
  recipientId,
  amount,
  'USD',
  'JMD'
);

// Initiate transfer
const transfer = await transactionService.initiateTransfer(
  recipientId,
  amount,
  'card'
);

// Get transactions
const result = await transactionService.getTransactions({
  status: 'completed',
  limit: 20,
  offset: 0
});

// Get transaction details
const tx = await transactionService.getTransaction(transactionId);

// Cancel transaction
await transactionService.cancelTransaction(transactionId, reason);

// Track transfer
const tracking = await transactionService.trackTransfer(transactionId);
```

**Quote Response:**
```javascript
{
  exchangeRate: 150.25,
  feeBreakdown: {
    percentage: 2,
    fixed: 0,
    total: 10
  },
  amountSent: 500,
  currencySent: 'USD',
  amountReceived: 74987.50,
  currencyReceived: 'JMD',
  estimatedDeliveryHours: 24,
  quoteValidityMinutes: 30
}
```

### 4. User Service (services/userService.js)

Handles user profile and account management.

**Methods:**
```javascript
// Get profile
const profile = await userService.getProfile();

// Update profile
const updated = await userService.updateProfile({
  firstName: 'John',
  lastName: 'Doe'
});

// Addresses
await userService.addAddress({
  street: '123 Main St',
  city: 'Kingston',
  country: 'Jamaica'
});

const addresses = await userService.getAddresses();
await userService.updateAddress(addressId, data);
await userService.deleteAddress(addressId);

// Bank Accounts
await userService.addBankAccount({
  bankName: 'Bank of Jamaica',
  accountNumber: '1234567890',
  accountType: 'savings'
});

const accounts = await userService.getBankAccounts();
await userService.deleteBankAccount(accountId);
```

## Redux Integration

### Auth State Management

**Slice:** `src/store/slices/authSlice.js`

**State:**
```javascript
{
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
}
```

**Actions:**
```javascript
// Login flow
dispatch(loginStart());
dispatch(loginSuccess(userData));
dispatch(loginFailure(errorMessage));

// Register flow
dispatch(registerStart());
dispatch(registerSuccess(userData));
dispatch(registerFailure(errorMessage));

// Logout
dispatch(logout());
```

**Selectors:**
```javascript
const user = useSelector(selectUser);
const token = useSelector(selectToken);
const isAuthenticated = useSelector(selectIsAuthenticated);
const isLoading = useSelector(selectAuthLoading);
const error = useSelector(selectAuthError);
```

### Transaction State Management

**Slice:** `src/store/slices/transactionSlice.js`

**State:**
```javascript
{
  transactions: [],
  currentTransaction: null,
  quote: null,
  isLoading: false,
  error: null,
  filters: { status: 'all', dateRange: '30days' }
}
```

**Actions:**
```javascript
// Quote actions
dispatch(getQuoteStart());
dispatch(getQuoteSuccess(quoteData));
dispatch(getQuoteFailure(error));

// Transfer actions
dispatch(initiateTransferStart());
dispatch(initiateTransferSuccess(transferData));
dispatch(initiateTransferFailure(error));

// Fetch actions
dispatch(fetchTransactionsStart());
dispatch(fetchTransactionsSuccess(transactions));
dispatch(fetchTransactionsFailure(error));

// Clear quote
dispatch(clearQuote());
```

### User State Management

**Slice:** `src/store/slices/userSlice.js`

**State:**
```javascript
{
  profile: null,
  wallets: [],
  recipients: [],
  addresses: [],
  bankAccounts: [],
  isLoading: false,
  error: null
}
```

**Actions:**
```javascript
// Profile actions
dispatch(fetchProfileStart());
dispatch(fetchProfileSuccess(profile));
dispatch(fetchProfileFailure(error));

// Wallet actions
dispatch(fetchWalletsStart());
dispatch(fetchWalletsSuccess(wallets));
dispatch(fetchWalletsFailure(error));

// Recipient actions
dispatch(fetchRecipientsStart());
dispatch(fetchRecipientsSuccess(recipients));
dispatch(fetchRecipientsFailure(error));

dispatch(addRecipientStart());
dispatch(addRecipientSuccess(recipient));
dispatch(addRecipientFailure(error));
```

## Custom Hooks

### useAuth Hook

```javascript
import { useAuth } from '../hooks/useAuth';

function LoginComponent() {
  const { login, isLoading, error } = useAuth();

  const handleLogin = async (credentials) => {
    try {
      await login(credentials.email, credentials.password);
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {/* form fields */}
      {error && <p>{error}</p>}
      <button disabled={isLoading}>Login</button>
    </form>
  );
}
```

**Available Methods:**
- `login(email, password)` - Login user
- `register(userData)` - Register new user
- `logout()` - Logout user
- `restoreAuthToken()` - Restore token from localStorage

**Available State:**
- `isAuthenticated` - Is user logged in
- `user` - Current user data
- `isLoading` - Is request in progress

### useTransaction Hook

```javascript
import { useTransaction } from '../hooks/useTransaction';

function SendMoneyComponent() {
  const {
    quote,
    isLoading,
    initiateTransfer,
    getQuote
  } = useTransaction();

  const handleGetQuote = async () => {
    try {
      await getQuote(
        recipientId,
        amount,
        'USD',
        'JMD'
      );
    } catch (err) {
      console.error('Quote failed:', err);
    }
  };

  const handleSendMoney = async () => {
    try {
      await initiateTransfer(recipientId, amount, 'card');
    } catch (err) {
      console.error('Transfer failed:', err);
    }
  };

  return (
    <>
      {quote && <QuoteDisplay quote={quote} />}
      <button onClick={handleGetQuote} disabled={isLoading}>
        Get Quote
      </button>
      <button onClick={handleSendMoney} disabled={isLoading}>
        Send Money
      </button>
    </>
  );
}
```

## Error Handling

### Error Response Format

**Backend Error:**
```javascript
{
  success: false,
  message: 'Error description',
  errors: [
    { field: 'email', message: 'Email already exists' },
    { field: 'password', message: 'Password too weak' }
  ]
}
```

### Error Handling in Components

```javascript
function SendMoney() {
  const { initiateTransfer } = useTransaction();
  const [error, setError] = useState(null);

  const handleSendMoney = async (data) => {
    try {
      setError(null);
      await initiateTransfer(data.recipientId, data.amount, data.method);
    } catch (err) {
      // Handle API error
      const message = err.response?.data?.message || 'An error occurred';
      setError(message);
    }
  };

  return (
    <>
      {error && <ErrorAlert message={error} />}
      {/* form */}
    </>
  );
}
```

### Error Interceptor

The axios client automatically handles 401 Unauthorized:

```javascript
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Auto-logout on unauthorized
      store.dispatch(logout());
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## Authentication Flow

### Login Flow

```
User Input
    ↓
LoginForm Component
    ↓
useAuth Hook (login method)
    ↓
Redux (loginStart action)
    ↓
authService.login()
    ↓
api.post('/auth/login')
    ↓
Backend Validation
    ↓
Return token + user data
    ↓
Redux (loginSuccess action)
    ↓
Store token in localStorage
    ↓
Navigate to /dashboard
```

### Token Attachment

Every request automatically includes JWT token:

```javascript
// Request interceptor adds token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## Environment Configuration

### Frontend Environment Variables

```env
# API Configuration
VITE_API_URL=http://localhost:3000/api/v1
VITE_API_TIMEOUT=30000

# Feature Flags
VITE_ENABLE_2FA=true
VITE_ENABLE_DARK_MODE=true
```

### Example .env for Development

```env
VITE_APP_NAME=CaribRemit
VITE_API_URL=http://localhost:3000/api/v1
VITE_API_TIMEOUT=30000
VITE_ENABLE_2FA=true
VITE_ENABLE_BIOMETRIC=true
VITE_ENABLE_DARK_MODE=true
VITE_ENABLE_CRYPTO=false
VITE_NODE_ENV=development
```

### Example .env for Production

```env
VITE_APP_NAME=CaribRemit
VITE_API_URL=https://api.caribremit.com/v1
VITE_API_TIMEOUT=30000
VITE_ENABLE_2FA=true
VITE_ENABLE_BIOMETRIC=true
VITE_ENABLE_DARK_MODE=true
VITE_ENABLE_CRYPTO=false
VITE_NODE_ENV=production
```

## API Endpoints Reference

### Authentication
```
POST   /auth/register          Register user
POST   /auth/login             Login user
POST   /auth/refresh           Refresh token
POST   /auth/logout            Logout user
POST   /auth/verify-email      Verify email
POST   /auth/forgot-password   Request password reset
POST   /auth/reset-password    Reset password
```

### Users
```
GET    /users/profile          Get user profile
PUT    /users/profile          Update profile
POST   /users/addresses        Add address
GET    /users/addresses        List addresses
PUT    /users/addresses/:id    Update address
DELETE /users/addresses/:id    Delete address
POST   /users/bank-accounts    Add bank account
GET    /users/bank-accounts    List bank accounts
DELETE /users/bank-accounts/:id Delete account
```

### Transactions
```
POST   /transactions/quote     Get quote
POST   /transactions/initiate  Initiate transfer
GET    /transactions           List transactions
GET    /transactions/:id       Get details
POST   /transactions/:id/cancel Cancel
GET    /transactions/:id/track Track
```

### Recipients
```
POST   /recipients             Add recipient
GET    /recipients             List recipients
GET    /recipients/:id         Get details
PUT    /recipients/:id         Update
DELETE /recipients/:id         Delete
```

### Wallets
```
GET    /wallets                List wallets
GET    /wallets/:currency      Get balance
POST   /wallets/top-up         Top up
POST   /wallets/convert        Convert
POST   /wallets/transfer       Transfer
```

### Rates
```
GET    /rates                  Current rates
GET    /rates/:from/:to        Specific rate
GET    /rates/historical/:from/:to Historical
```

## Testing API Integration

### Test with cURL

```bash
# Health check
curl http://localhost:3000/health

# Get rates (public endpoint)
curl http://localhost:3000/api/v1/rates

# Login and get token
TOKEN=$(curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  | jq -r '.token')

# Use token for protected request
curl http://localhost:3000/api/v1/users/profile \
  -H "Authorization: Bearer $TOKEN"
```

### Test with Postman

1. Import API endpoints from swagger/postman export
2. Set base URL: `http://localhost:3000/api/v1`
3. Create Auth token as environment variable
4. Use token in request headers

### Test in React Component

```javascript
import { useAuth } from '../hooks/useAuth';

function TestApiComponent() {
  const { login, user, isAuthenticated } = useAuth();

  const handleTest = async () => {
    try {
      await login('test@example.com', 'password123');
      console.log('Login successful');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div>
      <button onClick={handleTest}>Test Login</button>
      {isAuthenticated && <p>Logged in as: {user?.email}</p>}
    </div>
  );
}
```

## Troubleshooting

### "Cannot connect to API"

**Check:**
1. Backend is running: `docker-compose ps backend`
2. Backend is healthy: `curl http://localhost:3000/health`
3. VITE_API_URL is correct in `.env`
4. Frontend `VITE_API_URL` matches backend URL

### "401 Unauthorized"

**Check:**
1. Token is in localStorage
2. Token hasn't expired
3. Authorization header is sent: `Authorization: Bearer {token}`
4. Token format is correct

### "CORS Error"

**Check:**
1. Backend CORS is configured correctly
2. Frontend URL is in CORS whitelist
3. Requests are going to correct domain

### "Request timeout"

**Solution:**
1. Increase `VITE_API_TIMEOUT` in .env
2. Check backend performance
3. Check network connectivity

## Performance Tips

1. **Cache API responses**
   ```javascript
   const [cache, setCache] = useState({});

   const getProfileCached = async () => {
     if (cache.profile) return cache.profile;
     const profile = await userService.getProfile();
     setCache(prev => ({ ...prev, profile }));
     return profile;
   };
   ```

2. **Debounce search requests**
   ```javascript
   const debounce = (fn, delay) => {
     let timeout;
     return (...args) => {
       clearTimeout(timeout);
       timeout = setTimeout(() => fn(...args), delay);
     };
   };
   ```

3. **Implement pagination**
   ```javascript
   const getNextPage = async (page) => {
     const offset = (page - 1) * 20;
     return await transactionService.getTransactions({ offset, limit: 20 });
   };
   ```

---

## Next Steps

1. ✅ Understand API architecture
2. ✅ Review service files
3. ✅ Check Redux slices
4. ✅ Test endpoints with cURL/Postman
5. 🔄 Implement frontend components
6. 🧪 Test integration end-to-end

---

**Happy integrating! 🚀**
