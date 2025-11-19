# CaribRemit Frontend

A modern, responsive React application for the Caribbean Remittance Platform. Built with React 18, Redux Toolkit, Tailwind CSS, and Vite.

## Features

- ✅ Modern React 18 with hooks
- ✅ Redux Toolkit for state management
- ✅ React Router for navigation
- ✅ Tailwind CSS for styling
- ✅ React Hook Form with Zod validation
- ✅ Axios HTTP client with interceptors
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dark mode support
- ✅ Form validation
- ✅ Error handling & notifications
- ✅ Test coverage with Vitest

## Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- Backend API running on http://localhost:3000

## Installation

### 1. Clone and install dependencies

```bash
cd frontend
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and set your configuration:

```env
VITE_APP_NAME=CaribRemit
VITE_API_URL=http://localhost:3000/api/v1
VITE_API_TIMEOUT=30000
VITE_ENABLE_2FA=true
VITE_ENABLE_DARK_MODE=true
```

## Running the Application

### Development

```bash
npm run dev
```

Starts on `http://localhost:5173` with hot module reloading.

### Production Build

```bash
npm run build
```

Creates optimized production build in `dist/` folder.

### Preview Build

```bash
npm run preview
```

Preview production build locally.

### With Docker

```bash
docker build -t carib-remit-frontend .
docker run -p 5173:5173 carib-remit-frontend
```

## Project Structure

```
frontend/
├── src/
│   ├── main.jsx              # Entry point
│   ├── App.jsx               # Main App component
│   ├── components/           # Reusable components
│   │   ├── LoginForm.jsx     # Login form with validation
│   │   ├── SendMoneyForm.jsx # Multi-step send money wizard
│   │   ├── TransactionHistory.jsx
│   │   ├── WalletCard.jsx
│   │   └── __tests__/        # Component tests
│   │       ├── LoginForm.test.jsx
│   │       └── WalletCard.test.jsx
│   ├── pages/                # Page components
│   │   ├── HomePage.jsx      # Landing page
│   │   ├── LoginPage.jsx     # Login page
│   │   ├── DashboardPage.jsx # Dashboard
│   │   ├── SendMoneyPage.jsx # Send money page
│   │   ├── RecipientsPage.jsx
│   │   ├── TransactionsPage.jsx
│   │   ├── WalletPage.jsx
│   │   ├── ProfilePage.jsx
│   │   └── SettingsPage.jsx
│   ├── store/                # Redux store
│   │   ├── store.js          # Store configuration
│   │   ├── slices/           # Redux slices
│   │   │   ├── authSlice.js  # Auth state
│   │   │   ├── transactionSlice.js
│   │   │   ├── userSlice.js
│   │   │   └── uiSlice.js
│   │   └── selectors/        # Redux selectors
│   │       └── authSelectors.js
│   ├── services/             # API services
│   │   ├── api.js            # Axios instance
│   │   ├── authService.js    # Auth API calls
│   │   ├── transactionService.js
│   │   └── userService.js
│   ├── hooks/                # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useTransaction.js
│   │   └── useFetch.js
│   ├── styles/               # Global styles
│   │   └── index.css
│   └── utils/                # Utility functions
│       ├── validation.js
│       ├── formatting.js
│       └── errorHandler.js
├── public/                   # Static assets
│   ├── index.html
│   └── favicon.ico
├── Dockerfile
├── .dockerignore
├── package.json
├── .env.example
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Tailwind configuration
└── README.md
```

## Key Technologies

### Frontend Framework
- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Redux Toolkit** - State management

### UI & Styling
- **Tailwind CSS** - Utility-first CSS
- **React Icons** - Icon library
- **Framer Motion** - Animations

### Forms & Validation
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **@hookform/resolvers** - Hook Form resolvers

### HTTP & Data
- **Axios** - HTTP client
- **JavaScript Fetch API** - Alternative to Axios

### Development Tools
- **Vite** - Build tool
- **Vitest** - Unit testing
- **@testing-library/react** - React testing utilities
- **ESLint** - Code linting
- **Prettier** - Code formatting

## State Management (Redux)

### Auth Slice
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

### Transaction Slice
```javascript
{
  transactions: [],
  currentTransaction: null,
  quote: null,
  isLoading: false,
  error: null,
  filters: {}
}
```

### User Slice
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

### UI Slice
```javascript
{
  isDarkMode: false,
  notifications: [],
  modals: {},
  sidebarOpen: true,
  theme: 'light'
}
```

## API Integration

### Axios Configuration

- Base URL: `VITE_API_URL`
- Timeout: `VITE_API_TIMEOUT`
- Auto-attach JWT token in Authorization header
- Auto-logout on 401 Unauthorized

### Available Services

```javascript
// Authentication
authService.register(userData)
authService.login(credentials)
authService.logout()

// Transactions
transactionService.getQuote(recipientId, amount, currencies)
transactionService.initiateTransfer(recipientId, amount, method)
transactionService.getTransactions(filters)
transactionService.trackTransfer(transactionId)

// Users
userService.getProfile()
userService.updateProfile(data)
userService.addRecipient(recipientData)
userService.getRecipients()
```

## Component Examples

### Using Redux State

```javascript
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../store/selectors/authSelectors';

function MyComponent() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  // Use user and dispatch
}
```

### Using Forms

```javascript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  amount: z.number().positive()
});

function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data) => {
    // Submit data
  };

  return <form onSubmit={handleSubmit(onSubmit)}>{/* */}</form>;
}
```

### Using API Services

```javascript
import transactionService from '../services/transactionService';
import { useDispatch } from 'react-redux';
import { getQuoteSuccess } from '../store/slices/transactionSlice';

function SendMoney() {
  const dispatch = useDispatch();

  const handleGetQuote = async (recipientId, amount, currencies) => {
    try {
      const quote = await transactionService.getQuote(
        recipientId,
        amount,
        currencies.send,
        currencies.receive
      );
      dispatch(getQuoteSuccess(quote));
    } catch (error) {
      console.error('Quote failed:', error);
    }
  };

  return <button onClick={handleGetQuote}>Get Quote</button>;
}
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

### Run tests with UI

```bash
npm run test:ui
```

### Generate coverage report

```bash
npm run coverage
```

### Writing Tests

```javascript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

## Environment Variables

```
# Application
VITE_APP_NAME              # App name
VITE_APP_VERSION           # App version
VITE_NODE_ENV              # Environment (development, production)

# API
VITE_API_URL              # Backend API URL
VITE_API_TIMEOUT          # Request timeout in ms

# Features
VITE_ENABLE_2FA           # Two-factor authentication
VITE_ENABLE_BIOMETRIC     # Biometric authentication
VITE_ENABLE_DARK_MODE     # Dark mode support
VITE_ENABLE_CRYPTO        # Cryptocurrency support

# Analytics
VITE_GOOGLE_ANALYTICS_ID  # Google Analytics ID
VITE_SENTRY_DSN          # Sentry error tracking

# Third-party
VITE_STRIPE_PUBLIC_KEY    # Stripe public key
VITE_PAYPAL_CLIENT_ID     # PayPal client ID
```

## Styling with Tailwind CSS

### Customization

Edit `tailwind.config.js` to customize:
- Color scheme
- Typography
- Spacing
- Breakpoints
- Plugins

### Dark Mode

Enable in `tailwind.config.js`:

```javascript
module.exports = {
  darkMode: 'class',
  // ...
}
```

Toggle with:

```javascript
import { useDispatch } from 'react-redux';
import { toggleDarkMode } from '../store/slices/uiSlice';

function ThemeToggle() {
  const dispatch = useDispatch();

  return (
    <button onClick={() => dispatch(toggleDarkMode())}>
      Toggle Dark Mode
    </button>
  );
}
```

## Performance Optimizations

- Code splitting with React Router
- Lazy loading components with React.lazy
- Image optimization
- Bundle size analysis: `npm run build -- --analyze`
- CSS purging with Tailwind
- Minification and compression

## Accessibility

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Color contrast compliance
- Form labels

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Useful Commands

```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build
npm test                 # Run tests
npm run test:watch       # Watch mode tests
npm run test:ui          # Test UI dashboard
npm run coverage         # Coverage report
npm run lint             # Lint code
npm run format           # Format code with Prettier
npm run docker:build     # Build Docker image
npm run docker:run       # Run Docker container
```

## Deployment

### Static Hosting (Vercel, Netlify, etc.)

```bash
npm run build
# Upload dist/ folder to hosting
```

### Docker Deployment

```bash
docker build -t carib-remit-frontend .
docker run -p 5173:5173 carib-remit-frontend
```

### Environment Configuration

Set environment variables in your hosting platform:
- `VITE_API_URL` - Backend API URL
- `VITE_STRIPE_PUBLIC_KEY` - Stripe key
- Other feature flags

## Troubleshooting

### API calls returning 401
- Check JWT token in localStorage
- Verify backend is running
- Check `VITE_API_URL` configuration

### Tailwind styles not applying
- Ensure `postcss` and `autoprefixer` are installed
- Rebuild: `npm run build`
- Clear browser cache

### Redux state not updating
- Check Redux DevTools
- Verify actions are dispatched
- Check selectors

## Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Make changes and test: `npm test`
3. Format code: `npm run format`
4. Commit: `git commit -am 'feat: add feature'`
5. Push: `git push origin feature/name`
6. Submit pull request

## License

MIT License - See LICENSE file for details

## Support

For issues and questions:
- GitHub Issues: [project repository]
- Email: support@caribremit.com

---

**Built with ❤️ for the Caribbean**
