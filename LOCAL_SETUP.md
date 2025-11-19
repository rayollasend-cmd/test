# CaribRemit - Local Development Setup Guide

Complete guide to running CaribRemit locally with Docker Compose.

## Prerequisites

- **Docker Desktop** (includes Docker & Docker Compose)
  - Download: https://www.docker.com/products/docker-desktop
  - Version: 20.10+ recommended
  - At least 4GB RAM allocated to Docker

- **Git** for version control
- **Terminal/Command Prompt** access

## Quick Start (5 minutes)

### Option 1: Automated Setup (Recommended)

```bash
# Make script executable
chmod +x setup.sh

# Run setup script
./setup.sh
```

This will:
1. ✅ Check Docker installation
2. ✅ Create environment files
3. ✅ Build Docker images
4. ✅ Start all services
5. ✅ Run migrations
6. ✅ Display access information

### Option 2: Manual Setup

```bash
# 1. Create environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 2. Start services
docker-compose up -d

# 3. Wait ~15 seconds for services to initialize
sleep 15

# 4. Run migrations (if first time)
docker-compose exec postgres psql -U postgres -d carib_remit \
  -f /docker-entrypoint-initdb.d/001_init_schema.sql
```

## Services Overview

| Service | Port | URL | Purpose |
|---------|------|-----|---------|
| **Frontend** | 5173 | http://localhost:5173 | React web app |
| **Backend API** | 3000 | http://localhost:3000 | Express.js API |
| **PostgreSQL** | 5432 | localhost:5432 | Database |
| **Redis** | 6379 | localhost:6379 | Cache |
| **Mailhog** | 8025 | http://localhost:8025 | Email testing |

## What Gets Created

### Docker Containers

```
carib-remit-postgres   - PostgreSQL 15 database
carib-remit-redis      - Redis 7 cache
carib-remit-mailhog    - Email testing UI
carib-remit-backend    - Node.js/Express API
carib-remit-frontend   - React Vite dev server
```

### Docker Volumes

```
postgres_data  - PostgreSQL persistent storage
redis_data     - Redis persistent storage
```

### Docker Network

```
carib-remit  - Custom bridge network connecting all services
```

## Accessing the Applications

### Frontend (React App)

```
URL: http://localhost:5173
```

**Available Pages:**
- Home: http://localhost:5173/
- Login: http://localhost:5173/login
- Signup: http://localhost:5173/signup
- Dashboard: http://localhost:5173/dashboard (requires login)

### Backend API

```
Base URL: http://localhost:3000/api/v1
Health Check: http://localhost:3000/health
```

**Test API with curl:**
```bash
# Health check
curl http://localhost:3000/health

# Get exchange rates
curl http://localhost:3000/api/v1/rates

# Get current rates for USD to JMD
curl http://localhost:3000/api/v1/rates/USD/JMD
```

### Database (PostgreSQL)

```bash
# Connect to database
docker-compose exec postgres psql -U postgres -d carib_remit

# List tables
\dt

# View users table
SELECT * FROM users;

# Exit
\q
```

**Credentials:**
- Host: localhost
- Port: 5432
- Username: postgres
- Password: postgres
- Database: carib_remit

### Email Testing (Mailhog)

```
URL: http://localhost:8025
```

All emails sent by the application are captured here.

### Redis Cache

```bash
# Connect to Redis
docker-compose exec redis redis-cli

# View all keys
KEYS *

# Get a key
GET key_name

# Exit
EXIT
```

## Common Commands

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Last 100 lines
docker-compose logs --tail=100

# Follow backend logs with timestamps
docker-compose logs -f --timestamps backend
```

### Stop/Start Services

```bash
# Stop all services
docker-compose down

# Start services (after down)
docker-compose up -d

# Restart specific service
docker-compose restart backend

# Restart all services
docker-compose restart

# Stop without removing containers
docker-compose stop

# Start stopped containers
docker-compose start
```

### Execute Commands in Containers

```bash
# Backend shell
docker-compose exec backend sh

# Frontend shell
docker-compose exec frontend sh

# Database shell
docker-compose exec postgres bash

# Run npm commands in backend
docker-compose exec backend npm test
docker-compose exec backend npm run lint

# Run npm commands in frontend
docker-compose exec frontend npm run build
```

### View Resource Usage

```bash
# View running containers and their stats
docker stats

# View container details
docker-compose ps
```

### Clean Up

```bash
# Stop and remove containers
docker-compose down

# Remove everything including volumes (⚠️ clears database)
docker-compose down -v

# Remove images
docker-compose down --rmi all

# Remove unused images
docker image prune
```

## Database Management

### Initialize Database

First time only:
```bash
docker-compose exec postgres psql -U postgres -d carib_remit \
  -f /docker-entrypoint-initdb.d/001_init_schema.sql
```

### Reset Database

```bash
# Remove volume (deletes all data)
docker-compose down -v

# Restart
docker-compose up -d

# Re-run migrations
docker-compose exec postgres psql -U postgres -d carib_remit \
  -f /docker-entrypoint-initdb.d/001_init_schema.sql
```

### Backup Database

```bash
# Dump database to SQL file
docker-compose exec -T postgres pg_dump -U postgres carib_remit > backup.sql

# Restore from backup
docker-compose exec -T postgres psql -U postgres carib_remit < backup.sql
```

### Run Database Queries

```bash
# Connect to database
docker-compose exec postgres psql -U postgres -d carib_remit

# Create test user
INSERT INTO users (email, phone, password_hash, first_name, last_name, kyc_status)
VALUES ('test@example.com', '+1234567890', 'hash', 'John', 'Doe', 'verified');

# View all users
SELECT id, email, kyc_status, created_at FROM users;

# Delete all data (use with caution!)
DELETE FROM users;
```

## Testing the Application

### Create Test Account

1. Go to http://localhost:5173/signup
2. Fill in:
   - Email: test@example.com
   - Password: Password123!
   - First Name: John
   - Last Name: Doe
   - Phone: +1234567890
3. Click Sign Up

### Test Login

1. Go to http://localhost:5173/login
2. Use credentials from account creation
3. Click Sign In

### Test API Endpoints

Using curl or Postman:

```bash
# Get current rates
curl http://localhost:3000/api/v1/rates

# Get quote (requires authentication)
curl -X POST http://localhost:3000/api/v1/transactions/quote \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "recipientId": "123e4567-e89b-12d3-a456-426614174000",
    "amount": 500,
    "sendCurrency": "USD",
    "receiveCurrency": "JMD"
  }'
```

### View Test Emails

Any emails sent by the application are captured in Mailhog:
- Go to http://localhost:8025
- View all sent emails
- Check email content and headers

## Troubleshooting

### "Cannot connect to Docker daemon"

**Issue:** Docker is not running

**Solution:**
```bash
# macOS/Windows: Start Docker Desktop from Applications
# Linux: Start Docker daemon
sudo systemctl start docker

# Verify Docker is running
docker ps
```

### "Port 5173 already in use"

**Issue:** Another process is using the frontend port

**Solution:**
```bash
# Find process using port 5173
lsof -i :5173  # macOS/Linux
netstat -ano | findstr :5173  # Windows

# Kill the process (replace PID)
kill -9 PID  # macOS/Linux
taskkill /PID PID /F  # Windows

# Or change port in docker-compose.yml
# Change "5173:5173" to "5174:5173"
```

### "Port 3000 already in use"

**Issue:** Another process is using the API port

**Solution:**
```bash
# Find and kill process
lsof -i :3000
kill -9 PID

# Or change port in docker-compose.yml
# Change "3000:3000" to "3001:3000"
```

### Database connection failed

**Issue:** Backend cannot connect to PostgreSQL

**Check:**
1. PostgreSQL container is running:
   ```bash
   docker-compose ps postgres
   ```

2. Database exists:
   ```bash
   docker-compose exec postgres psql -U postgres -l | grep carib_remit
   ```

3. Check logs:
   ```bash
   docker-compose logs postgres
   ```

### Frontend blank page

**Issue:** Frontend not loading properly

**Solution:**
```bash
# Rebuild frontend
docker-compose down frontend
docker-compose up -d frontend

# Clear browser cache
# Hard refresh: Cmd+Shift+R (macOS) or Ctrl+Shift+R (Windows)

# Check logs
docker-compose logs -f frontend
```

### Slow performance

**Issue:** Services running slowly

**Solution:**
1. Check Docker resource allocation:
   - Docker Desktop → Preferences → Resources
   - Increase CPU cores and RAM

2. Clean up unused data:
   ```bash
   docker system prune -a
   docker volume prune
   ```

3. Restart Docker:
   ```bash
   docker-compose restart
   ```

### "ECONNREFUSED" or "Connection refused"

**Issue:** Frontend cannot connect to backend

**Solution:**
1. Verify backend is running:
   ```bash
   docker-compose logs backend
   ```

2. Check VITE_API_URL in frontend/.env:
   ```
   VITE_API_URL=http://localhost:3000/api/v1
   ```

3. Restart both services:
   ```bash
   docker-compose restart backend frontend
   ```

## Development Workflow

### Making Changes

1. **Backend Changes**
   ```bash
   # Edit src/routes/auth.js or other files
   # Changes auto-reload with nodemon
   docker-compose logs -f backend
   ```

2. **Frontend Changes**
   ```bash
   # Edit src/pages/HomePage.jsx or other files
   # Changes auto-reload with Vite HMR
   docker-compose logs -f frontend
   ```

3. **Database Changes**
   ```bash
   # Create SQL migration in backend/src/migrations/
   # Run migration:
   docker-compose exec postgres psql -U postgres -d carib_remit -f path/to/migration.sql
   ```

### Running Tests

```bash
# Backend tests
docker-compose exec backend npm test

# Frontend tests
docker-compose exec frontend npm test

# Watch mode
docker-compose exec backend npm run test:watch
docker-compose exec frontend npm run test:watch
```

### Linting & Formatting

```bash
# Backend
docker-compose exec backend npm run lint

# Frontend
docker-compose exec frontend npm run lint
docker-compose exec frontend npm run format
```

## Performance Tips

1. **Allocate more resources to Docker**
   - At least 4GB RAM
   - At least 2 CPU cores

2. **Use host volumes efficiently**
   - Keep node_modules in named volumes
   - Avoid mounting large directories

3. **Cache dependencies**
   - Docker caches npm install steps
   - Rebuild only when package.json changes

4. **Monitor resource usage**
   ```bash
   docker stats
   ```

## Security Notes

⚠️ **For Development Only**

The following are NOT for production:
- Database password is hardcoded
- JWT secret is exposed
- No HTTPS
- Debug mode enabled
- All ports exposed

For production, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## Next Steps

1. ✅ Services running locally
2. 📖 Read [backend/README.md](./backend/README.md) for API documentation
3. 📖 Read [frontend/README.md](./frontend/README.md) for frontend guide
4. 🧪 Run tests: `npm test`
5. 🚀 Customize and extend the application

## Getting Help

### Check Logs
```bash
# View all logs
docker-compose logs

# Follow specific service
docker-compose logs -f [service]
```

### Common Issues
- Port already in use: Change port in docker-compose.yml
- Database connection: Check DB_HOST is "postgres" not "localhost"
- Frontend blank: Check browser console for errors

### Useful Commands Quick Reference

```bash
# Start everything
docker-compose up -d

# See what's running
docker-compose ps

# View logs
docker-compose logs -f

# Stop everything
docker-compose down

# Reset database
docker-compose down -v && docker-compose up -d

# Backend shell
docker-compose exec backend sh

# Database shell
docker-compose exec postgres psql -U postgres -d carib_remit
```

## Additional Resources

- [Docker Documentation](https://docs.docker.com)
- [Docker Compose Documentation](https://docs.docker.com/compose)
- [Backend API Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)
- [System Design Document](./DESIGN.md)

---

**Happy Developing! 🚀**
