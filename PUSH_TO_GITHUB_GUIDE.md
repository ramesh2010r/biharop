# 🚀 Push to GitHub & Deploy to EC2 - Step by Step Guide

## ✅ Step 1: Create GitHub Repository (COMPLETE THIS FIRST)

### 1.1 Go to GitHub
1. Open your browser and go to https://github.com
2. Log in to your GitHub account

### 1.2 Create New Repository
1. Click the **"+"** icon in the top right corner
2. Click **"New repository"**

### 1.3 Repository Settings
```
Repository name: bihar-opinion-poll
Description: Bihar Assembly Elections Opinion Poll Platform - Next.js + Express.js + MySQL
Visibility: ✅ Public (or Private if you prefer)

❌ Do NOT initialize with:
   - README (we already have one)
   - .gitignore (we already have one)  
   - License (optional)
```

4. Click **"Create repository"**

### 1.4 Copy Repository URL
After creation, you'll see a page with commands. Copy the HTTPS URL:
```
https://github.com/YOUR_USERNAME/bihar-opinion-poll.git
```

---

## ✅ Step 2: Push Your Code to GitHub

### 2.1 Add GitHub Remote
Run this command (replace YOUR_USERNAME with your actual GitHub username):

```bash
cd "/Users/rameshkumar/Document/App/Opinion Pole"
git remote add origin https://github.com/YOUR_USERNAME/bihar-opinion-poll.git
```

### 2.2 Verify Remote
```bash
git remote -v
```

You should see:
```
origin  https://github.com/YOUR_USERNAME/bihar-opinion-poll.git (fetch)
origin  https://github.com/YOUR_USERNAME/bihar-opinion-poll.git (push)
```

### 2.3 Push to GitHub
```bash
git branch -M main
git push -u origin main
```

If prompted for credentials:
- **Username:** Your GitHub username
- **Password:** Use a **Personal Access Token** (not your password)

#### How to Create Personal Access Token:
1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name: "Bihar Opinion Poll"
4. Select scopes: ✅ repo (full control)
5. Click "Generate token"
6. **Copy the token** (you won't see it again!)
7. Use this token as password when pushing

### 2.4 Verify on GitHub
1. Go to `https://github.com/YOUR_USERNAME/bihar-opinion-poll`
2. You should see all your files!

---

## ✅ Step 3: Update Deployment Script with Your GitHub URL

### 3.1 Open the deployment script
```bash
nano "/Users/rameshkumar/Document/App/Opinion Pole/deploy-from-github.sh"
```

### 3.2 Find this line (around line 13):
```bash
GITHUB_REPO="https://github.com/YOUR_USERNAME/bihar-opinion-poll.git"  # UPDATE THIS!
```

### 3.3 Replace YOUR_USERNAME with your actual GitHub username:
```bash
GITHUB_REPO="https://github.com/rameshkumar/bihar-opinion-poll.git"
```

### 3.4 Save and exit
- Press `Ctrl + O` to save
- Press `Enter` to confirm
- Press `Ctrl + X` to exit

### 3.5 Commit the change
```bash
cd "/Users/rameshkumar/Document/App/Opinion Pole"
git add deploy-from-github.sh
git commit -m "Update GitHub repository URL in deployment script"
git push origin main
```

---

## ✅ Step 4: Fix EC2 SSH Access (If Not Working)

### 4.1 Check Current SSH Key
```bash
ls -la /Users/rameshkumar/Downloads/opinionweb.pem
```

### 4.2 Test SSH Connection
```bash
ssh -i /Users/rameshkumar/Downloads/opinionweb.pem ubuntu@13.233.97.30
```

### If Connection Fails:

#### Option A: Fix AWS Security Group
1. Go to AWS EC2 Console
2. Select your instance (13.233.97.30)
3. Click "Security" tab
4. Click on the Security Group link
5. Click "Edit inbound rules"
6. Add these rules:
   ```
   Type: SSH, Port: 22, Source: 0.0.0.0/0
   Type: HTTP, Port: 80, Source: 0.0.0.0/0
   Type: HTTPS, Port: 443, Source: 0.0.0.0/0
   ```
7. Click "Save rules"

#### Option B: Use Correct SSH Key
If you have a different key for this EC2 instance:
```bash
# Update deploy-from-github.sh with correct key path
nano deploy-from-github.sh
# Change line 7: SSH_KEY="/path/to/your/correct/key.pem"
```

#### Option C: Use Different IP
If the IP changed:
```bash
# Find your EC2 instance's current public IP in AWS Console
# Update deploy-from-github.sh:
nano deploy-from-github.sh
# Change line 9: SERVER_IP="YOUR_NEW_IP"
```

---

## ✅ Step 5: Deploy from GitHub to EC2

### 5.1 Test SSH First
```bash
ssh -i /Users/rameshkumar/Downloads/opinionweb.pem ubuntu@13.233.97.30 "echo 'SSH Works!'"
```

If this works, proceed to deployment.

### 5.2 Run Deployment
```bash
cd "/Users/rameshkumar/Document/App/Opinion Pole"
./deploy-from-github.sh
```

This will:
1. ✅ Connect to your EC2 server
2. ✅ Install Node.js, MySQL, Nginx, PM2
3. ✅ Clone your GitHub repository
4. ✅ Setup database with 542 candidates
5. ✅ Install dependencies
6. ✅ Build Next.js app
7. ✅ Start services with PM2
8. ✅ Configure Nginx
9. ✅ Setup SSL (if DNS ready)
10. ✅ Configure firewall

**Time:** 10-15 minutes

### 5.3 Monitor Deployment
Watch the output in your terminal. It will show progress for each step.

---

## ✅ Step 6: Verify Deployment

### 6.1 Check Website
Open in browser:
```
http://13.233.97.30           # Main website
http://13.233.97.30/admin     # Admin panel
http://13.233.97.30/vote      # Voting page
http://13.233.97.30/results   # Results page
```

### 6.2 Login to Admin
```
URL: http://13.233.97.30/admin
Username: admin
Password: Admin@123
```

**⚠️ IMPORTANT: Change password immediately!**

### 6.3 Check Server Status
```bash
ssh -i /Users/rameshkumar/Downloads/opinionweb.pem ubuntu@13.233.97.30

# Check PM2
pm2 status

# Check logs
pm2 logs bihar-backend --lines 50
pm2 logs bihar-frontend --lines 50

# Check database
mysql -u opinionpoll -pBiharPoll@2025#Secure bihar_opinion_poll -e "SELECT COUNT(*) FROM Candidates;"
```

---

## 🔄 Future Updates (After Initial Deployment)

### Update Code:
1. Make changes locally
2. Commit: `git add . && git commit -m "Your changes"`
3. Push: `git push origin main`
4. Deploy: `./deploy-from-github.sh`

The script will automatically pull the latest code from GitHub!

---

## 🎯 Quick Command Reference

```bash
# Push new changes to GitHub
cd "/Users/rameshkumar/Document/App/Opinion Pole"
git add .
git commit -m "Your commit message"
git push origin main

# Deploy from GitHub to EC2
./deploy-from-github.sh

# SSH into server
ssh -i /Users/rameshkumar/Downloads/opinionweb.pem ubuntu@13.233.97.30

# Check PM2 status
ssh -i /Users/rameshkumar/Downloads/opinionweb.pem ubuntu@13.233.97.30 'pm2 status'

# View logs
ssh -i /Users/rameshkumar/Downloads/opinionweb.pem ubuntu@13.233.97.30 'pm2 logs'

# Restart apps
ssh -i /Users/rameshkumar/Downloads/opinionweb.pem ubuntu@13.233.97.30 'pm2 restart all'
```

---

## 🐛 Troubleshooting

### GitHub Push Fails
```bash
# If authentication fails, use Personal Access Token
# Generate token: GitHub → Settings → Developer settings → Personal access tokens
# Use token as password when prompted
```

### SSH Connection Timeout
```bash
# Check EC2 security group allows port 22
# Verify correct IP address
# Try with verbose: ssh -v -i key.pem ubuntu@IP
```

### Deployment Fails
```bash
# Check logs
./deploy-from-github.sh 2>&1 | tee deployment.log

# SSH manually and check
ssh -i /Users/rameshkumar/Downloads/opinionweb.pem ubuntu@13.233.97.30
cd /home/ubuntu/opinion-poll
pm2 logs
```

### Website Not Loading
```bash
# Check if services are running
pm2 status

# Check Nginx
sudo systemctl status nginx

# Check backend API
curl http://localhost:5001/api/health
```

---

## ✅ Current Status

- [x] Git repository initialized
- [x] Initial commit created  
- [x] GitHub README prepared
- [x] Deployment script created
- [ ] **Next: Create GitHub repository**
- [ ] **Next: Push code to GitHub**
- [ ] **Next: Deploy to EC2**

---

## 📞 Need Help?

If you encounter issues:
1. Check the error message carefully
2. Verify security group settings
3. Confirm SSH key is correct
4. Check GitHub repository URL
5. Review deployment logs

**Ready to proceed? Start with Step 1: Create GitHub Repository!**
