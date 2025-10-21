#!/bin/bash

# Bihar Opinion Poll - Deployment Script
# Server: 13.233.97.30
# Domain: https://opinionpoll.co.in

set -e

SSH_KEY="/Users/rameshkumar/Downloads/opinionweb.pem"
SERVER_USER="ubuntu"
SERVER_IP="13.233.97.30"
DOMAIN="opinionpoll.co.in"
PROJECT_DIR="/home/ubuntu/opinion-poll"
LOCAL_PROJECT="/Users/rameshkumar/Document/App/Opinion Pole"

echo "🚀 Starting deployment to $SERVER_IP..."

# Step 1: Install required software on server
echo "📦 Installing Node.js, MySQL, Nginx, and PM2..."
ssh -i "$SSH_KEY" $SERVER_USER@$SERVER_IP << 'ENDSSH'
# Update system
sudo apt-get update

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MySQL
sudo apt-get install -y mysql-server

# Install Nginx
sudo apt-get install -y nginx

# Install PM2 globally
sudo npm install -g pm2

# Start and enable services
sudo systemctl start mysql
sudo systemctl enable mysql
sudo systemctl start nginx
sudo systemctl enable nginx

echo "✅ Software installation complete"
ENDSSH

# Step 2: Setup MySQL database
echo "🗄️ Setting up MySQL database..."
ssh -i "$SSH_KEY" $SERVER_USER@$SERVER_IP << 'ENDSSH'
# Create database and user
sudo mysql -e "CREATE DATABASE IF NOT EXISTS bihar_opinion_poll;"
sudo mysql -e "CREATE USER IF NOT EXISTS 'opinionpoll'@'localhost' IDENTIFIED BY 'BiharPoll@2025#Secure';"
sudo mysql -e "GRANT ALL PRIVILEGES ON bihar_opinion_poll.* TO 'opinionpoll'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"
echo "✅ Database created"
ENDSSH

# Step 3: Create project directory
echo "📁 Creating project directory..."
ssh -i "$SSH_KEY" $SERVER_USER@$SERVER_IP "mkdir -p $PROJECT_DIR"

# Step 4: Copy project files
echo "📤 Uploading project files..."
rsync -avz --progress \
  -e "ssh -i $SSH_KEY" \
  --exclude 'node_modules' \
  --exclude '.next' \
  --exclude '*.log' \
  --exclude '.git' \
  "$LOCAL_PROJECT/" $SERVER_USER@$SERVER_IP:$PROJECT_DIR/

# Step 5: Create production environment files
echo "⚙️ Creating environment configuration..."
ssh -i "$SSH_KEY" $SERVER_USER@$SERVER_IP << 'ENDSSH'
cd /home/ubuntu/opinion-poll

# Backend .env
cat > backend/.env << 'EOF'
PORT=5001
DB_HOST=localhost
DB_USER=opinionpoll
DB_PASSWORD=BiharPoll@2025#Secure
DB_NAME=bihar_opinion_poll
JWT_SECRET=$(openssl rand -hex 32)
NODE_ENV=production
EOF

# Frontend .env.production
cat > .env.production << 'EOF'
NEXT_PUBLIC_API_URL=https://opinionpoll.co.in
NODE_ENV=production
EOF

echo "✅ Environment files created"
ENDSSH

# Step 6: Install dependencies and setup database
echo "📦 Installing dependencies..."
ssh -i "$SSH_KEY" $SERVER_USER@$SERVER_IP << 'ENDSSH'
cd /home/ubuntu/opinion-poll

# Install backend dependencies
cd backend
npm install --production

# Import database schema
mysql -u opinionpoll -pBiharPoll@2025#Secure bihar_opinion_poll < database/schema.sql
mysql -u opinionpoll -pBiharPoll@2025#Secure bihar_opinion_poll < database/system_settings.sql

# Install frontend dependencies
cd ..
npm install

echo "✅ Dependencies installed"
ENDSSH

# Step 7: Build Next.js frontend
echo "🏗️ Building Next.js application..."
ssh -i "$SSH_KEY" $SERVER_USER@$SERVER_IP << 'ENDSSH'
cd /home/ubuntu/opinion-poll
npm run build
echo "✅ Build complete"
ENDSSH

# Step 8: Setup PM2 to run applications
echo "🔄 Setting up PM2 process manager..."
ssh -i "$SSH_KEY" $SERVER_USER@$SERVER_IP << 'ENDSSH'
cd /home/ubuntu/opinion-poll

# Create PM2 ecosystem file
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

# Start applications with PM2
pm2 delete all 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd -u ubuntu --hp /home/ubuntu

echo "✅ PM2 configured and applications started"
ENDSSH

# Step 9: Configure Nginx as reverse proxy
echo "🌐 Configuring Nginx..."
ssh -i "$SSH_KEY" $SERVER_USER@$SERVER_IP << 'ENDSSH'
# Create Nginx configuration
sudo tee /etc/nginx/sites-available/opinion-poll << 'EOF'
# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name opinionpoll.co.in www.opinionpoll.co.in;
    return 301 https://opinionpoll.co.in$request_uri;
}

# HTTPS Configuration
server {
    listen 443 ssl http2;
    server_name opinionpoll.co.in www.opinionpoll.co.in;

    # SSL certificates (to be configured with Let's Encrypt)
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

# Enable site and restart Nginx
sudo ln -sf /etc/nginx/sites-available/opinion-poll /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

echo "✅ Nginx configured"
ENDSSH

# Step 10: Create admin user
echo "👤 Creating admin user..."
ssh -i "$SSH_KEY" $SERVER_USER@$SERVER_IP << 'ENDSSH'
cd /home/ubuntu/opinion-poll/backend
node scripts/create-admin.js admin admin@biharopinion.com Admin@123
echo "✅ Admin user created (username: admin, password: Admin@123)"
ENDSSH

# Step 11: Setup firewall
echo "🔒 Configuring firewall..."
ssh -i "$SSH_KEY" $SERVER_USER@$SERVER_IP << 'ENDSSH'
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable
echo "✅ Firewall configured"
ENDSSH

# Step 12: Setup SSL with Let's Encrypt (requires domain DNS to be pointed to server)
echo "🔐 Setting up SSL certificate..."
ssh -i "$SSH_KEY" $SERVER_USER@$SERVER_IP << 'ENDSSH'
# Install Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Temporarily setup HTTP-only Nginx config for certificate verification
sudo tee /etc/nginx/sites-available/opinion-poll-temp << 'EOF'
server {
    listen 80;
    server_name opinionpoll.co.in www.opinionpoll.co.in;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/opinion-poll-temp /etc/nginx/sites-enabled/opinion-poll
sudo nginx -t && sudo systemctl reload nginx

# Get SSL certificate
echo "📜 Obtaining SSL certificate from Let's Encrypt..."
echo "⚠️  Make sure DNS is pointing to this server!"
sudo certbot --nginx -d opinionpoll.co.in -d www.opinionpoll.co.in --non-interactive --agree-tos --email admin@opinionpoll.co.in --redirect || {
    echo "⚠️  SSL certificate setup failed. You may need to:"
    echo "   1. Ensure DNS is pointing to 13.233.97.30"
    echo "   2. Wait for DNS propagation (up to 24 hours)"
    echo "   3. Run manually: sudo certbot --nginx -d opinionpoll.co.in -d www.opinionpoll.co.in"
}

# Setup auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

echo "✅ SSL setup complete"
ENDSSH

echo ""
echo "🎉 Deployment Complete!"
echo "================================"
echo "🌐 Website URL: https://opinionpoll.co.in"
echo "🔐 Admin Login: https://opinionpoll.co.in/admin"
echo "   Username: admin"
echo "   Password: Admin@123"
echo ""
echo "📊 Server Management:"
echo "   SSH: ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP"
echo "   PM2 Status: ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'pm2 status'"
echo "   PM2 Logs: ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'pm2 logs'"
echo "   Restart: ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'pm2 restart all'"
echo ""
echo "💾 Database:"
echo "   Host: localhost"
echo "   User: opinionpoll"
echo "   Password: BiharPoll@2025#Secure"
echo "   Database: bihar_opinion_poll"
echo ""
echo "🔐 SSL Certificate:"
echo "   Status: Check with 'sudo certbot certificates'"
echo "   Renew: Auto-renewal configured (certbot.timer)"
echo "   Manual: sudo certbot renew --dry-run"
echo ""
echo "⚠️  Important Next Steps:"
echo "   1. Ensure your domain DNS A record points to: 13.233.97.30"
echo "   2. Change admin password after first login"
echo "   3. Configure system settings in admin dashboard"
echo "   4. Test the application thoroughly"
echo "================================"
