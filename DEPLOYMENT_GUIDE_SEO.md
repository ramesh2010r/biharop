# Deployment Guide - SEO Optimized Version

## Quick Deployment to AWS EC2

### Step 1: Connect to Server
```bash
ssh -i ooop.pem ec2-user@15.206.160.149
```

### Step 2: Navigate to Project
```bash
cd ~/opinion-poll
```

### Step 3: Pull Latest Changes
```bash
git pull origin main
```

### Step 4: Install Dependencies (if package.json changed)
```bash
npm install
```

### Step 5: Build Production Version
```bash
npm run build
```

### Step 6: Restart PM2 Process
```bash
pm2 restart bihar-frontend
# Or restart both frontend and backend
pm2 restart all
```

### Step 7: Verify Deployment
```bash
pm2 status
pm2 logs bihar-frontend --lines 50
```

### Step 8: Check Website
Visit: https://opinionpoll.co.in

---

## What's New in This Deployment

### ✅ 4 New Pages for AdSense
1. `/privacy-policy` - Comprehensive privacy policy
2. `/terms-of-service` - Legal terms and conditions
3. `/about` - About us and mission
4. `/contact` - Contact information and FAQ

### ✅ SEO Enhancements
- Structured data (JSON-LD) for rich snippets
- Enhanced metadata with keywords
- Updated sitemap with 16 routes
- Bilingual content (Hindi + English)

### ✅ Performance Improvements
- Font optimization (display: swap)
- Image optimization (WebP, AVIF)
- Browser caching (1 year for static assets)
- Compression enabled
- Security headers added

### ✅ Content Additions
- 1000+ words on homepage
- FAQ section with accordions
- "Why Participate" section
- "About Bihar Elections 2025" section
- Enhanced welcome message

---

## Verification Checklist

After deployment, verify:

- [ ] Homepage loads correctly (/)
- [ ] All 4 new pages accessible:
  - [ ] /privacy-policy
  - [ ] /terms-of-service
  - [ ] /about
  - [ ] /contact
- [ ] Footer links work
- [ ] Structured data visible in page source (search for "application/ld+json")
- [ ] Sitemap accessible (/sitemap.xml)
- [ ] robots.txt accessible (/robots.txt)
- [ ] Vote and Results pages still functional
- [ ] Admin dashboard accessible

---

## Testing Commands

### Test Homepage
```bash
curl https://opinionpoll.co.in/
```

### Test New Pages
```bash
curl https://opinionpoll.co.in/privacy-policy
curl https://opinionpoll.co.in/terms-of-service
curl https://opinionpoll.co.in/about
curl https://opinionpoll.co.in/contact
```

### Test Sitemap
```bash
curl https://opinionpoll.co.in/sitemap.xml
```

### Check Structured Data
```bash
curl https://opinionpoll.co.in/ | grep "application/ld+json"
```

---

## Rollback (If Needed)

If something goes wrong:

```bash
# Revert to previous commit
git log --oneline  # Find previous commit hash
git reset --hard <previous-commit-hash>

# Rebuild
npm run build

# Restart
pm2 restart bihar-frontend
```

---

## Post-Deployment Tasks

### 1. Submit to Google Search Console
```
1. Go to: https://search.google.com/search-console
2. Add property: opinionpoll.co.in
3. Submit sitemap: https://opinionpoll.co.in/sitemap.xml
4. Request indexing for new pages
```

### 2. Verify Structured Data
```
1. Go to: https://search.google.com/test/rich-results
2. Test URL: https://opinionpoll.co.in
3. Check for Organization, WebSite, and FAQPage schemas
```

### 3. Apply for Google AdSense
```
1. Go to: https://www.google.com/adsense
2. Sign up or sign in
3. Add website: opinionpoll.co.in
4. Add AdSense code to <head> section
5. Wait for review (typically 1-2 weeks)
```

### 4. Monitor Performance
```bash
# Check PM2 logs
pm2 logs bihar-frontend

# Check server resources
htop

# Check disk space
df -h
```

---

## Environment Variables

Make sure these are set on the server:

```bash
# Frontend (Next.js)
NEXT_PUBLIC_API_URL=http://localhost:5001
NODE_ENV=production

# Backend (Express)
PORT=5001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=<your_password>
DB_NAME=bihar_election
```

---

## Troubleshooting

### Issue: Pages not loading
```bash
# Check if Next.js is running
pm2 status bihar-frontend

# Restart
pm2 restart bihar-frontend

# Check logs
pm2 logs bihar-frontend --lines 100
```

### Issue: Build fails
```bash
# Clear cache
rm -rf .next
npm run build

# If dependency issue
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Issue: Port already in use
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Restart PM2
pm2 restart bihar-frontend
```

---

## Performance Monitoring

### Check Page Speed
```
1. Go to: https://pagespeed.web.dev/
2. Test: https://opinionpoll.co.in
3. Check Core Web Vitals scores
```

### Monitor with PM2
```bash
pm2 monit
```

---

## Security Checklist

- [x] HTTPS enabled
- [x] Security headers configured
- [x] X-Powered-By removed
- [x] robots.txt configured
- [x] Admin routes protected
- [x] API routes secured
- [ ] SSL certificate valid (verify)
- [ ] Firewall rules configured

---

## Backup Before Deployment

```bash
# Backup current build
cp -r .next .next.backup

# Backup node_modules (optional)
tar -czf node_modules.backup.tar.gz node_modules

# Backup database
mysqldump -u root -p bihar_election > backup_$(date +%Y%m%d).sql
```

---

## Contact for Issues

- **Technical Support**: support@opinionpoll.co.in
- **Emergency**: Check PM2 logs and GitHub issues

---

## Success Metrics

After deployment, monitor:
- Google Search Console impressions
- Core Web Vitals scores
- AdSense approval status
- Page load times
- User engagement metrics

---

## Next Steps After Deployment

1. ✅ Submit sitemap to Google Search Console
2. ✅ Verify structured data with Rich Results Test
3. ✅ Apply for Google AdSense
4. ✅ Monitor Core Web Vitals
5. ✅ Set up Google Analytics (if not already done)
6. ⏳ Wait for AdSense review (1-2 weeks)
7. ⏳ Monitor search rankings
8. ⏳ Collect user feedback

---

*Deployment Guide Version: 2.0*
*Last Updated: January 2025*
*Prepared for: SEO & AdSense Optimized Version*
