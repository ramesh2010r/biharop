# Migration 004: Add Multi-State Support - Deployment Guide

**Migration File:** `backend/migrations/004_add_states_support.sql`  
**Runner Script:** `backend/scripts/run-migration-004.js`  
**Deploy Script:** `deploy-migration-004.sh`  
**Created:** November 12, 2025  
**Status:** Ready to deploy

---

## 🎯 What This Migration Does

### Database Changes:
1. **Creates `States` table** - Master table for all Indian states/UTs
2. **Seeds 3 initial states:**
   - Bihar (id=1, active=true) - Current production state
   - Maharashtra (id=2, active=false) - Launching Dec 1
   - Jharkhand (id=3, active=false) - Launching Dec 15

3. **Adds `state_id` column to 5 tables:**
   - `Candidates` - Which state the candidate belongs to
   - `Constituencies` - Which state the constituency is in
   - `Districts` - Which state the district is in
   - `Votes` - Which state the vote was cast in
   - `Blog_Posts` - Which state the blog is about

4. **Backfills existing data:**
   - All existing rows get `state_id = 1` (Bihar)
   - Preserves all current data

5. **Creates indexes:**
   - Speeds up queries filtering by state

### Zero Downtime:
- ✅ All Bihar content continues to work (state_id=1)
- ✅ No data loss or modification
- ✅ Backward compatible (defaults to Bihar)
- ✅ Reversible (rollback SQL included)

---

## 📋 Pre-Deployment Checklist

### Before You Start:
- [ ] Read this entire document
- [ ] Have database backup ready
- [ ] Tested on staging/local first (recommended)
- [ ] Have rollback plan ready
- [ ] Low-traffic time window selected (optional but recommended)

### Required Access:
- [ ] SSH access to production server (43.204.230.163)
- [ ] Database credentials configured in server's `.env`
- [ ] PM2 running on server

---

## 🚀 Deployment Instructions

### Option A: Automated Deployment (Recommended)

**From your local machine:**

```bash
# 1. Commit and push latest code
cd /Users/rameshkumar/Document/App/Opinion\ Pole
git add backend/migrations/004_add_states_support.sql
git add backend/scripts/run-migration-004.js
git add deploy-migration-004.sh
git add backend/API_ROUTE_UPDATES.md
git add MIGRATION_004_DEPLOYMENT_GUIDE.md
git commit -m "Add migration 004: Multi-state database support"
git push origin main

# 2. Upload deployment script to server
scp deploy-migration-004.sh ubuntu@43.204.230.163:~/

# 3. SSH to server
ssh ubuntu@43.204.230.163

# 4. Run deployment script
chmod +x deploy-migration-004.sh
./deploy-migration-004.sh
```

The script will:
- Pull latest code from GitHub
- Check migration files exist
- Prompt for backup confirmation
- Run the migration
- Verify all changes
- Show success/failure status

---

### Option B: Manual Deployment

**SSH to production server:**

```bash
ssh ubuntu@43.204.230.163
cd ~/opinion-poll
```

**Pull latest code:**

```bash
git pull origin main
```

**Backup database (CRITICAL):**

```bash
# Create backup with timestamp
mysqldump -h 15.206.160.149 \
  -u admin \
  -p \
  opinion_poll > backup-before-migration-004-$(date +%Y%m%d-%H%M%S).sql

# Verify backup created
ls -lh backup-*.sql
```

**Run migration script:**

```bash
cd ~/opinion-poll
node backend/scripts/run-migration-004.js
```

**Expected output:**

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

Backfilling existing data...
✓ 243 Candidates updated (state_id=1)
✓ 243 Constituencies updated (state_id=1)
✓ 38 Districts updated (state_id=1)
✓ 50,234 Votes updated (state_id=1)
✓ 3 Blog_Posts updated (state_id=1)

Creating indexes...
✓ idx_candidates_state
✓ idx_constituencies_state
✓ idx_districts_state
✓ idx_votes_state
✓ idx_blogposts_state

✓ Transaction committed

====================================================================
✅ MIGRATION COMPLETED SUCCESSFULLY
====================================================================
```

---

## ✅ Post-Deployment Verification

### 1. Check Database Changes

**SSH to server and connect to database:**

```bash
mysql -h 15.206.160.149 -u admin -p opinion_poll
```

**Verify States table:**

```sql
SELECT * FROM States ORDER BY id;
```

Expected output:
```
+----+-------------+-------------+--------+------------+------------+--------+
| id | name        | slug        | capital| population | total_seats| active |
+----+-------------+-------------+--------+------------+------------+--------+
|  1 | Bihar       | bihar       | Patna  | 104099452  |        243 |      1 |
|  2 | Maharashtra | maharashtra | Mumbai | 112374333  |        288 |      0 |
|  3 | Jharkhand   | jharkhand   | Ranchi |  32988134  |         81 |      0 |
+----+-------------+-------------+--------+------------+------------+--------+
```

**Verify state_id columns exist:**

```sql
SHOW COLUMNS FROM Candidates LIKE 'state_id';
SHOW COLUMNS FROM Constituencies LIKE 'state_id';
SHOW COLUMNS FROM Districts LIKE 'state_id';
SHOW COLUMNS FROM Votes LIKE 'state_id';
SHOW COLUMNS FROM Blog_Posts LIKE 'state_id';
```

**Verify data backfilled correctly:**

```sql
-- All Bihar blogs should have state_id=1
SELECT id, title_hindi, state_id FROM Blog_Posts;

-- All votes should have state_id=1
SELECT state_id, COUNT(*) as count FROM Votes GROUP BY state_id;

-- All candidates should have state_id=1
SELECT state_id, COUNT(*) as count FROM Candidates GROUP BY state_id;
```

### 2. Test Bihar Pages Still Work

**Visit these URLs and verify they load correctly:**

- ✅ Homepage: https://opinionpoll.co.in/
- ✅ Vote page: https://opinionpoll.co.in/vote
- ✅ Results: https://opinionpoll.co.in/results
- ✅ Blog #1: https://opinionpoll.co.in/blog/bihar-mein-kitne-jile-hain-2025
- ✅ Blog #2: https://opinionpoll.co.in/blog/bihar-vidhan-sabha-mein-kitni-seat-hai-2025
- ✅ Blog #3: https://opinionpoll.co.in/blog/bihar-ke-mukhyamantri-kaun-hain-2025

**Test voting functionality:**
1. Go to /vote
2. Select a constituency
3. Cast a test vote
4. Verify vote appears in /results
5. Check database: `SELECT * FROM Votes ORDER BY created_at DESC LIMIT 5;`
   - Verify new vote has `state_id = 1`

### 3. Check Server Logs

```bash
# Check PM2 logs for errors
pm2 logs backend-server --lines 50

# Check for any SQL errors
pm2 logs | grep -i error
```

### 4. Monitor Analytics

- Check Google Analytics for traffic drop (should be none)
- Monitor error rates in server logs
- Check response times haven't increased

---

## 🔄 Rollback Procedure (If Needed)

**If migration fails or causes issues, rollback immediately:**

### Automated Rollback:

```bash
# SSH to server
ssh ubuntu@43.204.230.163
cd ~/opinion-poll

# Restore from backup
mysql -h 15.206.160.149 \
  -u admin \
  -p \
  opinion_poll < backup-before-migration-004-[timestamp].sql
```

### Manual Rollback (Alternative):

```sql
-- Connect to database
mysql -h 15.206.160.149 -u admin -p opinion_poll

-- Run rollback SQL
START TRANSACTION;

-- Remove state_id columns
ALTER TABLE Candidates DROP COLUMN IF EXISTS state_id;
ALTER TABLE Constituencies DROP COLUMN IF EXISTS state_id;
ALTER TABLE Districts DROP COLUMN IF EXISTS state_id;
ALTER TABLE Votes DROP COLUMN IF EXISTS state_id;
ALTER TABLE Blog_Posts DROP COLUMN IF EXISTS state_id;

-- Drop States table
DROP TABLE IF EXISTS States;

COMMIT;
```

**After rollback:**
1. Verify Bihar pages work again
2. Check error logs cleared
3. Document what went wrong
4. Fix issue before re-attempting

---

## 📊 Success Criteria

### Migration is successful if:
- ✅ `States` table exists with 3 rows
- ✅ All 5 tables have `state_id` column (default value 1)
- ✅ All existing data has `state_id = 1` (Bihar)
- ✅ Indexes created successfully
- ✅ Bihar voting page works
- ✅ Bihar results page works
- ✅ All 3 blogs load correctly
- ✅ No errors in PM2 logs
- ✅ No traffic drop in Google Analytics
- ✅ Database queries return expected results

---

## 🎯 Next Steps After Migration

### Immediate (Today):
1. ✅ Mark "Day 1-2: Database foundation" as complete in todo list
2. ✅ Document any issues encountered
3. ✅ Celebrate successful migration! 🎉

### Tomorrow (Day 3-4):
1. **URL Restructure & Redirects**
   - Update `next.config.js` with 301 redirects
   - Move Bihar pages to `/bihar/` directory
   - Create new generic homepage at `/`
   - Test all redirects work correctly

### This Week (Day 5-7):
1. **Create Generic Homepage**
   - India map with state selection
   - Active elections carousel
   - "How It Works" section
   - SEO optimization for "opinion poll india"

2. **Update API Routes** (See `backend/API_ROUTE_UPDATES.md`)
   - Add `state_id=1` filters to all queries
   - Ensures backward compatibility
   - Prepare for future multi-state support

---

## 📞 Troubleshooting

### Issue: Migration script hangs or times out
**Solution:** Database connection issue. Check:
- `.env` file has correct DB credentials
- Database server (15.206.160.149) is reachable
- No firewall blocking port 3306

### Issue: "Column 'state_id' already exists"
**Solution:** Migration was partially run before. Either:
1. Complete the migration manually (check which steps are missing)
2. Rollback fully and re-run from scratch

### Issue: Bihar pages show errors after migration
**Solution:** API routes may need state_id filtering. Check:
- Server logs: `pm2 logs backend-server`
- Database queries are using correct table names
- See `backend/API_ROUTE_UPDATES.md` for required changes

### Issue: Votes not being recorded
**Solution:** INSERT statement may be missing state_id:
```javascript
// In backend/routes/vote.js, add state_id=1:
const query = `
  INSERT INTO Votes 
  (constituency_id, candidate_id, state_id, fingerprint_hash, ...) 
  VALUES (?, ?, 1, ?, ...)
`;
```

---

## 📚 Related Documents

- **TRANSITION_TO_GENERIC_PLATFORM.md** - Overall strategy (30+ pages)
- **WEEK1_IMPLEMENTATION_CHECKLIST.md** - Day-by-day tasks
- **TRANSITION_SUMMARY.md** - Quick reference guide
- **backend/API_ROUTE_UPDATES.md** - API changes needed after migration
- **backend/migrations/004_add_states_support.sql** - The SQL migration itself

---

## ✅ Deployment Checklist

**Before deployment:**
- [ ] Read this guide completely
- [ ] Database backup created
- [ ] Low-traffic time selected (optional)
- [ ] SSH access verified
- [ ] Code committed to GitHub

**During deployment:**
- [ ] Pulled latest code on server
- [ ] Ran migration script
- [ ] No errors in script output
- [ ] Verified States table created
- [ ] Verified state_id columns added

**After deployment:**
- [ ] Tested Bihar voting
- [ ] Tested Bihar results
- [ ] Verified all 3 blogs load
- [ ] Checked PM2 logs (no errors)
- [ ] Monitored analytics (no drop)
- [ ] Updated todo list

**If issues:**
- [ ] Rolled back immediately
- [ ] Documented issue
- [ ] Fixed root cause
- [ ] Re-tested on staging

---

**Status:** 📝 Ready to deploy (waiting for server access)

**Next:** Run `./deploy-migration-004.sh` on production server
