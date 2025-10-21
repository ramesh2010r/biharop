#!/bin/bash

# Bihar Opinion Poll - GitHub to AWS EC2 (Amazon Linux 2023) Deployment
# This script deploys from GitHub repository to AWS EC2 running Amazon Linux

set -e

# Configuration
SSH_KEY="/Users/rameshkumar/Downloads/ooop.pem"
SERVER_USER="ec2-user"
SERVER_IP="15.206.160.149"
DOMAIN="opinionpoll.co.in"
GITHUB_REPO="https://github.com/ramesh2010r/biharop"
PROJECT_DIR="/home/ec2-user/opinion-poll"

echo "🚀 Deploying Bihar Opinion Poll from GitHub to AWS EC2 (Amazon Linux)..."
echo "=================================================="
echo "Server: $SERVER_IP"
echo "Domain: $DOMAIN"
echo "GitHub: $GITHUB_REPO"
echo "=================================================="

# Test SSH connection
echo "🔑 Testing SSH connection..."
if ! ssh -i "$SSH_KEY" -o ConnectTimeout=10 -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP "echo 'SSH connection successful'" 2>/dev/null; then
    echo "❌ ERROR: Cannot connect to server via SSH"
    echo "Please check:"
    echo "  1. EC2 security group allows SSH (port 22)"
    echo "  2. Server IP is correct: $SERVER_IP"
    echo "  3. SSH key is correct: $SSH_KEY"
    echo "  4. Server is running"
    exit 1
fi
echo "✅ SSH connection successful"

# Install required software
echo ""
echo "📦 Installing required software..."
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP << 'ENDSSH'
# Update system
sudo dnf update -y

# Install Node.js 20.x
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
    sudo dnf install -y nodejs
fi
echo "✅ Node.js version: $(node --version)"

# Install MySQL (MariaDB on Amazon Linux)
if ! command -v mysql &> /dev/null; then
    echo "Installing MariaDB (MySQL compatible)..."
    sudo dnf install -y mariadb105-server mariadb105
    sudo systemctl start mariadb
    sudo systemctl enable mariadb
fi
echo "✅ MariaDB installed"

# Install Nginx
if ! command -v nginx &> /dev/null; then
    echo "Installing Nginx..."
    sudo dnf install -y nginx
    sudo systemctl start nginx
    sudo systemctl enable nginx
fi
echo "✅ Nginx installed"

# Install PM2
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    sudo npm install -g pm2
    pm2 startup systemd -u $USER --hp $HOME
fi
echo "✅ PM2 installed"

# Install Git
if ! command -v git &> /dev/null; then
    echo "Installing Git..."
    sudo dnf install -y git
fi
echo "✅ Git installed"

echo "✅ All software installed"
ENDSSH

# Setup MySQL database
echo ""
echo "🗄️ Setting up MySQL database..."
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP << 'ENDSSH'
sudo mysql -e "CREATE DATABASE IF NOT EXISTS bihar_opinion_poll;" 2>/dev/null || true
sudo mysql -e "CREATE USER IF NOT EXISTS 'opinionpoll'@'localhost' IDENTIFIED BY 'BiharPoll@2025#Secure';" 2>/dev/null || true
sudo mysql -e "GRANT ALL PRIVILEGES ON bihar_opinion_poll.* TO 'opinionpoll'@'localhost';" 2>/dev/null || true
sudo mysql -e "FLUSH PRIVILEGES;" 2>/dev/null || true
echo "✅ Database configured"
ENDSSH

# Clone or update repository from GitHub
echo ""
echo "📥 Cloning/Updating repository from GitHub..."
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP << ENDSSH
if [ -d "$PROJECT_DIR" ]; then
    echo "Updating existing repository..."
    cd $PROJECT_DIR
    git pull origin main
    echo "✅ Repository updated"
else
    echo "Cloning repository..."
    git clone $GITHUB_REPO $PROJECT_DIR
    echo "✅ Repository cloned"
fi
ENDSSH

# Create environment files
echo ""
echo "⚙️ Creating environment configuration..."
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP << ENDSSH
cd $PROJECT_DIR

# Backend .env
cat > backend/.env << 'EOF'
NODE_ENV=production
PORT=5001
DB_HOST=localhost
DB_USER=opinionpoll
DB_PASSWORD=BiharPoll@2025#Secure
DB_NAME=bihar_opinion_poll
JWT_SECRET=BiharOpinionPoll2025SecretKey#ChangeThis
ADMIN_USERNAME=admin
ADMIN_PASSWORD=Admin@123
EOF

# Frontend .env.local
cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=https://opinionpoll.co.in
EOF

echo "✅ Environment files created"
ENDSSH

# Install dependencies and setup database
echo ""
echo "📦 Installing dependencies..."
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP << ENDSSH
cd $PROJECT_DIR

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install --production

# Import database schema only if tables don't exist
echo "Importing database schema..."
mysql -u opinionpoll -pBiharPoll@2025#Secure bihar_opinion_poll < database/schema.sql 2>/dev/null || echo "Schema already exists"
mysql -u opinionpoll -pBiharPoll@2025#Secure bihar_opinion_poll < database/system_settings.sql 2>/dev/null || echo "Settings already exist"

# Create admin user if not exists
node scripts/create-admin.js 2>/dev/null || echo "Admin user already exists"

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd $PROJECT_DIR
npm install --production

echo "✅ Dependencies installed"
ENDSSH

# Build Next.js application
echo ""
echo "🏗️ Building Next.js application..."
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP << ENDSSH
cd $PROJECT_DIR
npm run build
echo "✅ Build complete"
ENDSSH

# Setup PM2
echo ""
echo "🔄 Setting up PM2 process manager..."
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP << 'ENDSSH'
cd $PROJECT_DIR

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
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      time: true
    },
    {
      name: 'bihar-frontend',
      cwd: './',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: './logs/frontend-error.log',
      out_file: './logs/frontend-out.log',
      time: true
    }
  ]
};
EOF

# Create logs directory
mkdir -p logs

# Start/restart applications with PM2
pm2 delete all 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd -u $USER --hp $HOME | grep "sudo" | bash || true

echo "✅ PM2 configured and applications started"
ENDSSH

# Configure Nginx
echo ""
echo "🌐 Configuring Nginx..."
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP << ENDSSH
sudo tee /etc/nginx/conf.d/opinion-poll.conf > /dev/null << 'EOF'
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN _;

    client_max_body_size 10M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /api {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /uploads {
        alias $PROJECT_DIR/backend/public/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Test and reload Nginx
sudo nginx -t && sudo systemctl reload nginx
echo "✅ Nginx configured"
ENDSSH

# Setup SSL with Let's Encrypt (optional)
echo ""
echo "🔐 Setting up SSL certificate (optional)..."
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP << ENDSSH
# Install certbot
if ! command -v certbot &> /dev/null; then
    sudo dnf install -y python3-certbot-nginx
fi

echo "Attempting to get SSL certificate..."
echo "⚠️  This requires DNS to be pointing to this server!"
sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN --redirect 2>/dev/null || {
    echo "⚠️  SSL setup skipped. To setup SSL later, run:"
    echo "   sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
}
echo "✅ SSL configuration complete"
ENDSSH

# Configure firewall
echo ""
echo "🔒 Configuring firewall..."
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP << 'ENDSSH'
# Amazon Linux uses firewalld
if command -v firewall-cmd &> /dev/null; then
    sudo firewall-cmd --permanent --add-service=http
    sudo firewall-cmd --permanent --add-service=https
    sudo firewall-cmd --reload
fi
echo "✅ Firewall configured"
ENDSSH

# Verify deployment
echo ""
echo "🔍 Verifying deployment..."
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP << 'ENDSSH'
echo "PM2 Status:"
pm2 status

echo ""
echo "Nginx Status:"
sudo systemctl status nginx | grep Active

echo ""
echo "MariaDB Status:"
sudo systemctl status mariadb | grep Active

echo ""
echo "Testing backend API:"
sleep 3
curl -s http://localhost:5001/api/health | grep -q "ok" && echo "✅ Backend responding" || echo "⚠️  Backend not responding"

echo ""
echo "Testing frontend:"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
echo "HTTP Status: $HTTP_STATUS"
if [ "$HTTP_STATUS" = "200" ]; then
    echo "✅ Frontend responding"
else
    echo "⚠️  Frontend not responding"
fi
ENDSSH

echo ""
echo "✅ Deployment verification complete"

echo ""
echo "🎉 Deployment Complete!"
echo "================================"
echo "🌐 Website: http://$SERVER_IP"
echo "🌐 Domain: https://$DOMAIN (if DNS configured)"
echo "🔐 Admin: http://$SERVER_IP/admin"
echo "   Username: admin"
echo "   Password: Admin@123"
echo ""
echo "📊 Management Commands:"
echo "  SSH: ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP"
echo "  PM2 Status: ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'pm2 status'"
echo "  PM2 Logs: ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'pm2 logs'"
echo "  Restart: ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'pm2 restart all'"
echo ""
echo "🔄 To update from GitHub:"
echo "  ./deploy-amazon-linux.sh"
echo ""
echo "⚠️  Next Steps:"
echo "  1. Ensure DNS points to: $SERVER_IP"
echo "  2. Change admin password"
echo "  3. Test website thoroughly"
echo "================================"
