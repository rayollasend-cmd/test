# CaribRemit Production Deployment Guide

Complete guide for deploying CaribRemit to production across multiple cloud platforms.

## Overview

CaribRemit can be deployed on:
1. **AWS** (EC2, ECS, RDS, ElastiCache)
2. **Vercel** (Frontend only - recommended)
3. **Google Cloud** (Compute Engine, Cloud SQL, Memorystore)
4. **Azure** (App Service, Database, Cache)
5. **DigitalOcean** (Droplets, App Platform)

## Pre-Deployment Checklist

- [ ] All tests passing locally (`npm test`)
- [ ] Environment variables configured for production
- [ ] Database migrations prepared
- [ ] SSL certificates ready
- [ ] Domain names registered and configured
- [ ] CI/CD pipeline configured
- [ ] Monitoring and alerting set up
- [ ] Backup strategy in place
- [ ] Security audit completed
- [ ] Load testing completed

---

## 1. AWS Deployment (Recommended)

### Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    AWS Region                            │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │         CloudFront (CDN)                          │   │
│  │  - Static assets caching                          │   │
│  │  - SSL/TLS termination                            │   │
│  └──────────────┬───────────────────────────────────┘   │
│                 │                                         │
│  ┌──────────────┴───────────────────────────────────┐   │
│  │     Application Load Balancer (ALB)               │   │
│  │  - Route traffic to services                      │   │
│  │  - Health checks                                  │   │
│  │  - SSL/TLS termination                            │   │
│  └──────┬──────────────────────┬─────────────────────┘   │
│         │                      │                          │
│  ┌──────┴──────┐      ┌────────┴─────┐                  │
│  │   ECS:      │      │   ECS:        │                  │
│  │  Frontend   │      │  Backend      │                  │
│  │  (React)    │      │  (Express.js) │                  │
│  └─────────────┘      └────────┬─────┘                   │
│                                 │                         │
│  ┌──────────────────────────────┴────────────────────┐   │
│  │         RDS (PostgreSQL)                           │   │
│  │  - Primary database                               │   │
│  │  - Automated backups                              │   │
│  │  - Multi-AZ failover                              │   │
│  └─────────────────────────────────────────────────┘   │
│                                                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │    ElastiCache (Redis)                            │   │
│  │  - Session management                             │   │
│  │  - Exchange rate caching                          │   │
│  │  - Rate limiting data                             │   │
│  └─────────────────────────────────────────────────┘   │
│                                                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │    S3 Bucket                                      │   │
│  │  - KYC document storage                           │   │
│  │  - Transaction receipts                           │   │
│  │  - Static assets backup                           │   │
│  └─────────────────────────────────────────────────┘   │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### Step 1: Prepare AWS Account

#### 1.1 Create AWS Account and IAM User

```bash
# AWS Management Console Steps:
# 1. Go to https://aws.amazon.com/
# 2. Create account
# 3. Set up billing alerts
# 4. Create IAM user with programmatic access
# 5. Attach policies:
#    - AmazonEC2FullAccess
#    - AmazonRDSFullAccess
#    - AmazonElastiCacheFullAccess
#    - AmazonS3FullAccess
#    - CloudFrontFullAccess
```

#### 1.2 Configure AWS CLI

```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configure credentials
aws configure
# Enter: AWS Access Key ID
# Enter: AWS Secret Access Key
# Enter: Default region (us-east-1, us-west-2, etc.)
# Enter: Default output format (json)

# Verify configuration
aws sts get-caller-identity
```

### Step 2: Set Up Database (RDS PostgreSQL)

#### 2.1 Create RDS Instance

```bash
# Using AWS CLI
aws rds create-db-instance \
  --db-instance-identifier carib-remit-prod \
  --db-instance-class db.t3.medium \
  --engine postgres \
  --engine-version 14.7 \
  --allocated-storage 100 \
  --storage-type gp3 \
  --master-username postgres \
  --master-user-password 'YourSecurePassword123!' \
  --db-name carib_remit \
  --vpc-security-group-ids sg-xxxxxxxx \
  --multi-az \
  --backup-retention-period 30 \
  --prefer-backup-window "03:00-04:00" \
  --prefer-maintenance-window "sun:04:00-sun:05:00" \
  --enable-cloudwatch-logs-exports '["postgresql"]' \
  --storage-encrypted \
  --region us-east-1
```

#### 2.2 Configure Security Group

```bash
# Create security group
aws ec2 create-security-group \
  --group-name carib-remit-rds-sg \
  --description "Security group for RDS database" \
  --vpc-id vpc-xxxxxxxx \
  --region us-east-1

# Allow inbound from ECS
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxxxxx \
  --protocol tcp \
  --port 5432 \
  --source-security-group-id sg-ecs-sg \
  --region us-east-1
```

#### 2.3 Run Database Migrations

```bash
# Get RDS endpoint
aws rds describe-db-instances \
  --db-instance-identifier carib-remit-prod \
  --region us-east-1 \
  --query 'DBInstances[0].Endpoint.Address'

# Connect and run migrations
psql -h <rds-endpoint> -U postgres -d carib_remit < src/migrations/001_init_schema.sql

# Verify tables
psql -h <rds-endpoint> -U postgres -d carib_remit -c "\dt"
```

### Step 3: Set Up Caching (ElastiCache Redis)

```bash
# Create Redis cluster
aws elasticache create-cache-cluster \
  --cache-cluster-id carib-remit-cache \
  --cache-node-type cache.t3.micro \
  --engine redis \
  --engine-version 7.0 \
  --num-cache-nodes 1 \
  --auto-failover-enabled \
  --region us-east-1

# Create subnet group
aws elasticache create-cache-subnet-group \
  --cache-subnet-group-name carib-remit-subnet \
  --cache-subnet-group-description "Subnet group for Redis" \
  --subnet-ids subnet-xxxxxxxx subnet-yyyyyyyy \
  --region us-east-1

# Authorize security group
aws ec2 authorize-security-group-ingress \
  --group-id sg-elasticache-sg \
  --protocol tcp \
  --port 6379 \
  --source-security-group-id sg-ecs-sg \
  --region us-east-1
```

### Step 4: Set Up Container Registry (ECR)

```bash
# Create ECR repositories
aws ecr create-repository \
  --repository-name carib-remit/backend \
  --region us-east-1

aws ecr create-repository \
  --repository-name carib-remit/frontend \
  --region us-east-1

# Configure lifecycle policy to keep last 10 images
aws ecr put-lifecycle-policy \
  --repository-name carib-remit/backend \
  --lifecycle-policy-text file://lifecycle-policy.json \
  --region us-east-1
```

**lifecycle-policy.json:**
```json
{
  "rules": [
    {
      "rulePriority": 1,
      "description": "Keep last 10 images",
      "selection": {
        "tagStatus": "any",
        "countType": "imageCountMoreThan",
        "countNumber": 10
      },
      "action": {
        "type": "expire"
      }
    }
  ]
}
```

### Step 5: Build and Push Docker Images

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Build backend image
docker build -t carib-remit/backend:latest -f backend/Dockerfile ./backend

# Tag and push backend
docker tag carib-remit/backend:latest \
  <account-id>.dkr.ecr.us-east-1.amazonaws.com/carib-remit/backend:latest

docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/carib-remit/backend:latest

# Build and push frontend
docker build -t carib-remit/frontend:latest -f frontend/Dockerfile ./frontend

docker tag carib-remit/frontend:latest \
  <account-id>.dkr.ecr.us-east-1.amazonaws.com/carib-remit/frontend:latest

docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/carib-remit/frontend:latest
```

### Step 6: Set Up ECS Cluster

#### 6.1 Create ECS Cluster

```bash
# Create cluster
aws ecs create-cluster \
  --cluster-name carib-remit-prod \
  --region us-east-1

# Create CloudWatch log group
aws logs create-log-group \
  --log-group-name /ecs/carib-remit \
  --region us-east-1
```

#### 6.2 Create Task Definitions

**Backend Task Definition (ecs-task-backend.json):**
```json
{
  "family": "carib-remit-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "<account-id>.dkr.ecr.us-east-1.amazonaws.com/carib-remit/backend:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "hostPort": 3000,
          "protocol": "tcp"
        }
      ],
      "essential": true,
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        },
        {
          "name": "PORT",
          "value": "3000"
        },
        {
          "name": "DB_HOST",
          "value": "<rds-endpoint>"
        },
        {
          "name": "DB_PORT",
          "value": "5432"
        },
        {
          "name": "DB_NAME",
          "value": "carib_remit"
        },
        {
          "name": "DB_USER",
          "value": "postgres"
        },
        {
          "name": "REDIS_HOST",
          "value": "<redis-endpoint>"
        },
        {
          "name": "REDIS_PORT",
          "value": "6379"
        }
      ],
      "secrets": [
        {
          "name": "DB_PASSWORD",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:<account-id>:secret:db-password"
        },
        {
          "name": "JWT_SECRET",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:<account-id>:secret:jwt-secret"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/carib-remit",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "backend"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:3000/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 60
      }
    }
  ]
}
```

**Frontend Task Definition (ecs-task-frontend.json):**
```json
{
  "family": "carib-remit-frontend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "frontend",
      "image": "<account-id>.dkr.ecr.us-east-1.amazonaws.com/carib-remit/frontend:latest",
      "portMappings": [
        {
          "containerPort": 5173,
          "hostPort": 5173,
          "protocol": "tcp"
        }
      ],
      "essential": true,
      "environment": [
        {
          "name": "VITE_API_URL",
          "value": "https://api.caribremit.com/api/v1"
        },
        {
          "name": "VITE_API_TIMEOUT",
          "value": "30000"
        },
        {
          "name": "VITE_ENABLE_2FA",
          "value": "true"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/carib-remit",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "frontend"
        }
      }
    }
  ]
}
```

Register task definitions:
```bash
aws ecs register-task-definition \
  --cli-input-json file://ecs-task-backend.json \
  --region us-east-1

aws ecs register-task-definition \
  --cli-input-json file://ecs-task-frontend.json \
  --region us-east-1
```

### Step 7: Create ECS Services

```bash
# Create backend service
aws ecs create-service \
  --cluster carib-remit-prod \
  --service-name carib-remit-backend \
  --task-definition carib-remit-backend \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx,subnet-yyy],securityGroups=[sg-backend],assignPublicIp=DISABLED}" \
  --load-balancers targetGroupArn=arn:aws:elasticloadbalancing:...,containerName=backend,containerPort=3000 \
  --region us-east-1

# Create frontend service
aws ecs create-service \
  --cluster carib-remit-prod \
  --service-name carib-remit-frontend \
  --task-definition carib-remit-frontend \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx,subnet-yyy],securityGroups=[sg-frontend],assignPublicIp=DISABLED}" \
  --load-balancers targetGroupArn=arn:aws:elasticloadbalancing:...,containerName=frontend,containerPort=5173 \
  --region us-east-1
```

### Step 8: Set Up Load Balancer

```bash
# Create Application Load Balancer
aws elbv2 create-load-balancer \
  --name carib-remit-alb \
  --subnets subnet-xxx subnet-yyy \
  --security-groups sg-alb \
  --scheme internet-facing \
  --type application \
  --ip-address-type ipv4 \
  --region us-east-1

# Create target group for backend
aws elbv2 create-target-group \
  --name carib-remit-backend-tg \
  --protocol HTTP \
  --port 3000 \
  --vpc-id vpc-xxx \
  --target-type ip \
  --health-check-protocol HTTP \
  --health-check-path /health \
  --health-check-interval-seconds 30 \
  --health-check-timeout-seconds 5 \
  --healthy-threshold-count 2 \
  --unhealthy-threshold-count 3 \
  --region us-east-1

# Create target group for frontend
aws elbv2 create-target-group \
  --name carib-remit-frontend-tg \
  --protocol HTTP \
  --port 5173 \
  --vpc-id vpc-xxx \
  --target-type ip \
  --region us-east-1

# Create listeners
aws elbv2 create-listener \
  --load-balancer-arn arn:aws:elasticloadbalancing:... \
  --protocol HTTPS \
  --port 443 \
  --certificate-arn arn:aws:acm:... \
  --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:... \
  --region us-east-1
```

### Step 9: Set Up S3 and CloudFront

```bash
# Create S3 bucket
aws s3api create-bucket \
  --bucket carib-remit-assets \
  --region us-east-1

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket carib-remit-assets \
  --versioning-configuration Status=Enabled

# Create CloudFront distribution
aws cloudfront create-distribution \
  --distribution-config file://cloudfront-config.json
```

**cloudfront-config.json:**
```json
{
  "CallerReference": "carib-remit-2024",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3Origin",
        "DomainName": "carib-remit-assets.s3.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3Origin",
    "ViewerProtocolPolicy": "redirect-to-https",
    "TrustedSigners": {
      "Enabled": false,
      "Quantity": 0
    },
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {
        "Forward": "none"
      }
    },
    "MinTTL": 0,
    "DefaultTTL": 86400,
    "MaxTTL": 31536000
  },
  "Enabled": true,
  "DefaultRootObject": "index.html"
}
```

### Step 10: Configure SSL/TLS Certificate

```bash
# Request certificate from ACM
aws acm request-certificate \
  --domain-name caribremit.com \
  --subject-alternative-names "*.caribremit.com" \
  --validation-method DNS \
  --region us-east-1

# Verify domain ownership in ACM console
# Then use certificate ARN in ALB and CloudFront
```

---

## 2. Vercel Frontend Deployment (Recommended for Frontend)

### Step 1: Create Vercel Account

```bash
# Sign up at https://vercel.com
# Connect GitHub account
```

### Step 2: Configure Environment Variables

Create `.env.production` in frontend directory:

```env
VITE_API_URL=https://api.caribremit.com/api/v1
VITE_API_TIMEOUT=30000
VITE_ENABLE_2FA=true
VITE_ENABLE_BIOMETRIC=true
VITE_ENABLE_DARK_MODE=true
VITE_ENABLE_CRYPTO=true
VITE_NODE_ENV=production
```

### Step 3: Deploy with Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy frontend
cd frontend
vercel --prod

# Set environment variables
vercel env add VITE_API_URL
vercel env add VITE_API_TIMEOUT
# ... etc
```

### Step 4: Configure Custom Domain

```bash
# In Vercel Dashboard:
# 1. Go to Project Settings → Domains
# 2. Add custom domain: caribremit.com
# 3. Add DNS records (provided by Vercel)
# 4. Wait for DNS propagation (5-30 minutes)
```

### Step 5: Enable Preview Deployments

```bash
# Create vercel.json in frontend root
```

**vercel.json:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "installCommand": "npm install",
  "env": {
    "VITE_API_URL": "@vite_api_url",
    "VITE_API_TIMEOUT": "@vite_api_timeout"
  }
}
```

---

## 3. Google Cloud Deployment

### Step 1: Set Up Google Cloud Project

```bash
# Install Google Cloud SDK
curl https://sdk.cloud.google.com | bash

# Initialize
gcloud init

# Create project
gcloud projects create carib-remit-prod --name="CaribRemit"
gcloud config set project carib-remit-prod
```

### Step 2: Set Up Cloud SQL (PostgreSQL)

```bash
# Create Cloud SQL instance
gcloud sql instances create carib-remit-db \
  --database-version=POSTGRES_14 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --backup \
  --availability-type=REGIONAL

# Create database
gcloud sql databases create carib_remit \
  --instance=carib-remit-db

# Create user
gcloud sql users create postgres \
  --instance=carib-remit-db \
  --password
```

### Step 3: Set Up Memorystore (Redis)

```bash
# Create Memorystore instance
gcloud redis instances create carib-remit-cache \
  --size=1 \
  --region=us-central1 \
  --redis-version=7.0
```

### Step 4: Set Up Artifact Registry

```bash
# Create repository
gcloud artifacts repositories create carib-remit \
  --repository-format=docker \
  --location=us-central1 \
  --description="CaribRemit Docker images"

# Configure Docker authentication
gcloud auth configure-docker us-central1-docker.pkg.dev

# Build and push images
docker build -t us-central1-docker.pkg.dev/carib-remit-prod/carib-remit/backend:latest ./backend

docker push us-central1-docker.pkg.dev/carib-remit-prod/carib-remit/backend:latest
```

### Step 5: Deploy to Cloud Run

```bash
# Deploy backend
gcloud run deploy carib-remit-backend \
  --image us-central1-docker.pkg.dev/carib-remit-prod/carib-remit/backend:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "NODE_ENV=production,DB_HOST=<cloud-sql-ip>" \
  --memory 512Mi \
  --cpu 1

# Deploy frontend
gcloud run deploy carib-remit-frontend \
  --image us-central1-docker.pkg.dev/carib-remit-prod/carib-remit/frontend:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 256Mi
```

### Step 6: Set Up Cloud Load Balancing

```bash
# Create backend service
gcloud compute backend-services create carib-remit-backend-svc \
  --protocol=HTTP \
  --global

# Create NEG (Network Endpoint Group)
gcloud compute network-endpoint-groups create carib-remit-neg \
  --region=us-central1 \
  --network-endpoint-type=SERVERLESS \
  --cloud-run-service=carib-remit-backend \
  --cloud-run-region=us-central1

# Add NEG to backend service
gcloud compute backend-services add-backend carib-remit-backend-svc \
  --instance-group=carib-remit-neg \
  --global

# Create URL map
gcloud compute url-maps create carib-remit-lb \
  --default-service=carib-remit-backend-svc

# Create HTTP(S) proxy
gcloud compute target-https-proxies create carib-remit-proxy \
  --url-map=carib-remit-lb \
  --ssl-certificates=carib-remit-cert

# Create forwarding rule
gcloud compute forwarding-rules create carib-remit-fw-rule \
  --global \
  --target-https-proxy=carib-remit-proxy \
  --address=carib-remit-ip \
  --ports=443
```

---

## 4. Production Environment Configuration

Create `.env.production` in backend directory:

```env
# Application
NODE_ENV=production
PORT=3000
API_URL=https://api.caribremit.com/v1
FRONTEND_URL=https://caribremit.com

# Database
DB_HOST=<rds-endpoint>
DB_PORT=5432
DB_NAME=carib_remit
DB_USER=postgres
DB_PASSWORD=<secure-password>
DB_POOL_MIN=5
DB_POOL_MAX=20
DB_SSL=true

# Redis
REDIS_HOST=<redis-endpoint>
REDIS_PORT=6379
REDIS_PASSWORD=<redis-password>
REDIS_TLS=true

# JWT
JWT_SECRET=<generate-with-: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
JWT_EXPIRATION=15m
JWT_REFRESH_SECRET=<generate-same-way>
JWT_REFRESH_EXPIRATION=7d

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CORS_ORIGIN=https://caribremit.com

# Email (AWS SES)
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=<ses-username>
SMTP_PASSWORD=<ses-password>
MAIL_FROM=noreply@caribremit.com

# SMS (Twilio)
TWILIO_ACCOUNT_SID=<twilio-sid>
TWILIO_AUTH_TOKEN=<twilio-token>
TWILIO_PHONE_NUMBER=+1234567890

# Payments
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
PAYPAL_CLIENT_ID=xxxxx
PAYPAL_CLIENT_SECRET=xxxxx

# External APIs
FX_API_KEY=<api-key>
SENDGRID_API_KEY=<api-key>

# Logging
LOG_LEVEL=info
LOG_FORMAT=json

# Monitoring
SENTRY_DSN=<sentry-url>
NEW_RELIC_LICENSE_KEY=<license-key>
```

---

## 5. CI/CD Pipeline with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: cd backend && npm install

      - name: Run tests
        run: cd backend && npm test
        env:
          DB_HOST: localhost
          DB_USER: postgres
          DB_PASSWORD: postgres
          DB_NAME: carib_remit
          REDIS_HOST: localhost

      - name: Run linter
        run: cd backend && npm run lint

  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: cd frontend && npm install

      - name: Run tests
        run: cd frontend && npm test

      - name: Build
        run: cd frontend && npm run build

  build-backend:
    needs: test-backend
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Login to ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1

      - name: Build, tag, and push image to ECR
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: carib-remit/backend
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG ./backend
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
          docker tag $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG $ECR_REGISTRY/$ECR_REPOSITORY:latest
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest

      - name: Update ECS service
        run: |
          aws ecs update-service \
            --cluster carib-remit-prod \
            --service carib-remit-backend \
            --force-new-deployment \
            --region us-east-1

  build-frontend:
    needs: test-frontend
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Login to ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1

      - name: Build, tag, and push image to ECR
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: carib-remit/frontend
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG ./frontend
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
          docker tag $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG $ECR_REGISTRY/$ECR_REPOSITORY:latest
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest

      - name: Update ECS service
        run: |
          aws ecs update-service \
            --cluster carib-remit-prod \
            --service carib-remit-frontend \
            --force-new-deployment \
            --region us-east-1

  deploy-vercel:
    needs: test-frontend
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./frontend
          production: true
```

---

## 6. Database Backup and Disaster Recovery

### Automated Backups

```bash
# AWS RDS Automated Backups
aws rds modify-db-instance \
  --db-instance-identifier carib-remit-prod \
  --backup-retention-period 30 \
  --preferred-backup-window "03:00-04:00" \
  --apply-immediately

# Create manual snapshot
aws rds create-db-snapshot \
  --db-instance-identifier carib-remit-prod \
  --db-snapshot-identifier carib-remit-backup-$(date +%Y%m%d)
```

### Backup Script (Daily)

Create `scripts/backup-database.sh`:

```bash
#!/bin/bash

set -e

# Configuration
RDS_INSTANCE="carib-remit-prod"
S3_BUCKET="carib-remit-backups"
BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
LOG_FILE="backup-${BACKUP_DATE}.log"

echo "Starting database backup at $(date)" >> ${LOG_FILE}

# Create RDS snapshot
echo "Creating RDS snapshot..." >> ${LOG_FILE}
aws rds create-db-snapshot \
  --db-instance-identifier ${RDS_INSTANCE} \
  --db-snapshot-identifier carib-remit-backup-${BACKUP_DATE} \
  --region us-east-1 2>> ${LOG_FILE}

# Wait for snapshot to complete
echo "Waiting for snapshot to complete..." >> ${LOG_FILE}
aws rds wait db-snapshot-available \
  --db-snapshot-identifier carib-remit-backup-${BACKUP_DATE} \
  --region us-east-1 2>> ${LOG_FILE}

echo "Backup completed at $(date)" >> ${LOG_FILE}

# Upload log to S3
aws s3 cp ${LOG_FILE} s3://${S3_BUCKET}/logs/
```

Schedule with CloudWatch Events:

```bash
# Create CloudWatch rule
aws events put-rule \
  --name carib-remit-daily-backup \
  --schedule-expression "cron(0 3 * * ? *)"

# Create Lambda function to execute backup script
# (Setup IAM role, Lambda code, etc.)
```

### Point-in-Time Recovery

```bash
# Restore from snapshot
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier carib-remit-restored \
  --db-snapshot-identifier carib-remit-backup-20240101_000000 \
  --region us-east-1

# Enable automated backups on restored instance
aws rds modify-db-instance \
  --db-instance-identifier carib-remit-restored \
  --backup-retention-period 7 \
  --apply-immediately
```

---

## 7. Monitoring and Logging

### AWS CloudWatch Monitoring

```bash
# Create dashboard
aws cloudwatch put-dashboard \
  --dashboard-name CaribRemit \
  --dashboard-body file://dashboard-config.json
```

**dashboard-config.json:**
```json
{
  "widgets": [
    {
      "type": "metric",
      "properties": {
        "metrics": [
          ["AWS/ECS", "CPUUtilization", {"stat": "Average"}],
          ["AWS/ECS", "MemoryUtilization", {"stat": "Average"}],
          ["AWS/RDS", "DatabaseConnections"],
          ["AWS/RDS", "CPUUtilization"],
          ["AWS/ElastiCache", "CacheHits"],
          ["AWS/ApplicationELB", "TargetResponseTime"],
          ["AWS/ApplicationELB", "RequestCount"]
        ],
        "period": 300,
        "stat": "Average",
        "region": "us-east-1",
        "title": "Application Metrics"
      }
    }
  ]
}
```

### CloudWatch Log Insights Queries

```bash
# Error rate
fields @timestamp, @message
| filter @message like /ERROR/
| stats count() as error_count by bin(5m)

# Slow queries
fields @duration
| filter @duration > 1000
| stats avg(@duration), max(@duration), pct(@duration, 95)

# Authentication failures
fields @timestamp, @message, user_id
| filter @message like /authentication failed/
| stats count() by user_id
```

### Application Monitoring (Sentry)

```bash
# Install Sentry
npm install @sentry/node @sentry/tracing

# Configure in backend/src/app.js
```

**Backend Sentry Setup:**
```javascript
const Sentry = require('@sentry/node');
const { CaptureConsole } = require('@sentry/integrations');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  integrations: [
    new CaptureConsole({
      levels: ['warn', 'error']
    })
  ],
  tracesSampleRate: 1.0,
  profilesSampleRate: 0.1
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());
```

### Frontend Monitoring

```bash
# Install Sentry for React
npm install @sentry/react @sentry/tracing

# Configure in frontend/src/main.jsx
```

**Frontend Sentry Setup:**
```javascript
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_NODE_ENV,
  integrations: [
    new BrowserTracing(),
    new Sentry.Replay()
  ],
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0
});
```

---

## 8. Security Best Practices

### SSL/TLS Configuration

```bash
# Check SSL/TLS rating
curl -I https://caribremit.com

# Use modern protocols only (TLS 1.2+)
# In ALB listener: SSL Policy = ELBSecurityPolicy-TLS-1-2-2017-01
```

### WAF (Web Application Firewall)

```bash
# Create WAF web ACL
aws wafv2 create-web-acl \
  --name carib-remit-waf \
  --scope REGIONAL \
  --default-action Allow={} \
  --rules file://waf-rules.json \
  --visibility-config \
    SampledRequestsEnabled=true,CloudWatchMetricsEnabled=true,MetricName=carib-remit-waf
```

### DDoS Protection

```bash
# Enable AWS Shield Advanced
aws shield subscribe-to-drt \
  --role-arn arn:aws:iam::<account-id>:role/DRTRole
```

### Secrets Management

```bash
# Store secrets in AWS Secrets Manager
aws secretsmanager create-secret \
  --name carib-remit/db-password \
  --secret-string "your-secure-password"

# Retrieve secret
aws secretsmanager get-secret-value \
  --secret-id carib-remit/db-password
```

---

## 9. Scaling Strategies

### Horizontal Scaling (ECS)

```bash
# Update auto-scaling policy
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --scalable-dimension ecs:service:DesiredCount \
  --resource-id service/carib-remit-prod/carib-remit-backend \
  --min-capacity 2 \
  --max-capacity 10

# Create scaling policy
aws application-autoscaling put-scaling-policy \
  --policy-name cpu-scaling \
  --service-namespace ecs \
  --scalable-dimension ecs:service:DesiredCount \
  --resource-id service/carib-remit-prod/carib-remit-backend \
  --policy-type TargetTrackingScaling \
  --target-tracking-scaling-policy-configuration file://scaling-policy.json
```

**scaling-policy.json:**
```json
{
  "TargetValue": 70.0,
  "PredefinedMetricSpecification": {
    "PredefinedMetricType": "ECSServiceAverageCPUUtilization"
  },
  "ScaleOutCooldown": 300,
  "ScaleInCooldown": 300
}
```

### Database Scaling

```bash
# Upgrade RDS instance class
aws rds modify-db-instance \
  --db-instance-identifier carib-remit-prod \
  --db-instance-class db.t3.large \
  --apply-immediately

# Enable read replicas
aws rds create-db-instance-read-replica \
  --db-instance-identifier carib-remit-prod-replica-1 \
  --source-db-instance-identifier carib-remit-prod
```

### Caching Strategy

```bash
# Upgrade Redis tier
aws elasticache-modify-cache-cluster \
  --cache-cluster-id carib-remit-cache \
  --cache-node-type cache.m6g.large \
  --apply-immediately
```

---

## 10. Post-Deployment Checklist

- [ ] All health checks passing
- [ ] Database migrations completed
- [ ] SSL/TLS certificate active
- [ ] Domain DNS records propagated
- [ ] CloudFront distribution active
- [ ] Monitoring and logging active
- [ ] Backup jobs running
- [ ] Auto-scaling policies enabled
- [ ] Rate limiting configured
- [ ] WAF rules enabled
- [ ] Load testing completed successfully
- [ ] Documentation updated
- [ ] Team trained on deployment process
- [ ] Incident response plan in place
- [ ] 24/7 on-call rotation established

---

## 11. Troubleshooting

### Common Issues

#### ECS Task Fails to Start

```bash
# Check logs
aws logs tail /ecs/carib-remit --follow

# Describe task
aws ecs describe-tasks \
  --cluster carib-remit-prod \
  --tasks <task-arn>

# Check container startup time
# Increase startPeriod in task definition
```

#### Database Connection Timeout

```bash
# Verify security group allows traffic
aws ec2 describe-security-groups \
  --group-ids sg-rds-sg

# Test connectivity
psql -h <rds-endpoint> -U postgres -d carib_remit -c "SELECT 1"
```

#### High Latency

```bash
# Check RDS performance insights
aws pi get-resource-metrics \
  --service-type RDS \
  --identifier-arn arn:aws:rds:us-east-1:<account>:db:carib-remit-prod \
  --period-in-seconds 300

# Add RDS read replica for read-heavy workloads
```

#### Memory Leak in Application

```bash
# Monitor memory usage
aws logs insights \
  --log-group /ecs/carib-remit \
  --query "fields @message | filter @message like /memory/"

# Check for circular references in code
# Review Node.js heap snapshots
```

---

## 12. Deployment Checklist by Cloud Provider

### AWS Checklist

- [ ] VPC and subnets created
- [ ] Security groups configured
- [ ] RDS instance created and migrated
- [ ] ElastiCache cluster created
- [ ] ECR repositories created
- [ ] ECS cluster and services created
- [ ] ALB configured with health checks
- [ ] CloudFront distribution created
- [ ] S3 buckets created for assets/backups
- [ ] ACM certificate issued
- [ ] Route 53 DNS records created
- [ ] CloudWatch monitoring configured
- [ ] CloudTrail enabled for audit logging
- [ ] IAM roles and policies configured
- [ ] Secrets Manager configured

### Vercel Checklist

- [ ] Project connected to GitHub
- [ ] Environment variables configured
- [ ] Custom domain added
- [ ] SSL certificate provisioned
- [ ] Preview deployments enabled
- [ ] Git deploy notifications configured
- [ ] Analytics dashboard enabled

### Google Cloud Checklist

- [ ] Project created and billing enabled
- [ ] Cloud SQL instance created
- [ ] Memorystore (Redis) created
- [ ] Artifact Registry repository created
- [ ] Cloud Run services deployed
- [ ] Cloud Load Balancing configured
- [ ] Cloud CDN enabled
- [ ] Cloud Monitoring dashboards created
- [ ] Cloud Logging configured

---

## Support and Escalation

### Deployment Support Contacts

- **AWS Support**: https://console.aws.amazon.com/support/
- **Vercel Support**: support@vercel.com
- **Google Cloud Support**: https://cloud.google.com/support-hub
- **Sentry Support**: https://sentry.io/support/

### Runbooks

- Emergency Rollback: See ROLLBACK.md
- Database Recovery: See DATABASE_RECOVERY.md
- Security Incident: See SECURITY_INCIDENT.md

---

**Deployment documentation complete! 🚀**

For questions or issues, consult the appropriate cloud provider's documentation or contact your DevOps team.
