# Blog Deployment Guide

## Issue Identified
The MySQL database (15.206.160.149:3306) is not accessible from external IPs due to AWS Security Group restrictions. Direct database connections from local machine are blocked.

## Solution: Three Deployment Methods

---

## Method 1: Manual Insertion via Production Server (RECOMMENDED)

### Step 1: Upload Blog Data Files to Server
```bash
# Upload blog JSON files to production server
scp backend/data/blog-01-bihar-38-districts.json ubuntu@13.201.23.127:/home/ubuntu/bihar-opinion-poll/backend/data/
scp backend/data/blog-02-243-seats.json ubuntu@13.201.23.127:/home/ubuntu/bihar-opinion-poll/backend/data/
```

### Step 2: Upload Insertion Scripts
```bash
# Upload the insertion scripts
scp backend/scripts/insert-blog-01-districts.js ubuntu@13.201.23.127:/home/ubuntu/bihar-opinion-poll/backend/scripts/
scp backend/scripts/insert-blog-02-seats.js ubuntu@13.201.23.127:/home/ubuntu/bihar-opinion-poll/backend/scripts/
```

### Step 3: SSH into Server and Run Scripts
```bash
# Connect to server
ssh ubuntu@13.201.23.127

# Navigate to scripts directory
cd /home/ubuntu/bihar-opinion-poll/backend/scripts

# Run Blog #1 insertion
node insert-blog-01-districts.js

# Run Blog #2 insertion
node insert-blog-02-seats.js

# Verify blogs inserted
mysql -u opinion_poll_user -p'BiharPoll2025Secure' bihar_opinion_poll -e "SELECT post_id, title, slug, status FROM Blog_Posts ORDER BY post_id DESC LIMIT 2;"
```

### Step 4: Verify on Website
```bash
# Check Blog #1
curl -s https://opinionpoll.co.in/blog/bihar-mein-kitne-jile-hain-2025 | grep -i "<title>"

# Check Blog #2
curl -s https://opinionpoll.co.in/blog/bihar-vidhan-sabha-mein-kitni-seat-hai-2025 | grep -i "<title>"
```

---

## Method 2: Use Admin Panel (IF AVAILABLE)

### Step 1: Login to Admin Panel
```
URL: https://opinionpoll.co.in/admin/login
Username: [admin username]
Password: [admin password]
```

### Step 2: Navigate to Blog Section
```
Go to: Admin Dashboard → Blogs → Create New Blog
```

### Step 3: Copy-Paste Content
1. Open `backend/data/blog-01-bihar-38-districts.json`
2. Copy each field:
   - Title → title field
   - Slug → slug field
   - Excerpt → excerpt field
   - Content → content editor
   - Meta fields → SEO section
3. Click "Publish"
4. Repeat for Blog #2

---

## Method 3: MySQL Tunnel Connection (ADVANCED)

### Step 1: Create SSH Tunnel
```bash
# Create SSH tunnel to MySQL through bastion server
ssh -L 3307:localhost:3306 ubuntu@13.201.23.127
```

### Step 2: Update Scripts to Use Tunnel
Edit `insert-blog-01-districts.js` and `insert-blog-02-seats.js`:

```javascript
connection = await mysql.createConnection({
  host: 'localhost',  // Use localhost with tunnel
  port: 3307,         // Tunneled port
  user: 'opinion_poll_user',
  password: 'BiharPoll2025Secure',
  database: 'bihar_opinion_poll'
});
```

### Step 3: Run Scripts Locally
```bash
# In another terminal, run scripts
cd backend/scripts
node insert-blog-01-districts.js
node insert-blog-02-seats.js
```

---

## Method 4: Direct Database Access (Requires Security Group Update)

### Step 1: Update AWS Security Group
```bash
# Add your IP to MySQL security group (port 3306)
# Login to AWS Console → EC2 → Security Groups
# Find MySQL security group
# Add inbound rule:
#   Type: MySQL/Aurora
#   Protocol: TCP
#   Port: 3306
#   Source: [Your Public IP]/32
```

### Step 2: Run Scripts Directly
```bash
cd backend/scripts
node insert-blog-01-districts.js
node insert-blog-02-seats.js
```

---

## Quick Command Reference

### Check if MySQL is accessible
```bash
nc -zv 15.206.160.149 3306
# If connection refused = security group blocks it
# If connection times out = firewall/network issue
```

### Check current blogs in database (from server)
```bash
ssh ubuntu@13.201.23.127 "mysql -u opinion_poll_user -p'BiharPoll2025Secure' bihar_opinion_poll -e 'SELECT post_id, title, slug, published_at FROM Blog_Posts ORDER BY post_id DESC LIMIT 5;'"
```

### Verify blog URLs are working
```bash
curl -I https://opinionpoll.co.in/blog/bihar-mein-kitne-jile-hain-2025
# Should return: HTTP/1.1 200 OK

curl -I https://opinionpoll.co.in/blog/bihar-vidhan-sabha-mein-kitni-seat-hai-2025
# Should return: HTTP/1.1 200 OK
```

---

## Files Ready for Deployment

### Blog #1: बिहार में कितने जिले हैं?
- **JSON File**: `backend/data/blog-01-bihar-38-districts.json`
- **Insertion Script**: `backend/scripts/insert-blog-01-districts.js`
- **Target URL**: https://opinionpoll.co.in/blog/bihar-mein-kitne-jile-hain-2025
- **Publish Date**: November 1, 2025 at 10:00 AM IST
- **Word Count**: 3,500+
- **SEO Target**: "bihar mein kitne jile hain" (8,100 searches/month)

### Blog #2: बिहार विधान सभा में कितनी सीट है?
- **JSON File**: `backend/data/blog-02-243-seats.json`
- **Insertion Script**: `backend/scripts/insert-blog-02-seats.js`
- **Target URL**: https://opinionpoll.co.in/blog/bihar-vidhan-sabha-mein-kitni-seat-hai-2025
- **Publish Date**: November 3, 2025 at 10:00 AM IST
- **Word Count**: 4,000+
- **SEO Target**: "bihar vidhan sabha mein kitni seat hai" (6,600 searches/month)

---

## Troubleshooting

### Error: "Access denied for user"
**Cause**: Wrong database credentials  
**Fix**: Verify credentials in script match database user

### Error: "connect ETIMEDOUT"
**Cause**: AWS Security Group blocks external MySQL connections  
**Fix**: Use Method 1 (run scripts on production server) or Method 3 (SSH tunnel)

### Error: "Duplicate entry for key 'slug'"
**Cause**: Blog with same slug already exists  
**Fix**: Check if blog already inserted, or change slug in JSON file

### Error: "Cannot find module 'mysql2'"
**Cause**: npm dependencies not installed  
**Fix**: Run `npm install` in backend directory

---

## Post-Deployment Checklist

- [ ] Blog #1 inserted into database
- [ ] Blog #2 inserted into database
- [ ] URLs return HTTP 200 (not 404)
- [ ] Blog titles display correctly (Hindi text renders)
- [ ] Featured images load
- [ ] Related blogs section works
- [ ] Meta tags present (check with: `curl -s URL | grep -i "meta"`)
- [ ] Schema markup present (check with: `curl -s URL | grep -i "application/ld+json"`)
- [ ] Mobile responsive (test on phone or DevTools)
- [ ] Page load speed <3 seconds

---

## Next Steps After Deployment

### 1. Submit to Google Search Console
```bash
# Use Google Search Console → URL Inspection → Request Indexing
https://search.google.com/search-console

# Submit both URLs:
- https://opinionpoll.co.in/blog/bihar-mein-kitne-jile-hain-2025
- https://opinionpoll.co.in/blog/bihar-vidhan-sabha-mein-kitni-seat-hai-2025
```

### 2. Share on Social Media
- WhatsApp groups (Bihar politics, elections)
- Facebook pages
- Twitter/X with hashtags: #BiharElections #Bihar2025
- LinkedIn articles

### 3. Monitor SEO Performance
```bash
# Track in Google Search Console:
- Impressions (target: 500+ in week 1)
- Clicks (target: 50+ in week 1)
- Average position (target: <20 in week 1, <10 in week 2)
- CTR (target: 8-10%)
```

### 4. Create Visual Assets
- Featured images (1200x630px)
- Charts and graphs
- Social media cards (1080x1080px)
- See: `BLOG_VISUAL_ASSETS_GUIDE.md`

---

**Document Created**: October 30, 2025  
**Last Updated**: October 30, 2025  
**Status**: ✅ Ready for deployment - Use Method 1 (SSH to server)
