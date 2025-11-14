# � CODE DEPLOYMENT REQUIRED - Migration 004

## Current Situation

The migration files are in GitHub but **NOT YET** on your servers.  
You need to deploy the code first, then run the migration.

**Status:**
- ✅ Migration code created (004_add_states_support.sql)
- ✅ Code committed to GitHub
- ❌ **NOT deployed to servers yet**
- ❌ **Migration not run yet**

---

## ✅ HOW TO DEPLOY (Choose Your Method)

### Method 1: Using AWS Console (Easiest - Recommended)

1. **Go to AWS EC2 Console**
   - https://console.aws.amazon.com/ec2/

2. **Connect to Backend Server (43.204.230.163)**
   - Find instance with IP 43.204.230.163
   - Click "Connect" button
   - Choose "Session Manager" or "EC2 Instance Connect"
   - Click "Connect"

3. **Run these commands in the browser terminal:**
   ```bash
   cd ~/opinion-poll
   git pull origin main
   cd backend && npm install --production && cd ..
   ```

4. **Repeat for Load Balancer (65.2.142.131)**
   - Same steps as above

---

### Method 2: If You Know Your SSH Key

```bash
# Replace 'your-key.pem' with the correct PEM file
ssh -i ~/Downloads/your-key.pem ubuntu@43.204.230.163 \
  "cd ~/opinion-poll && git pull origin main && cd backend && npm install --production"

ssh -i ~/Downloads/your-key.pem ec2-user@65.2.142.131 \
  "cd ~/opinion-poll && git pull origin main && cd backend && npm install --production"
```

---

## 🚀 AFTER CODE IS DEPLOYED - RUN MIGRATION

Once the code is on the server (after git pull above), run the migration:

```bash
# Still connected to the server terminal
cd ~/opinion-poll

# Run migration with database credentials
DB_HOST='15.206.160.149' \
DB_USER='admin' \
DB_PASSWORD='OpinionPoll@2024' \
DB_NAME='opinion_poll' \
node backend/scripts/run-migration-004.js
```

**Expected output:**
```
🚀 Starting Migration: Add Multi-State Support
✓ Creating States table...
✓ Seeding Bihar, Maharashtra, Jharkhand...
✓ Adding state_id columns...
✓ Backfilling data...
✅ MIGRATION COMPLETED SUCCESSFULLY
```

---

## 📋 COMPLETE COPY-PASTE COMMANDS

**All commands in one block (for AWS Console terminal):**

```bash
# Step 1: Navigate and pull code
cd ~/opinion-poll && git pull origin main

# Step 2: Install dependencies  
cd backend && npm install --production && cd ..

# Step 3: Verify migration files exist
ls -lh backend/migrations/004_add_states_support.sql
ls -lh backend/scripts/run-migration-004.js

# Step 4: Run migration
DB_HOST='15.206.160.149' \
DB_USER='admin' \
DB_PASSWORD='OpinionPoll@2024' \
DB_NAME='opinion_poll' \
node backend/scripts/run-migration-004.js

# Step 5: Verify States table created
mysql -h 15.206.160.149 -u admin -p'OpinionPoll@2024' opinion_poll \
  -e "SELECT * FROM States;"
```

**Expected final output: 3 rows (Bihar, Maharashtra, Jharkhand)**

---

## ✅ SUCCESS CHECKLIST

- [ ] `git pull` showed files updated
- [ ] Migration files exist on server  
- [ ] Migration script ran without errors
- [ ] States table shows 3 rows
- [ ] Website still works (https://opinionpoll.co.in/vote)

---

## 🌐 TEST YOUR SITE

After migration, these URLs should all work:

- ✅ https://opinionpoll.co.in/
- ✅ https://opinionpoll.co.in/vote
- ✅ https://opinionpoll.co.in/results
- ✅ https://opinionpoll.co.in/blog/bihar-mein-kitne-jile-hain-2025

---

## 📞 REPORT BACK

**After deploying, tell me:**

✅ "Migration successful! Saw the success message."  
❌ "Got error: [paste error message]"

Then I'll mark Day 1-2 complete and start Day 3-4!

---

**TLDR:**

1. AWS Console → Connect to server (43.204.230.163)
2. Run: `cd ~/opinion-poll && git pull origin main`
3. Run migration command (copy from above)
4. Tell me it worked!

🚀


Tell me which one you can do:
- [ ] SSH to production server
- [ ] phpMyAdmin or MySQL Workbench
- [ ] Admin panel login
- [ ] None (need help setting up access)

I'll help you with step-by-step commands based on what you have!

---

## Expected Result

After deployment, these URLs should work:
1. https://opinionpoll.co.in/blog/bihar-mein-kitne-jile-hain-2025
2. https://opinionpoll.co.in/blog/bihar-vidhan-sabha-mein-kitni-seat-hai-2025
3. https://opinionpoll.co.in/blog/bihar-ke-mukhyamantri-kaun-hain-2025

Currently all return: **404 - ब्लॉग पोस्ट नहीं मिला**
