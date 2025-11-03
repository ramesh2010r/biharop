# Load Balancer Deployment Strategy for Blogs

## Architecture Understanding

With **load balancer**, you likely have:
```
                    [Load Balancer]
                          |
        +----------------+----------------+
        |                |                |
   [Backend 1]      [Backend 2]      [Backend 3]
        |                |                |
        +----------------+----------------+
                          |
                  [Shared MySQL DB]
```

## Why Blogs Aren't Showing (Load Balancer Issues)

### Issue 1: Code Not Deployed to All Instances
- GitHub code pulled on only ONE backend instance
- Other instances still have old code
- Load balancer routes requests randomly → inconsistent results

### Issue 2: Database Insert Needed (Once)
- Blog data must be inserted into shared MySQL database
- Only needs to run ONCE (not on each instance)

### Issue 3: Static Assets Not Synced
- Featured images, if any, need to be on all instances
- OR better: use S3/CloudFront for images

### Issue 4: Cache/CDN Not Cleared
- Load balancer or CDN may be caching 404 responses
- Need to invalidate cache after deployment

---

## Proper Deployment Steps for Load Balancer Setup

### Step 1: Deploy Code to ALL Backend Instances

You need to deploy to each backend server behind the load balancer:

```bash
# Deploy to Backend Instance 1
ssh ubuntu@BACKEND_1_IP << 'EOF'
cd /home/ubuntu/bihar-opinion-poll
git pull origin main
npm install
pm2 restart all
EOF

# Deploy to Backend Instance 2
ssh ubuntu@BACKEND_2_IP << 'EOF'
cd /home/ubuntu/bihar-opinion-poll
git pull origin main
npm install
pm2 restart all
EOF

# Deploy to Backend Instance 3 (if exists)
ssh ubuntu@BACKEND_3_IP << 'EOF'
cd /home/ubuntu/bihar-opinion-poll
git pull origin main
npm install
pm2 restart all
EOF
```

### Step 2: Insert Blogs into Shared Database (ONCE)

**Important**: Only run this ONCE on ANY ONE backend instance:

```bash
# SSH to any one backend instance
ssh ubuntu@BACKEND_1_IP

# Navigate to scripts
cd /home/ubuntu/bihar-opinion-poll/backend/scripts

# Insert blogs (run once!)
node insert-blog-01-districts.js
node insert-blog-02-seats.js
node insert-blog-03-cm.js

# Verify
mysql -u opinion_poll_user -p'BiharPoll2025Secure' bihar_opinion_poll \
  -e "SELECT post_id, slug, status FROM Blog_Posts ORDER BY post_id DESC LIMIT 3;"
```

### Step 3: Clear Load Balancer Cache

Depending on your setup:

**AWS ALB (Application Load Balancer)**:
```bash
# No cache to clear - ALB doesn't cache
# But if using CloudFront in front:
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/blog/*"
```

**NGINX Load Balancer with Cache**:
```bash
# SSH to load balancer
ssh ubuntu@LOAD_BALANCER_IP

# Clear nginx cache
sudo rm -rf /var/cache/nginx/*
sudo systemctl reload nginx
```

**Cloudflare**:
```bash
# Purge cache via Cloudflare dashboard:
# Dashboard → Caching → Purge Everything
# OR purge specific URLs:
# /blog/bihar-mein-kitne-jile-hain-2025
# /blog/bihar-vidhan-sabha-mein-kitni-seat-hai-2025
# /blog/bihar-ke-mukhyamantri-kaun-hain-2025
```

### Step 4: Verify on Each Backend Instance

Test each backend directly (bypass load balancer):

```bash
# Test Backend 1 directly
curl -H "Host: opinionpoll.co.in" http://BACKEND_1_IP/blog/bihar-mein-kitne-jile-hain-2025 | grep -i "38 जिले"

# Test Backend 2 directly
curl -H "Host: opinionpoll.co.in" http://BACKEND_2_IP/blog/bihar-mein-kitne-jile-hain-2025 | grep -i "38 जिले"

# All should return the blog content (not 404)
```

---

## Alternative: Deploy Using CI/CD (Recommended)

If you have GitHub Actions or similar:

Create `.github/workflows/deploy-blogs.yml`:

```yaml
name: Deploy Blogs to All Instances

on:
  push:
    branches: [ main ]
    paths:
      - 'backend/data/blog-*.json'
      - 'backend/scripts/insert-blog-*.js'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Backend 1
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.BACKEND_1_IP }}
          username: ubuntu
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /home/ubuntu/bihar-opinion-poll
            git pull origin main
            npm install
            pm2 restart all

      - name: Deploy to Backend 2
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.BACKEND_2_IP }}
          username: ubuntu
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /home/ubuntu/bihar-opinion-poll
            git pull origin main
            npm install
            pm2 restart all

      - name: Insert Blogs (Once)
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.BACKEND_1_IP }}
          username: ubuntu
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /home/ubuntu/bihar-opinion-poll/backend/scripts
            node insert-blog-01-districts.js || echo "Blog 1 already exists"
            node insert-blog-02-seats.js || echo "Blog 2 already exists"
            node insert-blog-03-cm.js || echo "Blog 3 already exists"
```

---

## Quick Deployment Script for Load Balancer

Create `deploy-to-load-balanced-servers.sh`:

```bash
#!/bin/bash

# Configuration - UPDATE THESE
BACKEND_INSTANCES=(
  "ubuntu@BACKEND_1_IP"
  "ubuntu@BACKEND_2_IP"
  "ubuntu@BACKEND_3_IP"  # Remove if you only have 2
)

PROJECT_DIR="/home/ubuntu/bihar-opinion-poll"

echo "🚀 Deploying to all backend instances behind load balancer..."

# Deploy to each backend instance
for instance in "${BACKEND_INSTANCES[@]}"; do
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📦 Deploying to: $instance"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  
  ssh $instance << ENDSSH
    cd $PROJECT_DIR
    echo "📥 Pulling latest code..."
    git pull origin main
    
    echo "📦 Installing dependencies..."
    npm install
    
    echo "🔄 Restarting application..."
    pm2 restart all
    
    echo "✅ Deployed to $instance"
ENDSSH

  echo ""
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "💾 Inserting blogs into database (once)..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Insert blogs only once (on first instance)
ssh ${BACKEND_INSTANCES[0]} << 'ENDSSH'
  cd /home/ubuntu/bihar-opinion-poll/backend/scripts
  
  echo "📝 Inserting Blog #1..."
  node insert-blog-01-districts.js
  
  echo "📝 Inserting Blog #2..."
  node insert-blog-02-seats.js
  
  echo "📝 Inserting Blog #3..."
  node insert-blog-03-cm.js
ENDSSH

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ DEPLOYMENT COMPLETE!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🔗 Test URLs:"
echo "  https://opinionpoll.co.in/blog/bihar-mein-kitne-jile-hain-2025"
echo "  https://opinionpoll.co.in/blog/bihar-vidhan-sabha-mein-kitni-seat-hai-2025"
echo "  https://opinionpoll.co.in/blog/bihar-ke-mukhyamantri-kaun-hain-2025"
echo ""
echo "⚠️  If still showing 404:"
echo "  1. Clear CDN/Cloudflare cache"
echo "  2. Wait 2-3 minutes for propagation"
echo "  3. Try in incognito/private browsing"
```

---

## What Information Do You Need to Provide?

To help you deploy properly, I need to know:

### 1. Load Balancer Type
- [ ] AWS Application Load Balancer (ALB)
- [ ] AWS Network Load Balancer (NLB)
- [ ] NGINX Load Balancer
- [ ] Cloudflare Load Balancing
- [ ] Other: __________

### 2. Backend Instance IPs
How many backend servers do you have?
- Backend 1 IP: ____________
- Backend 2 IP: ____________
- Backend 3 IP: ____________

### 3. Access Method
- [ ] SSH access to each backend instance
- [ ] Deployment pipeline (GitHub Actions, Jenkins, etc.)
- [ ] Manual access via server admin

### 4. Caching Layer
- [ ] CloudFront
- [ ] Cloudflare
- [ ] NGINX cache
- [ ] No caching
- [ ] Not sure

### 5. Database Access
- [ ] Shared RDS MySQL
- [ ] MySQL on one of the backend instances
- [ ] Separate database server

---

## Immediate Next Steps

**Tell me:**
1. How many backend instances do you have behind the load balancer?
2. Do you have SSH access to all of them?
3. What's the load balancer IP or DNS?
4. Are you using Cloudflare or CloudFront for CDN?

With this info, I'll create the exact deployment commands you need!

---

**Document Created**: November 4, 2025  
**Status**: ⚠️ Awaiting load balancer configuration details  
**Critical**: Must deploy to ALL backend instances, not just one
