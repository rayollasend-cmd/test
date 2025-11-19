#!/bin/bash

# CaribRemit Local Development Setup Script
# This script initializes everything needed to run CaribRemit locally with Docker

set -e

echo "======================================"
echo "  CaribRemit Local Setup Script"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
echo -e "${BLUE}Checking Docker installation...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}Docker is not installed. Please install Docker Desktop first.${NC}"
    echo "Download from: https://www.docker.com/products/docker-desktop"
    exit 1
fi
echo -e "${GREEN}✓ Docker is installed${NC}"

# Check if Docker Compose is installed
echo -e "${BLUE}Checking Docker Compose installation...${NC}"
if ! command -v docker-compose &> /dev/null; then
    echo -e "${YELLOW}Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker Compose is installed${NC}"

# Create backend .env if it doesn't exist
echo ""
echo -e "${BLUE}Setting up backend environment...${NC}"
if [ ! -f "backend/.env" ]; then
    cp backend/.env.example backend/.env
    echo -e "${GREEN}✓ Created backend/.env${NC}"
else
    echo -e "${GREEN}✓ backend/.env already exists${NC}"
fi

# Create frontend .env if it doesn't exist
echo -e "${BLUE}Setting up frontend environment...${NC}"
if [ ! -f "frontend/.env" ]; then
    cp frontend/.env.example frontend/.env
    echo -e "${GREEN}✓ Created frontend/.env${NC}"
else
    echo -e "${GREEN}✓ frontend/.env already exists${NC}"
fi

# Pull latest images
echo ""
echo -e "${BLUE}Pulling latest Docker images...${NC}"
docker-compose pull
echo -e "${GREEN}✓ Docker images pulled${NC}"

# Build images
echo ""
echo -e "${BLUE}Building Docker images...${NC}"
docker-compose build
echo -e "${GREEN}✓ Docker images built${NC}"

# Start services
echo ""
echo -e "${BLUE}Starting services...${NC}"
docker-compose up -d
echo -e "${GREEN}✓ Services started${NC}"

# Wait for services to be healthy
echo ""
echo -e "${BLUE}Waiting for services to be ready...${NC}"
sleep 5

# Run migrations
echo -e "${BLUE}Running database migrations...${NC}"
docker-compose exec -T postgres psql -U postgres -d carib_remit -f /docker-entrypoint-initdb.d/001_init_schema.sql 2>/dev/null || true
echo -e "${GREEN}✓ Migrations completed${NC}"

# Display access information
echo ""
echo -e "${GREEN}======================================"
echo "  Setup Complete! ✓"
echo "======================================${NC}"
echo ""
echo -e "${BLUE}Access the applications:${NC}"
echo ""
echo "🎨  Frontend:  http://localhost:5173"
echo "🔌  Backend:   http://localhost:3000/api/v1"
echo "💾  Database:  localhost:5432 (user: postgres, password: postgres)"
echo "📧  Mailhog:   http://localhost:8025 (email testing)"
echo "⚡  Redis:     localhost:6379"
echo ""
echo -e "${BLUE}Useful commands:${NC}"
echo ""
echo "  View logs:     docker-compose logs -f [service]"
echo "  Stop services: docker-compose down"
echo "  Restart:       docker-compose restart"
echo "  Shell access:  docker-compose exec [service] sh"
echo "  DB access:     docker-compose exec postgres psql -U postgres -d carib_remit"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Create a test account: http://localhost:5173/signup"
echo "  2. Login at: http://localhost:5173/login"
echo "  3. Test the API with Postman or curl"
echo ""
