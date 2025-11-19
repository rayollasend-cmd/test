# CaribRemit Database Recovery Guide

Comprehensive procedures for recovering from database issues and disasters.

---

## Table of Contents

1. [Minor Issues (Locks, Slow Queries)](#minor-issues)
2. [Data Corruption](#data-corruption)
3. [Backup and Restore](#backup-restore)
4. [Disaster Recovery](#disaster-recovery)
5. [Performance Issues](#performance-issues)
6. [Troubleshooting](#troubleshooting)

---

## 1. Minor Issues (Locks, Slow Queries)

### Identify Blocked Queries

```bash
# Connect to database
psql -h <rds-endpoint> -U postgres -d carib_remit

# Find long-running queries
SELECT pid, usename, application_name, state, state_change, query
FROM pg_stat_activity
WHERE state != 'idle'
ORDER BY state_change;

# Find locks
SELECT blocked_locks.pid AS blocked_pid,
  blocked_activity.usename AS blocked_user,
  blocking_locks.pid AS blocking_pid,
  blocking_activity.usename AS blocking_user,
  blocked_activity.query AS blocked_statement,
  blocking_activity.query AS blocking_statement
FROM pg_catalog.pg_locks blocked_locks
JOIN pg_catalog.pg_stat_activity blocked_activity ON blocked_activity.pid = blocked_locks.pid
JOIN pg_catalog.pg_locks blocking_locks ON blocking_locks.locktype = blocked_locks.locktype
  AND blocking_locks.database IS NOT DISTINCT FROM blocked_locks.database
  AND blocking_locks.relation IS NOT DISTINCT FROM blocked_locks.relation
  AND blocking_locks.page IS NOT DISTINCT FROM blocked_locks.page
  AND blocking_locks.tuple IS NOT DISTINCT FROM blocked_locks.tuple
  AND blocking_locks.virtualxid IS NOT DISTINCT FROM blocked_locks.virtualxid
  AND blocking_locks.transactionid IS NOT DISTINCT FROM blocked_locks.transactionid
  AND blocking_locks.classid IS NOT DISTINCT FROM blocked_locks.classid
  AND blocking_locks.objid IS NOT DISTINCT FROM blocked_locks.objid
  AND blocking_locks.objsubid IS NOT DISTINCT FROM blocked_locks.objsubid
  AND blocking_locks.pid != blocked_locks.pid
JOIN pg_catalog.pg_stat_activity blocking_activity ON blocking_activity.pid = blocking_locks.pid
WHERE NOT blocked_locks.granted;
```

### Kill Blocking Connections

```bash
# Kill a specific connection
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE pid = <blocking_pid>;

# Kill all idle connections
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE state = 'idle'
AND query_start < NOW() - INTERVAL '30 minutes';

# Kill all connections except current
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'carib_remit'
AND pid <> pg_backend_pid();
```

### Analyze Slow Queries

```sql
-- Enable query logging
ALTER SYSTEM SET log_min_duration_statement = 1000;  -- Log queries > 1 second
SELECT pg_reload_conf();

-- View slow query log
-- OR use CloudWatch Logs if on RDS

-- Analyze query plan
EXPLAIN ANALYZE
SELECT * FROM transactions WHERE user_id = 'uuid' ORDER BY created_at DESC LIMIT 10;

-- Add missing index if needed
CREATE INDEX idx_transactions_user_created
ON transactions(user_id, created_at DESC);

-- Vacuum and analyze
VACUUM ANALYZE transactions;
```

---

## 2. Data Corruption

### Detection

```sql
-- Check table integrity
REINDEX TABLE transactions;

-- Look for NULL in NOT NULL columns
SELECT * FROM users WHERE email IS NULL;

-- Check foreign key integrity
ALTER TABLE transactions VALIDATE CONSTRAINT fk_transactions_user;

-- Check unique constraint violations
SELECT email, COUNT(*)
FROM users
GROUP BY email
HAVING COUNT(*) > 1;
```

### Recovery from Backup

```bash
# For corrupted data, restore from clean backup
# See Backup and Restore section below

# For single table corruption
pg_dump -h <rds-endpoint> -U postgres -d carib_remit \
  --table=corrupted_table > backup_table.sql

# Restore from backup
dropdb -h <rds-endpoint> -U postgres carib_remit
createdb -h <rds-endpoint> -U postgres carib_remit

psql -h <rds-endpoint> -U postgres -d carib_remit < full_backup.sql
```

### Manual Data Repair

```sql
-- For duplicate entries
DELETE FROM users
WHERE id NOT IN (
  SELECT DISTINCT ON (email) id
  FROM users
  ORDER BY email, created_at DESC
);

-- For missing foreign keys
DELETE FROM transactions
WHERE user_id NOT IN (SELECT id FROM users);

-- For invalid states
UPDATE transactions
SET status = 'failed'
WHERE status NOT IN ('pending', 'processing', 'completed', 'failed', 'cancelled');
```

---

## 3. Backup and Restore

### Automated Backup Strategy

**RDS Automated Backups:**
- Retention: 30 days
- Window: 03:00-04:00 UTC
- Multi-AZ: Enabled for automatic failover

```bash
# Create manual snapshot
aws rds create-db-snapshot \
  --db-instance-identifier carib-remit-prod \
  --db-snapshot-identifier carib-remit-backup-$(date +%Y%m%d-%H%M%S) \
  --region us-east-1

# List snapshots
aws rds describe-db-snapshots \
  --db-instance-identifier carib-remit-prod \
  --region us-east-1

# Copy snapshot to another region (for DR)
aws rds copy-db-snapshot \
  --source-db-snapshot-identifier arn:aws:rds:us-east-1:account:snapshot:name \
  --target-db-snapshot-identifier carib-remit-backup-dr \
  --region us-west-2
```

### pg_dump for Full Backup

```bash
# Full database backup
pg_dump -h <rds-endpoint> -U postgres -d carib_remit \
  --format=custom \
  --compress=9 \
  --file=carib_remit_backup_$(date +%Y%m%d_%H%M%S).dump

# Backup only specific table
pg_dump -h <rds-endpoint> -U postgres -d carib_remit \
  --table=transactions \
  --format=plain > transactions_backup.sql

# Backup with custom parameters
pg_dump -h <rds-endpoint> -U postgres -d carib_remit \
  --format=custom \
  --compress=9 \
  --verbose \
  --blobs \
  --file=full_backup.dump

# Upload to S3
aws s3 cp full_backup.dump s3://carib-remit-backups/postgres/
```

### Restore from Snapshot

```bash
# Create new instance from snapshot
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier carib-remit-restored \
  --db-snapshot-identifier carib-remit-backup-20240115-000000 \
  --db-instance-class db.t3.medium \
  --multi-az \
  --region us-east-1

# Wait for restore to complete
aws rds wait db-instance-available \
  --db-instances carib-remit-restored \
  --region us-east-1

# Verify data integrity
psql -h <restored-endpoint> -U postgres -d carib_remit -c \
  "SELECT COUNT(*) FROM users;"

# Promote to primary (after verification)
# ... update DNS/connection strings ...
# ... monitor for issues ...
# ... delete old instance ...
```

### Restore from pg_dump

```bash
# Full database restore
pg_restore -h <rds-endpoint> -U postgres \
  --format=custom \
  --verbose \
  --dbname=carib_remit \
  carib_remit_backup.dump

# Restore with drop (if needed)
pg_restore -h <rds-endpoint> -U postgres \
  --format=custom \
  --clean \
  --create \
  --verbose \
  --dbname=postgres \
  carib_remit_backup.dump

# Restore specific table
pg_restore -h <rds-endpoint> -U postgres \
  --format=custom \
  --table=transactions \
  --dbname=carib_remit \
  full_backup.dump

# Monitor restoration
SELECT * FROM pg_stat_progress_basebackup;
```

---

## 4. Disaster Recovery

### Failover to Read Replica

```bash
# Promote read replica to primary
aws rds promote-read-replica \
  --db-instance-identifier carib-remit-prod-replica-1 \
  --region us-east-1

# Update connection strings to new endpoint
# Monitor for replication lag
aws cloudwatch get-metric-statistics \
  --namespace AWS/RDS \
  --metric-name ReplicaLag \
  --dimensions Name=DBInstanceIdentifier,Value=carib-remit-prod-replica-1 \
  --start-time $(date -u -d '10 minutes ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 60 \
  --statistics Average,Maximum
```

### Cross-Region Recovery

```bash
# Create read replica in different region
aws rds create-db-instance-read-replica \
  --db-instance-identifier carib-remit-prod-dr \
  --source-db-instance-identifier arn:aws:rds:us-east-1:account:db:carib-remit-prod \
  --db-instance-class db.t3.medium \
  --region us-west-2

# Promote as independent instance (if primary fails)
aws rds promote-read-replica \
  --db-instance-identifier carib-remit-prod-dr \
  --region us-west-2

# Create snapshot and restore in primary region if needed
aws rds create-db-snapshot \
  --db-instance-identifier carib-remit-prod-dr \
  --db-snapshot-identifier carib-remit-dr-snapshot \
  --region us-west-2

aws rds copy-db-snapshot \
  --source-db-snapshot-identifier arn:aws:rds:us-west-2:account:snapshot:carib-remit-dr-snapshot \
  --target-db-snapshot-identifier carib-remit-restored \
  --region us-east-1
```

### RTO/RPO Targets

- **RTO (Recovery Time Objective)**: < 30 minutes
- **RPO (Recovery Point Objective)**: < 15 minutes

---

## 5. Performance Issues

### Check Database Size

```sql
-- Total database size
SELECT pg_size_pretty(pg_database_size('carib_remit')) as db_size;

-- Table sizes
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename))
FROM pg_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Index sizes
SELECT schemaname, tablename, indexname, pg_size_pretty(pg_relation_size(indexrelid))
FROM pg_indexes
ORDER BY pg_relation_size(indexrelid) DESC;
```

### Vacuum and Analyze

```bash
# Full vacuum (locks table during operation)
psql -h <rds-endpoint> -U postgres -d carib_remit -c "VACUUM FULL ANALYZE;"

# Concurrent vacuum (allows reads/writes)
psql -h <rds-endpoint> -U postgres -d carib_remit -c "VACUUM ANALYZE;"

# Specific table
psql -h <rds-endpoint> -U postgres -d carib_remit -c "VACUUM ANALYZE transactions;"

# Reindex (rebuild indexes)
psql -h <rds-endpoint> -U postgres -d carib_remit -c "REINDEX DATABASE carib_remit;"
```

### Optimize Queries

```sql
-- Enable query timing
\timing

-- Run query and check EXPLAIN ANALYZE
EXPLAIN (ANALYZE, BUFFERS, VERBOSE)
SELECT u.*, COUNT(t.id) as transaction_count
FROM users u
LEFT JOIN transactions t ON u.id = t.user_id
WHERE u.created_at > NOW() - INTERVAL '30 days'
GROUP BY u.id
ORDER BY transaction_count DESC
LIMIT 10;

-- Create needed indexes
CREATE INDEX idx_transactions_user_created
ON transactions(user_id, created_at DESC);

CREATE INDEX idx_users_created
ON users(created_at DESC);
```

### Monitor Connection Pool

```sql
-- Check connections
SELECT count(*) FROM pg_stat_activity;

-- Identify idle connections
SELECT pid, usename, state, query_start
FROM pg_stat_activity
WHERE state = 'idle'
AND query_start < NOW() - INTERVAL '1 hour';

-- Kill idle connections
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE state = 'idle'
AND query_start < NOW() - INTERVAL '1 hour';
```

---

## 6. Troubleshooting

### Connection Issues

```bash
# Test basic connectivity
psql -h <rds-endpoint> -U postgres -d carib_remit -c "SELECT 1;"

# Check security group
aws ec2 describe-security-groups \
  --group-ids sg-xxxxx \
  --region us-east-1

# Check RDS endpoint status
aws rds describe-db-instances \
  --db-instance-identifier carib-remit-prod \
  --query 'DBInstances[0].DBInstanceStatus'
  --region us-east-1

# Check database parameter group
aws rds describe-db-parameters \
  --db-instance-identifier carib-remit-prod \
  --query 'Parameters[?ParameterName==`max_connections`]'
```

### High Memory Usage

```sql
-- Check cache size
SHOW shared_buffers;

-- Check active queries
SELECT query, backend_start, query_start
FROM pg_stat_activity
WHERE state != 'idle'
ORDER BY query_start;

-- Restart database (if necessary)
-- Note: This disconnects all clients
```

### Replication Lag

```bash
# Check replica lag
aws cloudwatch get-metric-statistics \
  --namespace AWS/RDS \
  --metric-name ReplicaLag \
  --dimensions Name=DBInstanceIdentifier,Value=carib-remit-prod-replica \
  --start-time $(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 300 \
  --statistics Average,Maximum

# Check write operations on primary
aws cloudwatch get-metric-statistics \
  --namespace AWS/RDS \
  --metric-name WriteIOPS \
  --dimensions Name=DBInstanceIdentifier,Value=carib-remit-prod \
  --start-time $(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 60 \
  --statistics Average
```

### Disk Space Issues

```bash
# Check free space
aws rds describe-db-instances \
  --db-instance-identifier carib-remit-prod \
  --query 'DBInstances[0].AllocatedStorage'

# Monitor free space
aws cloudwatch get-metric-statistics \
  --namespace AWS/RDS \
  --metric-name FreeStorageSpace \
  --dimensions Name=DBInstanceIdentifier,Value=carib-remit-prod \
  --start-time $(date -u -d '7 days ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 3600 \
  --statistics Average,Minimum

# Increase allocated storage
aws rds modify-db-instance \
  --db-instance-identifier carib-remit-prod \
  --allocated-storage 200 \
  --apply-immediately \
  --region us-east-1

# Enable autoscaling
aws rds modify-db-instance \
  --db-instance-identifier carib-remit-prod \
  --storage-type gp3 \
  --max-allocated-storage 1000 \
  --apply-immediately \
  --region us-east-1
```

---

## Emergency Contact

- **Database Admin**: [contact info]
- **DevOps Team**: [contact info]
- **On-Call**: Check PagerDuty
- **AWS Support**: https://console.aws.amazon.com/support/

---

**Remember: Always test recovery procedures in non-production first!**
