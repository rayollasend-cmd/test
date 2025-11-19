# CaribRemit Emergency Rollback Procedures

Quick reference for rolling back deployments in case of critical issues.

## Emergency Contacts

- **DevOps Lead**: [contact information]
- **Database Admin**: [contact information]
- **Security Team**: [contact information]
- **On-Call Engineer**: Check PagerDuty

---

## Rollback Decision Tree

```
┌─ Is it a critical issue affecting users?
│
├─ YES → Go to Section 1: Quick Rollback
│
└─ NO → Monitor, gather info, decide on next steps
```

---

## 1. Quick ECS Rollback (5-15 minutes)

### Backend Service Rollback

```bash
# 1. Get the previous task definition revision
aws ecs describe-task-definition \
  --task-definition carib-remit-backend \
  --query 'taskDefinition.revision' \
  --region us-east-1

# 2. List previous revisions
aws ecs list-task-definitions \
  --family-prefix carib-remit-backend \
  --region us-east-1

# 3. Update service to previous revision
PREVIOUS_REVISION=123  # Update with actual revision number

aws ecs update-service \
  --cluster carib-remit-prod \
  --service carib-remit-backend \
  --task-definition carib-remit-backend:$PREVIOUS_REVISION \
  --region us-east-1

# 4. Monitor the rollback
aws ecs describe-services \
  --cluster carib-remit-prod \
  --services carib-remit-backend \
  --region us-east-1 \
  --query 'services[0].[runningCount,desiredCount]'

# 5. Wait for rollback to complete
aws ecs wait services-stable \
  --cluster carib-remit-prod \
  --services carib-remit-backend \
  --region us-east-1
```

### Frontend Service Rollback

```bash
# Same process for frontend
PREVIOUS_REVISION=456

aws ecs update-service \
  --cluster carib-remit-prod \
  --service carib-remit-frontend \
  --task-definition carib-remit-frontend:$PREVIOUS_REVISION \
  --region us-east-1
```

### Vercel Frontend Rollback

```bash
# If frontend deployed via Vercel, use Vercel dashboard
# 1. Go to https://vercel.com
# 2. Select CaribRemit project
# 3. Go to Deployments tab
# 4. Find the previous working deployment
# 5. Click "Promote to Production"
```

---

## 2. Database Rollback (Requires Caution)

### Backup Current State First

```bash
# Create snapshot before rollback
aws rds create-db-snapshot \
  --db-instance-identifier carib-remit-prod \
  --db-snapshot-identifier carib-remit-pre-rollback-$(date +%Y%m%d-%H%M%S) \
  --region us-east-1
```

### Point-in-Time Recovery

```bash
# If migration introduced database issues
# Use RDS Point-in-Time Restore

RESTORE_TIME="2024-01-15T14:00:00Z"  # Set to time before bad migration

# Create restored instance
aws rds restore-db-instance-to-point-in-time \
  --source-db-instance-identifier carib-remit-prod \
  --target-db-instance-identifier carib-remit-restored-temp \
  --restore-time $RESTORE_TIME \
  --use-latest-restorable-time false \
  --region us-east-1

# Test the restored database
# ... run tests against restored DB ...

# If successful, promote restored instance:
# 1. Swap CNAME to point to restored instance
# 2. Monitor for issues
# 3. Delete old instance after confirmation
```

### Manual Rollback of SQL Migration

```bash
# For reversible migrations only
# DO NOT use for destructive migrations (DROP, DELETE)

# 1. Stop all connections to database
psql -h <rds-endpoint> -U postgres -d carib_remit << EOF
SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE datname = 'carib_remit'
AND pid <> pg_backend_pid();
EOF

# 2. Run rollback script
psql -h <rds-endpoint> -U postgres -d carib_remit < migrations/rollback_001.sql

# 3. Verify tables are restored
psql -h <rds-endpoint> -U postgres -d carib_remit -c "\dt"

# 4. Restart ECS services to reconnect
aws ecs update-service \
  --cluster carib-remit-prod \
  --service carib-remit-backend \
  --force-new-deployment \
  --region us-east-1
```

---

## 3. Feature Flag Rollback

For deployments with feature flags, disable problematic features:

```bash
# Update environment variables in ECS task definition
aws ecs update-service \
  --cluster carib-remit-prod \
  --service carib-remit-backend \
  --region us-east-1 \
  --task-definition carib-remit-backend:latest

# Or update via parameter store
aws ssm put-parameter \
  --name /carib-remit/prod/FEATURE_CRYPTO_TRADING \
  --value "false" \
  --overwrite \
  --region us-east-1

# Restart service
aws ecs update-service \
  --cluster carib-remit-prod \
  --service carib-remit-backend \
  --force-new-deployment \
  --region us-east-1
```

---

## 4. Cache Invalidation

If caching caused issues:

```bash
# Clear Redis cache
redis-cli -h <redis-endpoint> -p 6379 FLUSHALL

# Clear CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id E123EXAMPLE \
  --paths "/*" \
  --region us-east-1

# Clear browser cache (frontend only)
# Users may need to hard-refresh: Ctrl+Shift+R / Cmd+Shift+R
```

---

## 5. Immediate Actions Checklist

- [ ] **Declare incident** in team chat/Slack
- [ ] **Notify stakeholders** (business, support, security)
- [ ] **Create incident ticket** in tracking system
- [ ] **Initiate rollback** (see above procedures)
- [ ] **Monitor metrics** during rollback
  ```bash
  # Watch error rates
  aws logs tail /ecs/carib-remit --follow --filter-pattern ERROR

  # Watch API response times
  aws cloudwatch get-metric-statistics \
    --namespace AWS/ApplicationELB \
    --metric-name TargetResponseTime \
    --start-time $(date -u -d '5 minutes ago' +%Y-%m-%dT%H:%M:%S) \
    --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
    --period 60 \
    --statistics Average
  ```
- [ ] **Verify rollback success** (check health checks, test key flows)
- [ ] **Post-mortem** (schedule for later)
- [ ] **Document issues** and resolution

---

## 6. Health Checks During Rollback

### Backend Health

```bash
# Check backend health endpoint
curl https://api.caribremit.com/health

# Check CloudWatch logs for errors
aws logs tail /ecs/carib-remit/backend --follow --filter-pattern ERROR

# Check ECS task status
aws ecs describe-tasks \
  --cluster carib-remit-prod \
  --tasks $(aws ecs list-tasks \
    --cluster carib-remit-prod \
    --service-name carib-remit-backend \
    --query 'taskArns[0]' \
    --output text) \
  --region us-east-1
```

### Frontend Health

```bash
# Check frontend loads
curl -I https://caribremit.com

# Check for JavaScript errors
# Use Chrome DevTools or check browser logs

# Check CloudFront cache
aws cloudfront get-distribution \
  --id E123EXAMPLE \
  --query 'Distribution.Status'
```

### Database Health

```bash
# Check database connections
psql -h <rds-endpoint> -U postgres -d carib_remit -c \
  "SELECT count(*) FROM pg_stat_activity;"

# Check replication lag (if using read replicas)
# For read replicas, check replication lag in RDS dashboard
```

---

## 7. Rollback Troubleshooting

### Service Won't Update

```bash
# Check if another update is in progress
aws ecs describe-services \
  --cluster carib-remit-prod \
  --services carib-remit-backend \
  --region us-east-1 \
  --query 'services[0].deployments'

# Wait for current deployment to complete
aws ecs wait services-stable \
  --cluster carib-remit-prod \
  --services carib-remit-backend \
  --region us-east-1

# Then retry rollback
```

### Tasks Won't Start

```bash
# Check CloudWatch logs
aws logs describe-log-streams \
  --log-group-name /ecs/carib-remit \
  --region us-east-1

aws logs get-log-events \
  --log-group-name /ecs/carib-remit \
  --log-stream-name backend \
  --region us-east-1

# Check task stopped reason
aws ecs describe-tasks \
  --cluster carib-remit-prod \
  --tasks <task-arn> \
  --region us-east-1 \
  --query 'tasks[0].stoppedReason'
```

### High Load During Rollback

```bash
# Scale up frontend/backend temporarily
aws application-autoscaling set-desired-account-limit \
  --service-namespace ecs \
  --scalable-dimension ecs:service:DesiredCount \
  --resource-id service/carib-remit-prod/carib-remit-backend \
  --desired-count 10

# Monitor and scale down once stable
```

---

## 8. Post-Rollback Verification

Run this script to verify the system is healthy:

```bash
#!/bin/bash

echo "=== Post-Rollback Verification ==="

# 1. Check backend health
echo "1. Checking backend health..."
HEALTH=$(curl -s https://api.caribremit.com/health)
if [[ $HEALTH == *"ok"* ]]; then
  echo "✓ Backend is healthy"
else
  echo "✗ Backend health check failed"
  exit 1
fi

# 2. Check frontend loads
echo "2. Checking frontend availability..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://caribremit.com)
if [ $STATUS -eq 200 ]; then
  echo "✓ Frontend is available"
else
  echo "✗ Frontend returned status $STATUS"
  exit 1
fi

# 3. Check database connection
echo "3. Checking database connection..."
DB_CHECK=$(psql -h <rds-endpoint> -U postgres -d carib_remit -c "SELECT 1" 2>&1)
if [[ $DB_CHECK == *"1"* ]]; then
  echo "✓ Database is accessible"
else
  echo "✗ Database connection failed"
  exit 1
fi

# 4. Check critical tables
echo "4. Checking critical database tables..."
TABLES=$(psql -h <rds-endpoint> -U postgres -d carib_remit -t -c \
  "SELECT tablename FROM pg_tables WHERE schemaname='public';" | wc -l)
if [ $TABLES -gt 0 ]; then
  echo "✓ Found $TABLES tables"
else
  echo "✗ No tables found in database"
  exit 1
fi

# 5. Check API endpoints
echo "5. Checking key API endpoints..."
ENDPOINTS=(
  "/api/v1/rates"
  "/api/v1/auth/login"
  "/api/v1/users/profile"
)

for ENDPOINT in "${ENDPOINTS[@]}"; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://api.caribremit.com$ENDPOINT)
  if [ $STATUS -eq 200 ] || [ $STATUS -eq 401 ]; then
    echo "✓ Endpoint $ENDPOINT is available"
  else
    echo "✗ Endpoint $ENDPOINT returned status $STATUS"
  fi
done

echo ""
echo "=== Verification Complete ==="
```

---

## 9. Communication Template

When rolling back, communicate status to stakeholders:

```
Subject: INCIDENT: System Rollback in Progress

We are experiencing [brief description of issue] and have initiated a rollback to the previous stable version.

**Current Status**: Rollback in progress
**Expected Duration**: 10-15 minutes
**Impact**: [describe what is affected]
**Action**: We are rolling back to the previous version

**Timeline**:
- 14:00 UTC - Issue detected
- 14:02 UTC - Incident declared
- 14:03 UTC - Rollback initiated
- ~14:15 UTC - ETA for resolution

We will provide updates every 5 minutes.

Thank you for your patience.
```

---

## 10. Post-Incident Review

After successful rollback, schedule:

1. **Immediate debrief** (15 min)
   - What went wrong?
   - How did we detect it?
   - How long was it down?

2. **Root cause analysis** (1-2 days)
   - Why did the issue occur?
   - How do we prevent it next time?

3. **Action items**
   - Improve testing procedures
   - Add monitoring alerts
   - Update runbooks
   - Training for team

---

## Quick Reference Card

```
QUICK ROLLBACK COMMAND:

# Get previous revision
aws ecs list-task-definitions --family-prefix carib-remit-backend

# Rollback backend
aws ecs update-service --cluster carib-remit-prod \
  --service carib-remit-backend \
  --task-definition carib-remit-backend:REVISION \
  --region us-east-1

# Rollback frontend
aws ecs update-service --cluster carib-remit-prod \
  --service carib-remit-frontend \
  --task-definition carib-remit-frontend:REVISION \
  --region us-east-1

# Monitor rollback
aws ecs wait services-stable --cluster carib-remit-prod \
  --services carib-remit-backend carib-remit-frontend

# Verify health
curl https://api.caribremit.com/health
curl -I https://caribremit.com
```

---

**Remember: When in doubt, ROLLBACK first, troubleshoot later.**
