# 🚀 MANUAL DEPLOYMENT INSTRUCTIONS FOR MIGRATION 004

## Issue Found
The automated deployment failed because the migration script couldn't connect to the database. The `.env` file on the server needs to have the correct database configuration.

## ✅ SOLUTION: Run Migration Manually on Server

### Step-by-Step Commands (Copy-Paste Ready)

**Open your terminal and run these commands:**

```bash
# 1. SSH to Backend Server
ssh ubuntu@43.204.230.163

# 2. Navigate to project
cd ~/opinion-poll

# 3. Pull latest code (includes migration files)
git pull origin main

# 4. Run the migration with environment variables
DB_HOST="15.206.160.149" \
DB_USER="admin" \
DB_PASSWORD="OpinionPoll@2024" \
DB_NAME="opinion_poll" \
node backend/scripts/run-migration-004.js
```

**Expected Output:**
```
🚀 Starting Migration: Add Multi-State Support

📋 Found 27 SQL statements to execute

✓ Transaction started

Creating States table...
✓ Table created

Seeding initial states...
✓ Bihar (id=1, active)
✓ Maharashtra (id=2, inactive)
✓ Jharkhand (id=3, inactive)

Adding state_id columns...
✓ Candidates.state_id
✓ Constituencies.state_id
✓ Districts.state_id
✓ Votes.state_id
✓ Blog_Posts.state_id

... (continues) ...

✅ MIGRATION COMPLETED SUCCESSFULLY
```

---

## 📋 Verification After Migration

**Still on the server, run these commands to verify:**

```bash
# Verify States table
mysql -h 15.206.160.149 -u admin -p'OpinionPoll@2024' opinion_poll \
  -e "SELECT * FROM States;"

# Expected output:
# +----+-------------+-------------+--------+------------+------------+--------+
# | id | name        | slug        | capital| population | total_seats| active |
# +----+-------------+-------------+--------+------------+------------+--------+
# |  1 | Bihar       | bihar       | Patna  | 104099452  |        243 |      1 |
# |  2 | Maharashtra | maharashtra | Mumbai | 112374333  |        288 |      0 |
# |  3 | Jharkhand   | jharkhand   | Ranchi |  32988134  |         81 |      0 |
# +----+-------------+-------------+--------+------------+------------+--------+

# Verify state_id columns
mysql -h 15.206.160.149 -u admin -p'OpinionPoll@2024' opinion_poll \
  -e "SHOW COLUMNS FROM Blog_Posts LIKE 'state_id';"

# Verify data backfilled
mysql -h 15.206.160.149 -u admin -p'OpinionPoll@2024' opinion_poll \
  -e "SELECT state_id, COUNT(*) as count FROM Votes GROUP BY state_id;"

# Expected: All votes have state_id=1 (Bihar)
```

---

## 🌐 Test Bihar Pages Still Work

**Open these URLs in your browser:**

- ✅ https://opinionpoll.co.in/
- ✅ https://opinionpoll.co.in/vote
- ✅ https://opinionpoll.co.in/results
- ✅ https://opinionpoll.co.in/blog/bihar-mein-kitne-jile-hain-2025

**All should work exactly as before!**

---

## 🔧 Fix .env File (Recommended for Future)

**While on the server, update the `.env` file:**

```bash
# Edit backend .env
cd ~/opinion-poll/backend
nano .env

# Add/update these lines:
DB_HOST=15.206.160.149
DB_USER=admin
DB_PASSWORD=OpinionPoll@2024
DB_NAME=opinion_poll
DB_PORT=3306

# Save and exit (Ctrl+X, Y, Enter)
```

**Then restart PM2:**
```bash
pm2 restart all
```

---

## 🎯 After Migration Succeeds

**Tell me: "Migration completed successfully!"**

**I will:**
1. ✅ Mark Day 1-2 complete in todo list
2. 🚀 Start Day 3-4: URL restructure and redirects
3. 📝 Help you set up `/bihar/` URLs with 301 redirects

---

## 🔴 If Migration Fails

**Rollback (if needed):**

```bash
# Find your backup file
ls -lh ~/backup-migration-004-*.sql

# Restore from backup
mysql -h 15.206.160.149 \
  -u admin \
  -p'OpinionPoll@2024' \
  opinion_poll < ~/backup-migration-004-[timestamp].sql

# Then tell me the error message you saw
```

---

## 📊 Current Status

| Task | Status | Notes |
|------|--------|-------|
| Code on servers | ✅ Updated | Both servers have migration files |
| Database config | ⚠️ Manual | Need to set env vars when running |
| **Migration run** | ⏳ **Waiting** | **You need to run it manually** |
| Verification | ⏳ Pending | After migration completes |

---

## 🎯 Quick Commands Summary

```bash
# Complete migration in 3 commands:

ssh ubuntu@43.204.230.163

cd ~/opinion-poll && git pull

DB_HOST="15.206.160.149" DB_USER="admin" DB_PASSWORD="OpinionPoll@2024" DB_NAME="opinion_poll" node backend/scripts/run-migration-004.js
```

**That's it! 30 seconds to run.** 🚀

---

**Next:** After you run this and confirm success, I'll proceed with Day 3-4 tasks.
