# 🆓 Oracle Cloud Free Tier Deployment Guide
# Bihar Opinion Poll - Oracle Cloud Always Free Deployment

## Step 1: Create Oracle Cloud Account
1. Go to https://oracle.com/cloud/free/
2. Sign up with your email
3. Complete verification (requires credit card for verification, but won't be charged)
4. Wait for account activation (5-10 minutes)

## Step 2: Create Compute Instance

### Login to Oracle Cloud Console
1. Go to https://cloud.oracle.com/
2. Sign in with your account

### Create VM Instance
1. **Navigate:** Menu → Compute → Instances
2. **Click:** "Create Instance"
3. **Configure:**
   ```
   Name: bihar-opinion-poll
   Compartment: (root)
   Availability Domain: (any)
   Image: Canonical Ubuntu 22.04
   Shape: VM.Standard.E2.1.Micro (Always Free)
   - OR for better performance: VM.Standard.A1.Flex (ARM, 4 OCPUs, 24GB RAM - Free!)
   ```

### Network Configuration
1. **VCN:** Create new VCN (virtual cloud network)
2. **Subnet:** Create new public subnet
3. **Public IP:** Assign a public IPv4 address
4. **SSH Keys:** 
   - Upload your public key OR
   - Generate new key pair (download private key)

### Create Instance
- Click "Create"
- Wait 2-3 minutes for provisioning
- Note down the **Public IP address**

## Step 3: Configure Security Rules

### Add Ingress Rules
1. **Navigate:** Menu → Networking → Virtual Cloud Networks
2. **Click:** Your VCN name
3. **Click:** Default Security List
4. **Add Ingress Rules:**

```
Rule 1 - SSH:
Source: 0.0.0.0/0
Protocol: TCP
Port: 22

Rule 2 - HTTP:
Source: 0.0.0.0/0
Protocol: TCP
Port: 80

Rule 3 - HTTPS:
Source: 0.0.0.0/0  
Protocol: TCP
Port: 443

Rule 4 - Custom (Node.js - for testing):
Source: 0.0.0.0/0
Protocol: TCP
Port: 3000
```

## Step 4: Connect to Instance

### Using your existing SSH key:
```bash
# Replace YOUR_PUBLIC_IP with actual IP from Oracle Console
ssh -i /Users/rameshkumar/Downloads/opinionweb.pem ubuntu@YOUR_PUBLIC_IP
```

### If you generated new key:
```bash
# Use the downloaded private key
chmod 400 ~/Downloads/ssh-key-*.key
ssh -i ~/Downloads/ssh-key-*.key ubuntu@YOUR_PUBLIC_IP
```

## Step 5: Deploy Your Application

### Option A: Use Modified Deploy Script
```bash
# Update deploy.sh with new IP
cd "/Users/rameshkumar/Document/App/Opinion Pole"

# Edit deploy.sh - replace SERVER_IP with your Oracle Cloud IP
# Then run:
./deploy.sh
```

### Option B: Manual Deployment (Recommended for first time)

#### 1. Connect to server:
```bash
ssh -i your-key ubuntu@YOUR_ORACLE_IP
```

#### 2. Update system:
```bash
sudo apt update && sudo apt upgrade -y
```

#### 3. Install Node.js 20:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version  # Should show v20.x
```

#### 4. Install MySQL:
```bash
sudo apt-get install -y mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql

# Secure MySQL
sudo mysql_secure_installation
# Set root password: BiharPoll@2025#Secure
# Answer Y to all security questions
```

#### 5. Install other tools:
```bash
sudo apt-get install -y nginx git curl
sudo npm install -g pm2
```

#### 6. Upload your project:
```bash
# From your Mac (new terminal):
rsync -avz --progress \
  -e "ssh -i /Users/rameshkumar/Downloads/opinionweb.pem" \
  --exclude 'node_modules' \
  --exclude '.next' \
  --exclude '*.log' \
  --exclude '.git' \
  "/Users/rameshkumar/Document/App/Opinion Pole/" \
  ubuntu@YOUR_ORACLE_IP:/home/ubuntu/opinion-poll/
```

#### 7. Setup database:
```bash
# Back on server:
sudo mysql -e "CREATE DATABASE bihar_opinion_poll;"
sudo mysql -e "CREATE USER 'opinionpoll'@'localhost' IDENTIFIED BY 'BiharPoll@2025#Secure';"
sudo mysql -e "GRANT ALL PRIVILEGES ON bihar_opinion_poll.* TO 'opinionpoll'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"
```

#### 8. Configure application:
```bash
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
NEXT_PUBLIC_API_URL=http://YOUR_ORACLE_IP:5001
NODE_ENV=production
EOF
```

#### 9. Install dependencies and import data:
```bash
# Backend
cd backend
npm install --production
mysql -u opinionpoll -pBiharPoll@2025#Secure bihar_opinion_poll < database/schema.sql
mysql -u opinionpoll -pBiharPoll@2025#Secure bihar_opinion_poll < database/system_settings.sql
node scripts/create-admin.js admin admin@biharopinion.com Admin@123

# Frontend
cd ..
npm install
npm run build
```

#### 10. Start with PM2:
```bash
# Create PM2 config
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
      }
    },
    {
      name: 'bihar-frontend',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
EOF

# Start apps
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd -u ubuntu --hp /home/ubuntu
# Run the command PM2 outputs
```

#### 11. Configure Nginx (Optional - for custom domain):
```bash
sudo tee /etc/nginx/sites-available/opinion-poll << 'EOF'
server {
    listen 80;
    server_name YOUR_ORACLE_IP;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /api {
        proxy_pass http://localhost:5001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/opinion-poll /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

## Step 6: Test Your Application

### Direct Access (No Nginx):
- Frontend: http://YOUR_ORACLE_IP:3000
- Backend API: http://YOUR_ORACLE_IP:5001/api/health
- Admin: http://YOUR_ORACLE_IP:3000/admin

### With Nginx:
- Website: http://YOUR_ORACLE_IP

## Step 7: Add Custom Domain (Optional)

### If you have a domain:
1. Point A record to your Oracle IP
2. Update Nginx config with your domain
3. Get SSL certificate with Let's Encrypt

## 💰 Oracle Cloud Advantages:

✅ **Forever Free** - No time limit
✅ **Better specs** - ARM instances get 4 CPUs + 24GB RAM
✅ **200GB storage** - More than enough
✅ **10TB bandwidth** - Very generous
✅ **Global locations** - Choose region close to users
✅ **Enterprise features** - Load balancers, firewalls
✅ **No credit card charges** - Truly free

## 🔧 Managing Your Oracle Instance:

### Start/Stop Instance:
- **Oracle Console:** Compute → Instances → Actions → Start/Stop
- **From SSH:** `sudo shutdown -h now` (stops), start from console

### Monitor Usage:
- **Oracle Console:** Menu → Governance → Usage Reports
- Check you're within Always Free limits

### Backup:
- **Boot Volume Backup:** Compute → Boot Volumes → Create Backup
- **Application Backup:** Use your existing backup script

## 🚨 Important Notes:

1. **Instance can be reclaimed** if idle for 7+ days - keep some activity
2. **ARM instances** (A1.Flex) are better but may have limited availability
3. **Save your SSH key** - you'll need it to access
4. **Security groups** are called "Security Lists" in Oracle
5. **Free tier is per tenancy** - don't create multiple accounts

## 🎯 Next Steps After Oracle Setup:

1. Create Oracle Cloud account
2. Create compute instance  
3. Note down public IP
4. Update your deploy script with new IP
5. Run deployment
6. Test website
7. Configure domain (if you have one)

Want me to help you set up Oracle Cloud, or would you prefer another free provider?