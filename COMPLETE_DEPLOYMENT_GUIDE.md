# 🚀 Bihar Opinion Poll - Complete Deployment Guide

**Last Updated:** October 23, 2025  
**Domain:** https://opinionpoll.co.in  
**Status:** ✅ PRODUCTION LIVE

---

## 📋 Table of Contents

1. [Server Architecture](#server-architecture)
2. [SSH Access & Keys](#ssh-access--keys)
3. [Quick Deployment Commands](#quick-deployment-commands)
4. [Full Setup from Scratch](#full-setup-from-scratch)
5. [Database Configuration](#database-configuration)
6. [Environment Variables](#environment-variables)
7. [Nginx Configuration](#nginx-configuration)
8. [SSL/HTTPS Setup](#sslhttps-setup)
9. [PM2 Process Management](#pm2-process-management)
10. [Troubleshooting](#troubleshooting)

---

## 🏗️ Server Architecture

```
                    Internet/Cloudflare CDN
                              ↓
                    opinionpoll.co.in (DNS)
                              ↓
              ┌───────────────────────────┐
              │   Server 3 (Load Balancer) │
              │   65.2.142.131             │
              │   Nginx + Frontend + API   │
              └──────────┬─────────────────┘
                         │
              ┌──────────┴──────────┐
              ↓                     ↓
    ┌─────────────────┐   ┌─────────────────┐
    │   Server 2      │   │   Server 3      │
    │ 43.204.230.163  │   │ 65.2.142.131    │
    │ (Application)   │   │ (App + LB)      │
    ├─────────────────┤   ├─────────────────┤
    │ Frontend:3000   │   │ Frontend:3000   │
    │ Backend:5001    │   │ Backend:5001    │
    └────────┬────────┘   └────────┬────────┘
             │                     │
             └──────────┬──────────┘
                        ↓
              ┌─────────────────┐
              │   Server 1      │
              │ 15.206.160.149  │
              │ MySQL Database  │
              │ Port: 3306      │
              └─────────────────┘
```

### Server Details

| Server | IP | Role | OS | User | SSH Key |
|--------|----|----- |-------|------|---------|
| **Server 1** | 15.206.160.149 | MySQL Database | Ubuntu 24.04 | ubuntu | opinionweb.pem |
| **Server 2** | 43.204.230.163 | Application Server | Ubuntu 24.04 | ubuntu | key2.pem |
| **Server 3** | 65.2.142.131 | Load Balancer + App | Amazon Linux 2023 | ec2-user | key2.pem |

### Services Running

**Server 1 (Database):**
- MySQL 8.0
- Database: `opinion_poll`
- Port: 3306 (accessible from Server 2 & 3)

**Server 2 (Application):**
- Frontend: Next.js on port 3000 (PM2: frontend-server2)
- Backend: Express on port 5001 (PM2: backend-server2)

**Server 3 (Load Balancer + Application):**
- Nginx: Load balancer on ports 80/443
- Frontend: Next.js on port 3000 (PM2: frontend-server3)
- Backend: Express on port 5001 (PM2: backend-server3)

---

## 🔑 SSH Access & Keys

### SSH Keys Location

```bash
# Server 1 (Database)
/Users/rameshkumar/Downloads/opinionweb.pem

# Server 2 & 3 (Application servers)
/Users/rameshkumar/Downloads/key2.pem
```

### SSH Commands

```bash
# Connect to Server 1 (Database)
ssh -i /Users/rameshkumar/Downloads/opinionweb.pem ubuntu@15.206.160.149

# Connect to Server 2 (Application)
ssh -i /Users/rameshkumar/Downloads/key2.pem ubuntu@43.204.230.163

# Connect to Server 3 (Load Balancer)
ssh -i /Users/rameshkumar/Downloads/key2.pem ec2-user@65.2.142.131
```

### SCP File Transfer

```bash
# Upload to Server 2
scp -i /Users/rameshkumar/Downloads/key2.pem [local-file] ubuntu@43.204.230.163:[remote-path]

# Upload to Server 3
scp -i /Users/rameshkumar/Downloads/key2.pem [local-file] ec2-user@65.2.142.131:[remote-path]

# Download from Server 2
scp -i /Users/rameshkumar/Downloads/key2.pem ubuntu@43.204.230.163:[remote-file] [local-path]
```

---

## ⚡ Quick Deployment Commands

### Deploy Latest Changes (Frontend + Backend)

```bash
#!/bin/bash
# Save this as deploy-all.sh and make it executable: chmod +x deploy-all.sh

# Build Next.js locally
npm run build

# Create tarball
tar czf /tmp/build.tar.gz .next/

# Deploy to Server 2
echo "📦 Deploying to Server 2..."
scp -i /Users/rameshkumar/Downloads/key2.pem /tmp/build.tar.gz ubuntu@43.204.230.163:/tmp/
scp -i /Users/rameshkumar/Downloads/key2.pem public/robots.txt ubuntu@43.204.230.163:/home/ubuntu/opinion-poll/public/

ssh -i /Users/rameshkumar/Downloads/key2.pem ubuntu@43.204.230.163 << 'EOF'
cd ~/opinion-poll
rm -rf .next
tar xzf /tmp/build.tar.gz
rm /tmp/build.tar.gz
pm2 restart frontend-server2
echo "✅ Server 2 deployed"
EOF

# Deploy to Server 3
echo "📦 Deploying to Server 3..."
scp -i /Users/rameshkumar/Downloads/key2.pem /tmp/build.tar.gz ec2-user@65.2.142.131:/tmp/
scp -i /Users/rameshkumar/Downloads/key2.pem public/robots.txt ec2-user@65.2.142.131:/home/ec2-user/opinion-poll/public/

ssh -i /Users/rameshkumar/Downloads/key2.pem ec2-user@65.2.142.131 << 'EOF'
cd ~/opinion-poll
rm -rf .next
tar xzf /tmp/build.tar.gz
rm /tmp/build.tar.gz
pm2 restart frontend-server3
echo "✅ Server 3 deployed"
EOF

# Cleanup
rm /tmp/build.tar.gz

echo "✅ Deployment complete on both servers!"
```

### Deploy Backend Only

```bash
#!/bin/bash
# Deploy backend changes to both servers

# Deploy to Server 2
ssh -i /Users/rameshkumar/Downloads/key2.pem ubuntu@43.204.230.163 << 'EOF'
cd ~/opinion-poll
git pull origin main
cd backend
npm install
pm2 restart backend-server2
echo "✅ Server 2 backend deployed"
EOF

# Deploy to Server 3
ssh -i /Users/rameshkumar/Downloads/key2.pem ec2-user@65.2.142.131 << 'EOF'
cd ~/opinion-poll
git pull origin main
cd backend
npm install
pm2 restart backend-server3
echo "✅ Server 3 backend deployed"
EOF

echo "✅ Backend deployment complete!"
```

### Check Server Status

```bash
#!/bin/bash
# Check status of all services

echo "🔍 Checking Server 2..."
ssh -i /Users/rameshkumar/Downloads/key2.pem ubuntu@43.204.230.163 'pm2 status && df -h | grep "/$" && free -h | grep Mem'

echo ""
echo "🔍 Checking Server 3..."
ssh -i /Users/rameshkumar/Downloads/key2.pem ec2-user@65.2.142.131 'pm2 status && df -h | grep "/$" && free -h | grep Mem'

echo ""
echo "🔍 Checking Database Server 1..."
ssh -i /Users/rameshkumar/Downloads/opinionweb.pem ubuntu@15.206.160.149 'sudo systemctl status mysql | head -5 && df -h | grep "/$"'
```

---

## 🏁 Full Setup from Scratch

### 1. Server 1 - Database Setup

```bash
# SSH to Server 1
ssh -i /Users/rameshkumar/Downloads/opinionweb.pem ubuntu@15.206.160.149

# Update system
sudo apt update && sudo apt upgrade -y

# Install MySQL
sudo apt install mysql-server -y

# Secure MySQL
sudo mysql_secure_installation

# Configure MySQL for remote access
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
# Change: bind-address = 0.0.0.0

# Restart MySQL
sudo systemctl restart mysql

# Create database and user
sudo mysql << 'EOF'
CREATE DATABASE IF NOT EXISTS opinion_poll;
CREATE USER 'opinion_admin'@'%' IDENTIFIED BY 'YourSecurePassword123!';
GRANT ALL PRIVILEGES ON opinion_poll.* TO 'opinion_admin'@'%';
FLUSH PRIVILEGES;
EXIT;
EOF

# Import schema
cd /home/ubuntu/opinion-poll/backend/database
sudo mysql opinion_poll < schema.sql
sudo mysql opinion_poll < system_settings.sql

# Open MySQL port in firewall
sudo ufw allow 3306/tcp
```

### 2. Server 2 - Application Setup

```bash
# SSH to Server 2
ssh -i /Users/rameshkumar/Downloads/key2.pem ubuntu@43.204.230.163

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone repository
cd ~
git clone https://github.com/ramesh2010r/biharop.git opinion-poll
cd opinion-poll

# Install dependencies
npm install
cd backend && npm install && cd ..

# Build Next.js
npm run build

# Create .env files
cat > backend/.env << 'EOF'
PORT=5001
DB_HOST=15.206.160.149
DB_USER=opinion_admin
DB_PASSWORD=YourSecurePassword123!
DB_NAME=opinion_poll
JWT_SECRET=bihar_opinion_poll_secret_key_2025_secure
NODE_ENV=production
EOF

# Start with PM2
pm2 start npm --name "frontend-server2" -- start
pm2 start backend/server.js --name "backend-server2"

# Save PM2 configuration
pm2 save
pm2 startup

# Open ports
sudo ufw allow 3000/tcp
sudo ufw allow 5001/tcp
```

### 3. Server 3 - Load Balancer + Application Setup

```bash
# SSH to Server 3
ssh -i /Users/rameshkumar/Downloads/key2.pem ec2-user@65.2.142.131

# Update system
sudo yum update -y

# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs

# Install Nginx
sudo yum install -y nginx

# Install PM2
sudo npm install -g pm2

# Clone repository
cd ~
git clone https://github.com/ramesh2010r/biharop.git opinion-poll
cd opinion-poll

# Install dependencies
npm install
cd backend && npm install && cd ..

# Build Next.js
npm run build

# Create .env file (same as Server 2)
cat > backend/.env << 'EOF'
PORT=5001
DB_HOST=15.206.160.149
DB_USER=opinion_admin
DB_PASSWORD=YourSecurePassword123!
DB_NAME=opinion_poll
JWT_SECRET=bihar_opinion_poll_secret_key_2025_secure
NODE_ENV=production
EOF

# Start with PM2
pm2 start npm --name "frontend-server3" -- start
pm2 start backend/server.js --name "backend-server3"
pm2 save
pm2 startup

# Configure Nginx (see Nginx section below)

# Install Certbot for SSL
sudo yum install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d opinionpoll.co.in

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

---

## 🗄️ Database Configuration

### Database Connection Details

```env
DB_HOST=15.206.160.149
DB_USER=opinion_admin
DB_PASSWORD=YourSecurePassword123!
DB_NAME=opinion_poll
DB_PORT=3306
```

### Important Tables

- `system_settings` - App settings, ECI compliance, phase management
- `constituencies` - 243 Bihar constituencies
- `candidates` - All candidates (937 total)
- `votes` - Vote records with fingerprints
- `districts` - 38 districts of Bihar
- `admins` - Admin users (default: adminuser / Test@123)

### Database Backup

```bash
# Create backup
ssh -i /Users/rameshkumar/Downloads/opinionweb.pem ubuntu@15.206.160.149 \
  "sudo mysqldump -u root opinion_poll > /tmp/backup-$(date +%Y%m%d).sql"

# Download backup
scp -i /Users/rameshkumar/Downloads/opinionweb.pem \
  ubuntu@15.206.160.149:/tmp/backup-*.sql ./backups/

# Restore backup
sudo mysql opinion_poll < backup-20251023.sql
```

### Check Database Connection

```bash
# From Server 2 or 3
mysql -h 15.206.160.149 -u opinion_admin -p opinion_poll -e "SELECT COUNT(*) as total_votes FROM votes;"
```

---

## ⚙️ Environment Variables

### Backend .env (Server 2 & 3)

**Location:** `~/opinion-poll/backend/.env`

```env
# Server Configuration
PORT=5001
NODE_ENV=production

# Database
DB_HOST=15.206.160.149
DB_USER=opinion_admin
DB_PASSWORD=YourSecurePassword123!
DB_NAME=opinion_poll
DB_PORT=3306

# JWT Authentication (MUST BE SAME ON ALL SERVERS)
JWT_SECRET=bihar_opinion_poll_secret_key_2025_secure

# CORS
ALLOWED_ORIGINS=https://opinionpoll.co.in,http://localhost:3000

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./public/uploads
```

### Frontend .env (Next.js)

**Location:** `~/opinion-poll/.env.local` (optional)

```env
NEXT_PUBLIC_API_URL=https://opinionpoll.co.in/api
```

### Critical Notes

⚠️ **JWT_SECRET MUST BE IDENTICAL** on both Server 2 and Server 3!  
⚠️ **Database credentials** must match on all application servers  
⚠️ **Never commit** .env files to git

---

## 🌐 Nginx Configuration

### Load Balancer Config (Server 3)

**Location:** `/etc/nginx/conf.d/opinionpoll.conf`

```nginx
# Frontend upstream (Next.js)
upstream backend_servers {
    ip_hash;  # Sticky sessions for consistent user experience
    server 172.31.1.134:3000 weight=1 max_fails=2 fail_timeout=10s;
    server 127.0.0.1:3000 weight=1 max_fails=2 fail_timeout=10s;
    keepalive 64;
}

# Backend API upstream (Express)
upstream api_servers {
    least_conn;  # Load balance by least connections
    server 172.31.1.134:5001 weight=1 max_fails=2 fail_timeout=10s;
    server 127.0.0.1:5001 weight=1 max_fails=2 fail_timeout=10s;
    keepalive 32;
}

# Proxy cache
proxy_cache_path /var/cache/nginx/opinionpoll 
                 levels=1:2 
                 keys_zone=opinionpoll_cache:100m 
                 max_size=1g 
                 inactive=7d 
                 use_temp_path=off;

# HTTP to HTTPS redirect
server {
    listen 80;
    server_name opinionpoll.co.in;
    return 301 https://$server_name$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name opinionpoll.co.in;

    # SSL certificates (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/opinionpoll.co.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/opinionpoll.co.in/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # API routes
    location /api/ {
        proxy_pass http://api_servers;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Cache for specific API endpoints
        proxy_cache opinionpoll_cache;
        proxy_cache_valid 200 5m;
        proxy_cache_key "$scheme$request_method$host$request_uri";
        add_header X-Cache-Status $upstream_cache_status;
    }

    # Frontend (Next.js)
    location / {
        proxy_pass http://backend_servers;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files
    location /_next/static/ {
        proxy_pass http://backend_servers;
        proxy_cache opinionpoll_cache;
        proxy_cache_valid 200 7d;
        add_header Cache-Control "public, max-age=604800, immutable";
        add_header X-Cache-Status $upstream_cache_status;
    }
}
```

### Nginx Commands

```bash
# Test configuration
sudo nginx -t

# Reload configuration
sudo systemctl reload nginx

# Restart Nginx
sudo systemctl restart nginx

# Check status
sudo systemctl status nginx

# View error logs
sudo tail -f /var/log/nginx/error.log

# View access logs
sudo tail -f /var/log/nginx/access.log

# Clear cache
sudo rm -rf /var/cache/nginx/opinionpoll/*
```

---

## 🔒 SSL/HTTPS Setup

### Install SSL Certificate (Let's Encrypt)

```bash
# On Server 3 (Load Balancer)
ssh -i /Users/rameshkumar/Downloads/key2.pem ec2-user@65.2.142.131

# Install Certbot
sudo yum install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d opinionpoll.co.in

# Auto-renewal is configured automatically
# Test renewal
sudo certbot renew --dry-run
```

### Certificate Renewal

Certbot automatically renews certificates. To manually renew:

```bash
sudo certbot renew
sudo systemctl reload nginx
```

### Check Certificate Expiry

```bash
sudo certbot certificates
```

---

## 🔄 PM2 Process Management

### PM2 Commands

```bash
# View all processes
pm2 status

# View logs
pm2 logs                          # All processes
pm2 logs frontend-server2         # Specific process
pm2 logs backend-server3 --lines 50

# Restart processes
pm2 restart all
pm2 restart frontend-server2
pm2 restart backend-server3

# Stop processes
pm2 stop all
pm2 stop frontend-server2

# Delete processes
pm2 delete frontend-server2

# Monitor in real-time
pm2 monit

# Save current process list
pm2 save

# Resurrect saved processes on reboot
pm2 startup
```

### PM2 Configuration

Current running processes:

**Server 2:**
- `frontend-server2` - Next.js on port 3000
- `backend-server2` - Express on port 5001

**Server 3:**
- `frontend-server3` - Next.js on port 3000
- `backend-server3` - Express on port 5001

### Check Process Health

```bash
# Check if processes are running
pm2 status | grep online

# Check memory usage
pm2 list | grep -E 'memory|frontend|backend'

# Check restart count (should be low)
pm2 status | grep -E 'restart|frontend|backend'
```

---

## 🐛 Troubleshooting

### Issue: Website Not Loading

```bash
# Check Nginx status
ssh -i /Users/rameshkumar/Downloads/key2.pem ec2-user@65.2.142.131
sudo systemctl status nginx

# Check Nginx logs
sudo tail -100 /var/log/nginx/error.log

# Check if frontend is running
pm2 status | grep frontend

# Restart everything
pm2 restart all
sudo systemctl restart nginx
```

### Issue: API Returning 403 Forbidden

```bash
# Check JWT_SECRET matches on both servers
ssh -i /Users/rameshkumar/Downloads/key2.pem ubuntu@43.204.230.163 'grep JWT_SECRET ~/opinion-poll/backend/.env'
ssh -i /Users/rameshkumar/Downloads/key2.pem ec2-user@65.2.142.131 'grep JWT_SECRET ~/opinion-poll/backend/.env'

# Should return same value on both!
```

### Issue: Database Connection Failed

```bash
# Test database connection from Server 2
ssh -i /Users/rameshkumar/Downloads/key2.pem ubuntu@43.204.230.163
mysql -h 15.206.160.149 -u opinion_admin -p

# Check MySQL is running
ssh -i /Users/rameshkumar/Downloads/opinionweb.pem ubuntu@15.206.160.149
sudo systemctl status mysql

# Check MySQL logs
sudo tail -100 /var/log/mysql/error.log
```

### Issue: Next.js Build Errors (404 on chunks)

```bash
# This means builds are out of sync
# Re-deploy to both servers with same build

npm run build
tar czf /tmp/build.tar.gz .next/

# Deploy to BOTH servers
# ... (use deployment commands above)
```

### Issue: High Memory Usage

```bash
# Check memory
free -h

# Find memory-hungry processes
pm2 monit

# Restart if needed
pm2 restart all

# Check for memory leaks in logs
pm2 logs --lines 100 | grep -i "memory\|heap"
```

### Issue: SSL Certificate Expired

```bash
# Renew certificate
sudo certbot renew

# Reload Nginx
sudo systemctl reload nginx

# Check expiry
sudo certbot certificates
```

### Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| `ECONNREFUSED` | Service not running | `pm2 restart [service]` |
| `403 Forbidden` | JWT_SECRET mismatch | Sync JWT_SECRET on all servers |
| `404 Not Found` | Build out of sync | Redeploy .next to both servers |
| `502 Bad Gateway` | Backend down | `pm2 restart backend-server2 backend-server3` |
| `Database connection failed` | MySQL down or wrong credentials | Check MySQL status, verify .env |

---

## 📊 Monitoring & Logs

### Check Website Status

```bash
# Test load balancer
curl -I https://opinionpoll.co.in

# Test API
curl https://opinionpoll.co.in/api/districts

# Test with load balancing
for i in {1..10}; do curl -s https://opinionpoll.co.in | grep -o 'Server.*'; done
```

### View Logs

```bash
# PM2 logs
pm2 logs --lines 50

# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log

# MySQL logs
sudo tail -f /var/log/mysql/error.log
```

### Performance Monitoring

```bash
# Check response times
time curl -s https://opinionpoll.co.in > /dev/null

# Check concurrent connections
ss -s

# Check disk space
df -h

# Check memory
free -h

# Check CPU
top -bn1 | head -20
```

---

## 🎯 Admin Access

### Admin Credentials

**Username:** `adminuser`  
**Password:** `Test@123`  
**URL:** https://opinionpoll.co.in/admin

### Create New Admin

```bash
# SSH to any application server
ssh -i /Users/rameshkumar/Downloads/key2.pem ubuntu@43.204.230.163

cd ~/opinion-poll/backend
node scripts/create-admin.js
```

---

## 📝 Important File Locations

### Server 2 (ubuntu@43.204.230.163)

```
/home/ubuntu/opinion-poll/              # Main project directory
/home/ubuntu/opinion-poll/.next/        # Next.js build
/home/ubuntu/opinion-poll/backend/.env  # Backend environment variables
/home/ubuntu/opinion-poll/public/       # Static files
~/.pm2/logs/                            # PM2 logs
```

### Server 3 (ec2-user@65.2.142.131)

```
/home/ec2-user/opinion-poll/            # Main project directory
/home/ec2-user/opinion-poll/.next/      # Next.js build
/home/ec2-user/opinion-poll/backend/.env # Backend environment variables
/etc/nginx/conf.d/opinionpoll.conf      # Nginx configuration
/var/log/nginx/                         # Nginx logs
/var/cache/nginx/opinionpoll/           # Nginx cache
~/.pm2/logs/                            # PM2 logs
```

### Server 1 (ubuntu@15.206.160.149)

```
/etc/mysql/                             # MySQL configuration
/var/log/mysql/                         # MySQL logs
/var/lib/mysql/                         # MySQL data directory
```

---

## 🚀 Quick Reference Commands

```bash
# === SSH CONNECTION ===
# Server 1 (Database)
ssh -i ~/Downloads/opinionweb.pem ubuntu@15.206.160.149

# Server 2 (App)
ssh -i ~/Downloads/key2.pem ubuntu@43.204.230.163

# Server 3 (Load Balancer + App)
ssh -i ~/Downloads/key2.pem ec2-user@65.2.142.131

# === DEPLOYMENT ===
# Build and deploy frontend
npm run build && tar czf /tmp/build.tar.gz .next/
scp -i ~/Downloads/key2.pem /tmp/build.tar.gz ubuntu@43.204.230.163:/tmp/
scp -i ~/Downloads/key2.pem /tmp/build.tar.gz ec2-user@65.2.142.131:/tmp/

# === PM2 MANAGEMENT ===
pm2 status              # View all processes
pm2 restart all         # Restart all
pm2 logs                # View logs
pm2 monit              # Monitor in real-time

# === NGINX ===
sudo nginx -t           # Test config
sudo systemctl reload nginx    # Reload
sudo tail -f /var/log/nginx/error.log  # View logs

# === DATABASE ===
mysql -h 15.206.160.149 -u opinion_admin -p opinion_poll

# === TESTING ===
curl -I https://opinionpoll.co.in
curl https://opinionpoll.co.in/api/districts
pm2 status | grep online
```

---

## 📞 Support & Documentation

- **GitHub Repository:** https://github.com/ramesh2010r/biharop
- **Live Website:** https://opinionpoll.co.in
- **Admin Panel:** https://opinionpoll.co.in/admin

---

**Last Deployment:** October 23, 2025  
**Deployed By:** Automated deployment script  
**Status:** ✅ All systems operational  
**Version:** Production v1.0

