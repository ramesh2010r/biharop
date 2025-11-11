# Week 1 Implementation Checklist - Generic Platform Transition

**Start Date:** November 12, 2025  
**Goal:** Launch new generic homepage while preserving Bihar SEO  
**Strategy:** Expand, Don't Replace  

---

## 🎯 Day 1: Database Foundation (Nov 12)

### Morning (2-3 hours)
- [ ] Create `States` table
  ```sql
  CREATE TABLE States (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    capital VARCHAR(100),
    population BIGINT,
    total_seats INT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  ```

- [ ] Add `state_id` to existing tables
  ```sql
  ALTER TABLE Candidates ADD COLUMN state_id INT DEFAULT 1;
  ALTER TABLE Constituencies ADD COLUMN state_id INT DEFAULT 1;
  ALTER TABLE Districts ADD COLUMN state_id INT DEFAULT 1;
  ALTER TABLE Votes ADD COLUMN state_id INT DEFAULT 1;
  ALTER TABLE Blog_Posts ADD COLUMN state_id INT DEFAULT 1;
  ```

- [ ] Seed initial states
  ```sql
  INSERT INTO States (id, name, slug, capital, population, total_seats, active) VALUES
  (1, 'Bihar', 'bihar', 'Patna', 104099452, 243, TRUE),
  (2, 'Maharashtra', 'maharashtra', 'Mumbai', 112374333, 288, FALSE),
  (3, 'Jharkhand', 'jharkhand', 'Ranchi', 32988134, 81, FALSE),
  (4, 'Delhi', 'delhi', 'New Delhi', 16787941, 70, FALSE);
  ```

### Afternoon (2-3 hours)
- [ ] Create migration script: `backend/migrations/004_add_states_support.sql`
- [ ] Test migration on local database
- [ ] Verify all existing Bihar data still works
- [ ] Create rollback script (just in case)

---

## 🎯 Day 2: URL Structure & Redirects (Nov 13)

### Morning (3-4 hours)
- [ ] Update `next.config.js` with redirects
  ```javascript
  async redirects() {
    return [
      {
        source: '/vote',
        destination: '/bihar/vote',
        permanent: true,
      },
      {
        source: '/results',
        destination: '/bihar/results',
        permanent: true,
      },
      {
        source: '/blog/bihar-:slug',
        destination: '/bihar/blog/:slug',
        permanent: true,
      },
    ];
  }
  ```

- [ ] Create new folder structure:
  ```
  src/app/
    page.tsx (NEW - generic homepage)
    states/
      page.tsx (NEW - state selection)
    [state]/
      page.tsx (NEW - dynamic state landing)
      vote/page.tsx
      results/page.tsx
      blog/
        page.tsx
        [slug]/page.tsx
  ```

- [ ] Move existing Bihar pages to `/bihar/` directory
- [ ] Update all internal links to use new paths

### Afternoon (2-3 hours)
- [ ] Test all old URLs redirect correctly
- [ ] Verify Bihar voting still works
- [ ] Check Bihar results page
- [ ] Test all Bihar blog URLs
- [ ] Monitor Search Console for errors

---

## 🎯 Day 3: Generic Homepage Design (Nov 14)

### Morning (4-5 hours)
- [ ] Design new generic homepage layout
  Components needed:
  - Hero section (India map background)
  - Active elections carousel
  - State selection grid
  - "How It Works" section
  - Latest polls aggregator
  - Blog feed (all states)
  - Footer with all states

- [ ] Create hero component
  ```tsx
  <Hero 
    title="India's Most Trusted Opinion Poll Platform"
    subtitle="Real-time election predictions for 28 states"
    cta="Select Your State →"
  />
  ```

- [ ] Create state selector grid
  ```tsx
  <StateGrid states={[
    { name: 'Bihar', active: true, votes: 50000 },
    { name: 'Maharashtra', active: false, comingSoon: 'Dec 2025' },
    { name: 'Jharkhand', active: false, comingSoon: 'Dec 2025' },
  ]} />
  ```

### Afternoon (3-4 hours)
- [ ] Implement responsive design (mobile-first)
- [ ] Add loading states
- [ ] Optimize images (India map, state icons)
- [ ] Test on different screen sizes
- [ ] Add meta tags for SEO

---

## 🎯 Day 4: State Selection Page (Nov 15)

### Morning (3-4 hours)
- [ ] Create `/states` page
- [ ] Build state cards component
  ```tsx
  <StateCard 
    name="Bihar"
    capital="Patna"
    seats={243}
    status="Live"
    votes={50000}
    href="/bihar"
  />
  ```

- [ ] Add search/filter functionality
- [ ] Group by region (North, South, East, West, Central)
- [ ] Add state statistics

### Afternoon (2-3 hours)
- [ ] Create state comparison tool (future feature)
- [ ] Add "Upcoming Elections" section
- [ ] Link to individual state pages
- [ ] Test navigation flow

---

## 🎯 Day 5: API Updates (Nov 16)

### Morning (3-4 hours)
- [ ] Update API routes to support multi-state:
  ```
  /api/states → GET all states
  /api/states/:slug → GET state details
  /api/states/:slug/constituencies → GET constituencies
  /api/states/:slug/candidates → GET candidates
  /api/states/:slug/results → GET results
  ```

- [ ] Modify existing routes:
  ```
  /api/vote → Add state_id parameter
  /api/results → Add state_id parameter
  /api/blog → Add state_id filter
  ```

- [ ] Create state management service:
  ```javascript
  // backend/services/stateService.js
  - getActiveStates()
  - getStateBySlug(slug)
  - getStateConstituencies(stateId)
  - getStateResults(stateId)
  ```

### Afternoon (2-3 hours)
- [ ] Update frontend API calls
- [ ] Add state context provider
- [ ] Test API with Bihar data
- [ ] Verify backward compatibility

---

## 🎯 Day 6: SEO Updates (Nov 17)

### Morning (2-3 hours)
- [ ] Update homepage metadata
  ```tsx
  export const metadata = {
    title: 'Opinion Poll India - Elections, Surveys & Predictions',
    description: 'India\'s leading opinion poll platform. Vote, view real-time results for Bihar, Maharashtra, Jharkhand elections.',
    keywords: 'opinion poll india, election poll, bihar election, maharashtra election',
  };
  ```

- [ ] Create dynamic sitemap
  ```xml
  <url>
    <loc>https://opinionpoll.co.in/bihar/</loc>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://opinionpoll.co.in/maharashtra/</loc>
    <priority>0.8</priority>
  </url>
  ```

- [ ] Update robots.txt
- [ ] Add structured data for multi-state

### Afternoon (2-3 hours)
- [ ] Submit new sitemap to Google Search Console
- [ ] Monitor for 404 errors
- [ ] Check redirect status codes
- [ ] Verify canonical URLs
- [ ] Test social media sharing

---

## 🎯 Day 7: Testing & Launch (Nov 18)

### Morning (3-4 hours)
- [ ] Full QA testing checklist:
  - [ ] Homepage loads correctly
  - [ ] State selection works
  - [ ] Bihar pages still accessible
  - [ ] All redirects working (301, not 302)
  - [ ] Voting functionality intact
  - [ ] Results page displays
  - [ ] Blog posts render
  - [ ] Mobile responsive
  - [ ] No console errors
  - [ ] Fast load times (<2 seconds)

- [ ] Performance testing:
  - [ ] Lighthouse score >90
  - [ ] Core Web Vitals pass
  - [ ] Images optimized
  - [ ] CSS/JS minified

### Afternoon (2-3 hours)
- [ ] Deploy to staging environment
- [ ] Final review with team
- [ ] Deploy to production
- [ ] Monitor for errors
- [ ] Check analytics
- [ ] Announce on social media

---

## 📊 Success Metrics (Track Daily)

### Week 1 Goals:
- [ ] Zero drop in Bihar traffic (maintain 65,000 visits/month)
- [ ] Homepage ranking for "opinion poll india" within top 50
- [ ] All old Bihar URLs redirect properly (100% success rate)
- [ ] No 404 errors in Search Console
- [ ] Page load time <2 seconds
- [ ] Mobile usability score 100%

### Monitor These:
- Google Analytics: Traffic sources, bounce rate
- Search Console: Indexing status, ranking keywords
- Server logs: 404 errors, slow queries
- Social media: Engagement, feedback
- User support: Questions, complaints

---

## 🔧 Tools & Scripts Needed

### Create These Files:

1. **Database Migration Script**
   - File: `backend/migrations/004_add_states_support.sql`
   - Contains: States table, ALTER TABLE statements

2. **State Seeding Script**
   - File: `backend/scripts/seed-states.js`
   - Loads initial state data

3. **Redirect Configuration**
   - File: `next.config.js` (update existing)
   - All Bihar redirects

4. **State Context Provider**
   - File: `src/context/StateContext.tsx`
   - Global state management

5. **State API Service**
   - File: `backend/services/stateService.js`
   - State CRUD operations

6. **Testing Script**
   - File: `scripts/test-redirects.sh`
   - Automated redirect testing

---

## ⚠️ Critical Reminders

### DO:
✅ Use 301 redirects (permanent, SEO-safe)  
✅ Keep all Bihar content live  
✅ Test thoroughly before deploying  
✅ Monitor analytics daily  
✅ Backup database before migration  
✅ Have rollback plan ready  

### DON'T:
❌ Delete any Bihar pages  
❌ Change Bihar URLs without redirects  
❌ Use 302 redirects (temporary, loses SEO)  
❌ Rush deployment without testing  
❌ Ignore Search Console warnings  
❌ Change too many things at once  

---

## 🆘 Rollback Plan (If Something Goes Wrong)

If traffic drops >20% or major errors:

1. **Immediate Actions:**
   - Revert to previous commit
   - Restore database backup
   - Remove redirects
   - Restore old homepage

2. **Investigation:**
   - Check Search Console errors
   - Review server logs
   - Analyze traffic drop
   - Identify root cause

3. **Fix & Retry:**
   - Fix identified issues
   - Test on staging
   - Deploy gradually
   - Monitor closely

---

## 📞 Quick Command Reference

```bash
# Database Migration
mysql -h DB_HOST -u USER -p DBNAME < backend/migrations/004_add_states_support.sql

# Seed States
node backend/scripts/seed-states.js

# Build Frontend
npm run build

# Test Redirects
./scripts/test-redirects.sh

# Deploy to Staging
git push staging main

# Deploy to Production
git push origin main
ssh ubuntu@43.204.230.163 "cd opinion-poll && git pull && npm run build && pm2 restart all"
ssh ec2-user@65.2.142.131 "cd opinion-poll && git pull && npm run build && pm2 restart all"

# Monitor Logs
pm2 logs backend-server
pm2 logs frontend-server

# Check Database
mysql -h DB_HOST -u USER -p -e "SELECT * FROM States;"
```

---

## 🎯 End of Week 1 Target

By November 18, 2025, you should have:

✅ New generic homepage live  
✅ `/states` selection page working  
✅ All Bihar content accessible at `/bihar/`  
✅ 301 redirects in place  
✅ Database supporting multi-state  
✅ APIs updated for state filtering  
✅ SEO preserved (no traffic drop)  
✅ Ready to add Maharashtra  

**Next Week:** Start Maharashtra data collection and blog writing!

---

## 💡 Pro Tips

1. **Work on staging first** - Never edit production directly
2. **Commit frequently** - Easy to rollback small changes
3. **Test redirects** - Use curl to verify 301 status codes
4. **Monitor hourly** - Catch issues early
5. **Communication** - Announce changes to users
6. **Document everything** - Future you will thank you

---

**Ready to start? Begin with Day 1 database setup!** 🚀

Let me know if you need any script templates or have questions!
