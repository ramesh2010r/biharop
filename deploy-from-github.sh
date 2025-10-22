#!/bin/bash

# Bihar Opinion Poll - GitHub to AWS EC2 Deployment
# This script deploys from GitHub repository to AWS EC2

set -e

# Configuration
SSH_KEY="/Users/rameshkumar/Downloads/ooop.pem"
SERVER_USER="ec2-user"
SERVER_IP="15.206.160.149"
DOMAIN="opinionpoll.co.in"
GITHUB_REPO="https://github.com/ramesh2010r/biharop"
PROJECT_DIR="/home/ubuntu/opinion-poll"

echo "🚀 Deploying Bihar Opinion Poll from GitHub to AWS EC2..."
echo "=================================================="
echo "Server: $SERVER_IP"
echo "Domain: $DOMAIN"
echo "GitHub: $GITHUB_REPO"
echo "=================================================="

# Test SSH connection
echo "🔑 Testing SSH connection..."
if ! ssh -i "$SSH_KEY" -o ConnectTimeout=10 $SERVER_USER@$SERVER_IP "echo 'SSH connection successful'" 2>/dev/null; then
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
ssh -i "$SSH_KEY" $SERVER_USER@$SERVER_IP << 'ENDSSH'
# Update system
sudo apt-get update

# Install Node.js 20.x
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi
echo "Node.js version: $(node --version)"

# Install MySQL
if ! command -v mysql &> /dev/null; then
    echo "Installing MySQL..."
    sudo apt-get install -y mysql-server
    sudo systemctl start mysql
    sudo systemctl enable mysql
fi

# Install Nginx
if ! command -v nginx &> /dev/null; then
    echo "Installing Nginx..."
    sudo apt-get install -y nginx
    sudo systemctl start nginx
    sudo systemctl enable nginx
fi

# Install PM2
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    sudo npm install -g pm2
fi

# Install Git
if ! command -v git &> /dev/null; then
    echo "Installing Git..."
    sudo apt-get install -y git
fi

echo "✅ All software installed"
ENDSSH

# Setup MySQL database
echo ""
echo "🗄️ Setting up MySQL database..."
ssh -i "$SSH_KEY" $SERVER_USER@$SERVER_IP << 'ENDSSH'
sudo mysql -e "CREATE DATABASE IF NOT EXISTS bihar_opinion_poll;" 2>/dev/null || true
sudo mysql -e "CREATE USER IF NOT EXISTS 'opinionpoll'@'localhost' IDENTIFIED BY 'BiharPoll@2025#Secure';" 2>/dev/null || true
sudo mysql -e "GRANT ALL PRIVILEGES ON bihar_opinion_poll.* TO 'opinionpoll'@'localhost';" 2>/dev/null || true
sudo mysql -e "FLUSH PRIVILEGES;" 2>/dev/null || true
echo "✅ Database configured"
ENDSSH

# Clone or update repository from GitHub
echo ""
echo "📥 Cloning/Updating repository from GitHub..."
ssh -i "$SSH_KEY" $SERVER_USER@$SERVER_IP bash -c "'
if [ -d \"$PROJECT_DIR/.git\" ]; then
    echo \"Repository exists, pulling latest changes...\"
    cd $PROJECT_DIR
    git fetch origin
    git reset --hard origin/main  # Force update to latest main branch
    echo \"✅ Repository updated\"
else
    echo \"Cloning repository...\"
    git clone $GITHUB_REPO $PROJECT_DIR
    cd $PROJECT_DIR
    echo \"✅ Repository cloned\"
fi
'"

# Create environment files
echo ""
echo "⚙️ Creating environment configuration..."
ssh -i "$SSH_KEY" $SERVER_USER@$SERVER_IP << 'ENDSSH'
cd $PROJECT_DIR

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

# Install dependencies and setup database
echo ""
echo "📦 Installing dependencies..."
ssh -i "$SSH_KEY" $SERVER_USER@$SERVER_IP << 'ENDSSH'
cd $PROJECT_DIR

# Install backend dependencies
cd backend
npm install --production

# Import database schema (only if tables don't exist)
if ! mysql -u opinionpoll -pBiharPoll@2025#Secure bihar_opinion_poll -e "SHOW TABLES LIKE 'Candidates';" | grep -q Candidates; then
    echo "Importing database schema..."
    mysql -u opinionpoll -pBiharPoll@2025#Secure bihar_opinion_poll < database/schema.sql
    mysql -u opinionpoll -pBiharPoll@2025#Secure bihar_opinion_poll < database/system_settings.sql
    echo "✅ Database schema imported"
else
    echo "Database tables already exist, skipping schema import"
fi

# Create admin user (if doesn't exist)
node scripts/create-admin.js admin admin@opinionpoll.co.in Admin@123 2>/dev/null || echo "Admin user already exists"

# Install frontend dependencies
cd ..
npm install

echo "✅ Dependencies installed"
ENDSSH

# Build Next.js frontend
echo ""
echo "🏗️ Building Next.js application..."
ssh -i "$SSH_KEY" $SERVER_USER@$SERVER_IP << 'ENDSSH'
cd $PROJECT_DIR
npm run build
echo "✅ Build complete"
ENDSSH

# Setup PM2
echo ""
echo "🔄 Setting up PM2 process manager..."
ssh -i "$SSH_KEY" $SERVER_USER@$SERVER_IP << 'ENDSSH'
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

# Restart applications with PM2
pm2 delete all 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd -u ubuntu --hp /home/ubuntu > /tmp/pm2-startup.sh
sudo bash /tmp/pm2-startup.sh

echo "✅ PM2 configured and applications started"
ENDSSH

# Configure Nginx
echo ""
echo "🌐 Configuring Nginx..."
ssh -i "$SSH_KEY" $SERVER_USER@$SERVER_IP << 'ENDSSH'
# Temporary HTTP configuration
sudo tee /etc/nginx/sites-available/opinion-poll << 'EOF'
server {
    listen 80;
    server_name opinionpoll.co.in www.opinionpoll.co.in _;

    client_max_body_size 10M;

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

    location /uploads {
        alias $PROJECT_DIR/backend/public/uploads;
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

echo "✅ Nginx configured"
ENDSSH

# Setup SSL (optional, requires domain DNS)
echo ""
echo "🔐 Setting up SSL certificate (optional)..."
ssh -i "$SSH_KEY" $SERVER_USER@$SERVER_IP << 'ENDSSH'
# Install Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Try to get SSL certificate
echo "Attempting to get SSL certificate..."
echo "⚠️  This requires DNS to be pointing to this server!"
sudo certbot --nginx -d opinionpoll.co.in -d www.opinionpoll.co.in \
  --non-interactive --agree-tos --email admin@opinionpoll.co.in \
  --redirect 2>&1 || {
    echo "⚠️  SSL setup skipped. To setup SSL later, run:"
    echo "   sudo certbot --nginx -d opinionpoll.co.in -d www.opinionpoll.co.in"
}

# Setup auto-renewal
sudo systemctl enable certbot.timer 2>/dev/null || true
sudo systemctl start certbot.timer 2>/dev/null || true

echo "✅ SSL configuration complete"
ENDSSH

# Configure firewall
echo ""
echo "🔒 Configuring firewall..."
ssh -i "$SSH_KEY" $SERVER_USER@$SERVER_IP << 'ENDSSH'
sudo ufw allow 22 2>/dev/null || true
sudo ufw allow 80 2>/dev/null || true
sudo ufw allow 443 2>/dev/null || true
sudo ufw --force enable 2>/dev/null || true
echo "✅ Firewall configured"
ENDSSH

# Verify deployment
echo ""
echo "🔍 Verifying deployment..."
ssh -i "$SSH_KEY" $SERVER_USER@$SERVER_IP << 'ENDSSH'
echo "PM2 Status:"
pm2 status

echo ""
echo "Nginx Status:"
sudo systemctl status nginx --no-pager | head -5

echo ""
echo "MySQL Status:"
sudo systemctl status mysql --no-pager | head -5

echo ""
echo "Testing backend API:"
curl -s http://localhost:5001/api/health || echo "Backend not responding"

echo ""
echo "Testing frontend:"
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost:3000 || echo "Frontend not responding"

echo ""
echo "✅ Deployment verification complete"
ENDSSH

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
echo "  ./deploy-from-github.sh"
echo ""
echo "⚠️  Next Steps:"
echo "  1. Ensure DNS points to: $SERVER_IP"
echo "  2. Change admin password"
echo "  3. Test website thoroughly"
echo "================================"
