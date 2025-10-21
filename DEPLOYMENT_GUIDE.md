# 🚀 Bihar Opinion Poll - Deployment Guide

## Server Details
- **IP Address:** 13.233.97.30
- **Domain:** https://opinionpoll.co.in
- **User:** ubuntu
- **SSH Key:** /Users/rameshkumar/Downloads/opinionweb.pem

---

## ⚠️ Pre-Deployment Checklist

### 1. Server Access Requirements
Before deploying, ensure the following:

#### AWS EC2 Security Group Settings
Your EC2 instance security group must allow:
- ✅ **Port 22 (SSH)** - From your IP address or 0.0.0.0/0
- ✅ **Port 80 (HTTP)** - From 0.0.0.0/0 (for Let's Encrypt validation)
- ✅ **Port 443 (HTTPS)** - From 0.0.0.0/0 (for website access)

**How to configure:**
1. Go to AWS EC2 Console
2. Select your instance (13.233.97.30)
3. Click on Security Groups
4. Edit Inbound Rules:
   ```
   Type: SSH, Port: 22, Source: My IP (or 0.0.0.0/0 for testing)
   Type: HTTP, Port: 80, Source: 0.0.0.0/0
   Type: HTTPS, Port: 443, Source: 0.0.0.0/0
   ```

#### SSH Key Permissions
```bash
chmod 400 /Users/rameshkumar/Downloads/opinionweb.pem
```

#### Test SSH Connection
```bash
ssh -i /Users/rameshkumar/Downloads/opinionweb.pem ubuntu@13.233.97.30
```

If connection fails, check:
- Security group allows SSH from your IP
- SSH key is correct
- Instance is running
- Elastic IP is correctly assigned

---

### 2. DNS Configuration
Point your domain to the server:

**A Records to create:**
```
Type: A
Name: @
Value: 13.233.97.30
TTL: 300 (5 minutes)

Type: A
Name: www
Value: 13.233.97.30
TTL: 300
```

**Verify DNS propagation:**
```bash
# From your Mac
nslookup opinionpoll.co.in
dig opinionpoll.co.in

# Should return: 13.233.97.30
```

⏰ DNS propagation can take 5 minutes to 24 hours.

---

### 3. Local Project Preparation

#### Build Frontend Locally (Optional Test)
```bash
cd "/Users/rameshkumar/Document/App/Opinion Pole"
npm run build
```

#### Verify Database Backup
```bash
ls -lh "/Users/rameshkumar/Document/App/Opinion Pole/backups/backup-20251020-150344.tar.gz"
```

---

## 🚀 Deployment Steps

### Option 1: Automated Deployment (Recommended)

Once SSH connection works, run:

```bash
cd "/Users/rameshkumar/Document/App/Opinion Pole"
./deploy.sh
```

This will automatically:
1. ✅ Install Node.js 20.x, MySQL, Nginx, PM2
2. ✅ Setup MySQL database (bihar_opinion_poll)
3. ✅ Upload project files via rsync
4. ✅ Create production environment files
5. ✅ Install all dependencies
6. ✅ Import database schema and 542 candidates
7. ✅ Build Next.js production bundle
8. ✅ Start services with PM2 (auto-restart on crash)
9. ✅ Configure Nginx reverse proxy
10. ✅ Setup SSL with Let's Encrypt (if DNS ready)
11. ✅ Create admin user (username: admin, password: Admin@123)
12. ✅ Configure firewall (UFW)

**Deployment Time:** ~10-15 minutes

---

### Option 2: Manual Deployment (Step by Step)

If automated deployment fails, follow these steps:

#### Step 1: SSH into Server
```bash
ssh -i /Users/rameshkumar/Downloads/opinionweb.pem ubuntu@13.233.97.30
```

#### Step 2: Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version  # Should be v20.x
```

#### Step 3: Install MySQL
```bash
sudo apt-get update
sudo apt-get install -y mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql

# Create database
sudo mysql -e "CREATE DATABASE IF NOT EXISTS bihar_opinion_poll;"
sudo mysql -e "CREATE USER IF NOT EXISTS 'opinionpoll'@'localhost' IDENTIFIED BY 'BiharPoll@2025#Secure';"
sudo mysql -e "GRANT ALL PRIVILEGES ON bihar_opinion_poll.* TO 'opinionpoll'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"
```

#### Step 4: Install Nginx and PM2
```bash
sudo apt-get install -y nginx
sudo npm install -g pm2
```

#### Step 5: Upload Project (From Your Mac)
```bash
# Exit from server first, run this on your Mac
rsync -avz --progress \
  -e "ssh -i /Users/rameshkumar/Downloads/opinionweb.pem" \
  --exclude 'node_modules' \
  --exclude '.next' \
  --exclude '*.log' \
  --exclude '.git' \
  "/Users/rameshkumar/Document/App/Opinion Pole/" \
  ubuntu@13.233.97.30:/home/ubuntu/opinion-poll/
```

#### Step 6: Configure Environment (Back on Server)
```bash
ssh -i /Users/rameshkumar/Downloads/opinionweb.pem ubuntu@13.233.97.30

cd /home/ubuntu/opinion-poll

# Backend environment
cat > backend/.env << EOF
PORT=5001
DB_HOST=localhost
DB_USER=opinionpoll
DB_PASSWORD=BiharPoll@2025#Secure
DB_NAME=bihar_opinion_poll
JWT_SECRET=$(openssl rand -hex 32)
NODE_ENV=production
EOF

# Frontend environment
cat > .env.production << EOF
NEXT_PUBLIC_API_URL=https://opinionpoll.co.in
NODE_ENV=production
EOF
```

#### Step 7: Install Dependencies and Import Database
```bash
cd /home/ubuntu/opinion-poll

# Backend
cd backend
npm install --production
mysql -u opinionpoll -pBiharPoll@2025#Secure bihar_opinion_poll < database/schema.sql
mysql -u opinionpoll -pBiharPoll@2025#Secure bihar_opinion_poll < database/system_settings.sql

# Create admin user
node scripts/create-admin.js admin admin@opinionpoll.co.in Admin@123

# Frontend
cd ..
npm install
npm run build
```

#### Step 8: Setup PM2
```bash
cd /home/ubuntu/opinion-poll

# Create ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'bihar-backend',
      cwd: './backend',
      script: 'server.js',
      env: {
        NODE_ENV: 'production',
        PORT: 5001
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    },
    {
      name: 'bihar-frontend',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    }
  ]
};
EOF

# Start applications
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd -u ubuntu --hp /home/ubuntu
# Run the command PM2 outputs
```

#### Step 9: Configure Nginx
```bash
sudo tee /etc/nginx/sites-available/opinion-poll << 'EOF'
# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name opinionpoll.co.in www.opinionpoll.co.in;
    
    # Allow Let's Encrypt verification
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }
    
    location / {
        return 301 https://opinionpoll.co.in$request_uri;
    }
}

# HTTPS Configuration
server {
    listen 443 ssl http2;
    server_name opinionpoll.co.in www.opinionpoll.co.in;

    # SSL certificates
    ssl_certificate /etc/letsencrypt/live/opinionpoll.co.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/opinionpoll.co.in/privkey.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Uploaded files
    location /uploads {
        alias /home/ubuntu/opinion-poll/backend/public/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/opinion-poll /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 10: Setup SSL with Let's Encrypt
```bash
# Install Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Temporary HTTP config for certificate
sudo tee /etc/nginx/sites-available/opinion-poll-temp << 'EOF'
server {
    listen 80;
    server_name opinionpoll.co.in www.opinionpoll.co.in;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
    }

    location /api {
        proxy_pass http://localhost:5001;
        proxy_set_header Host $host;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/opinion-poll-temp /etc/nginx/sites-enabled/opinion-poll
sudo nginx -t && sudo systemctl reload nginx

# Get SSL certificate
sudo certbot --nginx -d opinionpoll.co.in -d www.opinionpoll.co.in

# Setup auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

#### Step 11: Configure Firewall
```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable
```

---

## 🔍 Post-Deployment Verification

### 1. Check Services Status
```bash
ssh -i /Users/rameshkumar/Downloads/opinionweb.pem ubuntu@13.233.97.30

# Check PM2 status
pm2 status

# Check logs
pm2 logs bihar-backend --lines 50
pm2 logs bihar-frontend --lines 50

# Check Nginx
sudo systemctl status nginx
sudo nginx -t

# Check MySQL
sudo systemctl status mysql
mysql -u opinionpoll -pBiharPoll@2025#Secure -e "USE bihar_opinion_poll; SELECT COUNT(*) FROM Candidates;"
```

### 2. Test Website
```bash
# From your Mac
curl -I https://opinionpoll.co.in
curl https://opinionpoll.co.in/api/health
```

Open in browser:
- https://opinionpoll.co.in - Homepage
- https://opinionpoll.co.in/admin - Admin login
- https://opinionpoll.co.in/vote - Voting page
- https://opinionpoll.co.in/results - Results page

### 3. Test Admin Login
- URL: https://opinionpoll.co.in/admin
- Username: `admin`
- Password: `Admin@123`

**⚠️ Change password immediately after first login!**

---

## 🛠️ Server Management Commands

### PM2 Management
```bash
# Status
pm2 status

# Logs (real-time)
pm2 logs

# Restart all
pm2 restart all

# Restart specific app
pm2 restart bihar-backend
pm2 restart bihar-frontend

# Stop all
pm2 stop all

# Delete all
pm2 delete all

# Monitor
pm2 monit
```

### Nginx Management
```bash
# Test configuration
sudo nginx -t

# Reload (without downtime)
sudo systemctl reload nginx

# Restart
sudo systemctl restart nginx

# Check status
sudo systemctl status nginx

# View logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### MySQL Management
```bash
# Connect to database
mysql -u opinionpoll -pBiharPoll@2025#Secure bihar_opinion_poll

# Backup database
mysqldump -u opinionpoll -pBiharPoll@2025#Secure bihar_opinion_poll > backup_$(date +%Y%m%d).sql

# Check tables
mysql -u opinionpoll -pBiharPoll@2025#Secure -e "USE bihar_opinion_poll; SHOW TABLES;"

# Count candidates
mysql -u opinionpoll -pBiharPoll@2025#Secure -e "USE bihar_opinion_poll; SELECT COUNT(*) as total FROM Candidates;"
```

### SSL Certificate Management
```bash
# Check certificate status
sudo certbot certificates

# Renew manually (test)
sudo certbot renew --dry-run

# Renew manually (for real)
sudo certbot renew

# Auto-renewal is setup via certbot.timer
sudo systemctl status certbot.timer
```

---

## 🔄 Updating the Application

### Quick Update (Code Only)
```bash
# From your Mac
cd "/Users/rameshkumar/Document/App/Opinion Pole"

# Upload changes
rsync -avz --progress \
  -e "ssh -i /Users/rameshkumar/Downloads/opinionweb.pem" \
  --exclude 'node_modules' \
  --exclude '.next' \
  --exclude '*.log' \
  --exclude '.git' \
  ./src/ \
  ubuntu@13.233.97.30:/home/ubuntu/opinion-poll/src/

# SSH to server and rebuild
ssh -i /Users/rameshkumar/Downloads/opinionweb.pem ubuntu@13.233.97.30
cd /home/ubuntu/opinion-poll
npm run build
pm2 restart all
```

### Full Redeployment
```bash
cd "/Users/rameshkumar/Document/App/Opinion Pole"
./deploy.sh
```

---

## 🐛 Troubleshooting

### Issue: Website not loading
```bash
# Check PM2 status
pm2 status

# Check logs for errors
pm2 logs bihar-frontend --lines 100
pm2 logs bihar-backend --lines 100

# Check if ports are listening
sudo netstat -tlnp | grep -E '3000|5001'

# Restart services
pm2 restart all
```

### Issue: SSL certificate error
```bash
# Check certificate
sudo certbot certificates

# Check Nginx config
sudo nginx -t

# Verify DNS points to server
nslookup opinionpoll.co.in

# Re-obtain certificate
sudo certbot --nginx -d opinionpoll.co.in -d www.opinionpoll.co.in --force-renewal
```

### Issue: Database connection error
```bash
# Check MySQL is running
sudo systemctl status mysql

# Test database connection
mysql -u opinionpoll -pBiharPoll@2025#Secure bihar_opinion_poll -e "SELECT 1;"

# Check backend .env file
cat /home/ubuntu/opinion-poll/backend/.env
```

### Issue: High memory usage
```bash
# Check memory
free -h

# Check PM2 memory usage
pm2 list

# Restart apps to free memory
pm2 restart all

# If needed, reduce PM2 instances in ecosystem.config.js
```

---

## 📊 Monitoring & Logs

### Application Logs
```bash
# PM2 logs (real-time)
pm2 logs

# Specific app logs
pm2 logs bihar-backend
pm2 logs bihar-frontend

# Save logs to file
pm2 logs --raw > app-logs-$(date +%Y%m%d).log
```

### System Logs
```bash
# Nginx access log
sudo tail -f /var/log/nginx/access.log

# Nginx error log
sudo tail -f /var/log/nginx/error.log

# System log
sudo tail -f /var/log/syslog

# MySQL error log
sudo tail -f /var/log/mysql/error.log
```

### System Monitoring
```bash
# CPU and Memory
htop

# Disk usage
df -h

# Network connections
sudo netstat -tlnp

# Active processes
ps aux | grep node
```

---

## 🔒 Security Checklist

- ✅ Firewall (UFW) configured (ports 22, 80, 443)
- ✅ SSH key-based authentication
- ✅ SSL/TLS enabled (HTTPS)
- ✅ Strong database password
- ✅ JWT secret generated
- ✅ Security headers configured in Nginx
- ✅ Admin password changed from default
- ✅ Database user with minimal privileges
- ✅ Regular backups configured
- ✅ PM2 auto-restart on failure

### Additional Security Steps
1. Change default admin password
2. Setup automated database backups
3. Enable MySQL slow query log
4. Monitor PM2 logs for suspicious activity
5. Keep system packages updated: `sudo apt-get update && sudo apt-get upgrade`

---

## 📞 Support Information

**Project:** Bihar Election Opinion Poll  
**Server:** 13.233.97.30  
**Domain:** https://opinionpoll.co.in  
**Framework:** Next.js 15 + Express.js + MySQL  

**Admin Credentials (DEFAULT - CHANGE IMMEDIATELY):**
- Username: admin
- Password: Admin@123

**Database Credentials:**
- User: opinionpoll
- Password: BiharPoll@2025#Secure
- Database: bihar_opinion_poll

---

## ✅ Deployment Success Criteria

After deployment, verify:
- [ ] Website loads at https://opinionpoll.co.in
- [ ] SSL certificate is valid (green padlock in browser)
- [ ] Admin login works at https://opinionpoll.co.in/admin
- [ ] All 542 candidates are visible in admin dashboard
- [ ] Voting page loads and shows constituencies
- [ ] Results page displays correctly
- [ ] PM2 shows both apps running
- [ ] Nginx is serving the site
- [ ] MySQL database is accessible
- [ ] Auto-restart is configured (reboot server to test)

---

**Good luck with your deployment! 🚀**
