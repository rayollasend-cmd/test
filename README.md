# CaribRemit - Caribbean Cross-Border Remittance Platform

A modern, mobile-first web application designed to enable fast, affordable, and secure money transfers across the Caribbean region and the diaspora.

## 🌍 Overview

CaribRemit is a fintech solution specifically designed for the Caribbean market, addressing the unique needs of Caribbean nationals and the diaspora. The platform enables seamless cross-border money transfers with competitive fees, transparent exchange rates, and multiple delivery methods.

### Key Features

- **Fast Transfers** - Same-day or next-day delivery to most Caribbean countries
- **Competitive Fees** - Lower fees compared to traditional money transfer services
- **Multiple Delivery Methods**:
  - Bank account deposits
  - Mobile wallet transfers
  - Cash pickup at partner locations
- **Multi-Currency Support** - Support for major Caribbean currencies
- **Real-time Tracking** - Track your transfers in real-time
- **Secure & Compliant** - Full KYC/AML compliance and security
- **User-friendly Interface** - Simple, intuitive design for all users

## 📋 Project Structure

The project is organized into frontend and backend components:

```
carib-remit/
├── backend/          # Node.js/Express API server
├── frontend/         # React web application
├── mobile/           # React Native mobile app (future)
├── docs/             # Documentation
├── DESIGN.md         # Comprehensive system design
└── PROJECT_STRUCTURE.md  # Detailed project structure
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- Docker & Docker Compose (recommended)
- Git

### Development Setup (with Docker)

```bash
# Clone repository
git clone <repository-url>
cd carib-remit

# Copy environment files
cp .env.backend.example backend/.env
cp .env.frontend.example frontend/.env

# Start all services
docker-compose up

# Access the application
# Frontend: http://localhost:5173
# Backend: http://localhost:3000
# Mailhog (email testing): http://localhost:8025
```

### Manual Setup (without Docker)

#### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Create database
createdb carib_remit

# Run migrations
npm run migrate

# Start development server
npm run dev
```

The backend will be available at `http://localhost:3000`

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 📚 Documentation

- **[DESIGN.md](./DESIGN.md)** - Comprehensive system architecture and design
- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - Detailed project structure and organization
- **[docs/API.md](./docs/API.md)** - API documentation (coming soon)
- **[docs/DEVELOPMENT.md](./docs/DEVELOPMENT.md)** - Development guidelines (coming soon)
- **[docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)** - Deployment guide (coming soon)
- **[docs/SECURITY.md](./docs/SECURITY.md)** - Security guidelines (coming soon)

## 🏗️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Cache**: Redis
- **Authentication**: JWT + OAuth 2.0
- **Payment Processing**: Stripe, PayPal

### Frontend
- **Framework**: React 18
- **State Management**: Redux Toolkit
- **Form Handling**: React Hook Form + Zod
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **HTTP Client**: Axios

### Infrastructure
- **Containerization**: Docker
- **Orchestration**: Kubernetes (production)
- **Cloud**: AWS/Google Cloud/Azure
- **CI/CD**: GitHub Actions

## 🔐 Security & Compliance

The platform implements comprehensive security measures:

- **Data Encryption**: TLS 1.3 + AES-256
- **Authentication**: JWT with 2FA support
- **PCI-DSS**: Level 1 certification target
- **AML/CFT**: OFAC sanctions screening, transaction monitoring
- **GDPR**: Full GDPR compliance
- **Regional**: Compliant with Caribbean banking regulations

See [docs/SECURITY.md](./docs/SECURITY.md) for detailed security guidelines.

## 📊 API Endpoints

### Authentication
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout
```

### Transactions
```
POST   /api/v1/transactions/quote
POST   /api/v1/transactions/initiate
GET    /api/v1/transactions
GET    /api/v1/transactions/:id
PUT    /api/v1/transactions/:id/cancel
GET    /api/v1/transactions/:id/track
```

### Users
```
GET    /api/v1/users/profile
PUT    /api/v1/users/profile
POST   /api/v1/users/addresses
GET    /api/v1/users/bank-accounts
```

### Recipients
```
POST   /api/v1/recipients
GET    /api/v1/recipients
PUT    /api/v1/recipients/:id
DELETE /api/v1/recipients/:id
```

See [docs/API.md](./docs/API.md) for complete API documentation.

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test
npm run test:watch

# Frontend tests
cd frontend
npm test
npm run test:ui
```

## 📦 Deployment

### Development
```bash
docker-compose up
```

### Staging/Production
See [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed deployment instructions.

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit your changes: `git commit -am 'feat: add new feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit a pull request

See [CONTRIBUTING.md](./.github/CONTRIBUTING.md) for detailed guidelines.

## 📝 Commit Convention

We use conventional commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test additions/changes
- `chore:` - Build, dependency updates

Example: `feat: add transaction tracking feature`

## 🐛 Known Issues & Limitations

- Mobile app (React Native) - in development
- Cryptocurrency payment support - planned for Q2 2024
- Business account features - planned for Q3 2024

## 📈 Roadmap

### Q1-Q2 2024: MVP Launch
- Core send money functionality
- User authentication & KYC
- Bank account deposits
- Mobile apps (iOS/Android)

### Q3-Q4 2024: Expansion
- Mobile money integrations
- Cash pickup locations
- Business accounts
- API for partners

### 2025: Scale
- White-label solutions
- Cryptocurrency support
- Bills payment integration
- International expansion

See [DESIGN.md#roadmap](./DESIGN.md#roadmap) for detailed roadmap.

## 💼 Support

For support, please:
- Open an issue on GitHub
- Contact: support@caribremit.com
- Documentation: https://docs.caribremit.com (coming soon)

## 📄 License

This project is licensed under the MIT License - see [LICENSE](./LICENSE) file for details.

## 🙋 FAQ

**Q: Which Caribbean countries are supported?**
A: We support transfers to most Caribbean nations. Check the complete list in our documentation.

**Q: What are the transfer fees?**
A: Fees vary by corridor and delivery method. Get a quote in the app for exact fees.

**Q: How long do transfers take?**
A: Most transfers are completed within 1-3 business days. Some routes offer same-day delivery.

**Q: Is my money safe?**
A: Yes. We use industry-standard encryption, PCI-DSS compliance, and partner with regulated financial institutions.

**Q: Can I track my transfer?**
A: Yes. You can track your transfer in real-time through the app.

## 🌟 Acknowledgments

- Caribbean Development Bank
- Partner financial institutions
- Caribbean diaspora community
- Open source community

---

**Made with ❤️ for the Caribbean**

For more information, visit [caribremit.com](https://caribremit.com)