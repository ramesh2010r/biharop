# Quick Reference Card - Load Balanced Architecture

## 🚀 Quick Access

### SSH into Servers
```bash
# Server 1 (Master + DB)
ssh -i ~/Downloads/ooop.pem ec2-user@15.206.160.149

# Server 2 (Backend Node)
ssh -i ~/Downloads/key2.pem ubuntu@43.204.230.163

# Server 3 (Load Balancer)
ssh -i ~/Downloads/key2.pem ec2-user@65.2.142.131
```

### Check All Servers Status (One Command)
```bash
echo "=== SERVER 1 ===" && ssh -i ~/Downloads/ooop.pem ec2-user@15.206.160.149 "pm2 list" && \
echo "=== SERVER 2 ===" && ssh -i ~/Downloads/key2.pem ubuntu@43.204.230.163 "pm2 list" && \
echo "=== SERVER 3 ===" && ssh -i ~/Downloads/key2.pem ec2-user@65.2.142.131 "pm2 list && sudo systemctl status nginx | grep Active"
```

---

## 🌐 URLs

| Purpose | URL | Status |
|---------|-----|--------|
| **Load Balancer (Production)** | http://65.2.142.131 | ✅ Active |
| Health Check | http://65.2.142.131/health | ✅ Active |
| Server 1 Direct | http://15.206.160.149:3000 | ✅ Active |
| Server 2 Direct | http://43.204.230.163:3000 | ✅ Active |
| Server 3 Direct | http://65.2.142.131:3000 | ✅ Active |

---

## 🔧 Common Commands

### PM2 Management
```bash
# List all processes
pm2 list

# Restart a service
pm2 restart backend-server2
pm2 restart frontend-server2

# View logs
pm2 logs backend-server2
pm2 logs frontend-server2 --lines 50

# Stop/Start
pm2 stop frontend-server2
pm2 start frontend-server2

# Check process details
pm2 info backend-server2

# Save PM2 config
pm2 save
```

### Nginx Management (Server 3 Only)
```bash
# Check status
sudo systemctl status nginx

# Restart Nginx
sudo systemctl restart nginx

# Reload config (no downtime)
sudo systemctl reload nginx

# Test config before applying
sudo nginx -t

# View logs
sudo tail -f /var/log/nginx/opinionpoll-access.log
sudo tail -f /var/log/nginx/opinionpoll-error.log

# Edit config
sudo nano /etc/nginx/conf.d/opinionpoll.conf
```

### MySQL Management (Server 1 Only)
```bash
# Check MySQL status
sudo systemctl status mariadb

# Access MySQL
sudo mysql bihar_opinion_poll

# Quick stats
sudo mysql -e "SELECT COUNT(*) AS total_votes FROM bihar_opinion_poll.Opinions;"
sudo mysql -e "SELECT COUNT(*) AS total_candidates FROM bihar_opinion_poll.Candidates;"

# Check remote connections
sudo mysql -e "SELECT User, Host FROM mysql.user WHERE User='opinion_poll_user';"
```

---

## 📊 Monitoring

### Check Server Health
```bash
# CPU and Memory
top
htop

# Disk usage
df -h

# Network connections
netstat -tulpn | grep LISTEN
```

### Test Load Balancer
```bash
# Health check
curl http://65.2.142.131/health

# Response time test
for i in {1..10}; do curl -o /dev/null -s -w "Request $i: %{time_total}s\n" http://65.2.142.131/; done

# Check which server handled request
for i in {1..10}; do curl -s http://65.2.142.131/api/compliance/status | head -n 1; done
```

---

## 🔄 Deployment Updates

### Update Code on All Servers
```bash
# Server 1
ssh -i ~/Downloads/ooop.pem ec2-user@15.206.160.149 << 'EOF'
cd ~/biharop
git pull origin main
npm install
cd backend && npm install && cd ..
npm run build
pm2 restart backend-api opinion-poll
EOF

# Server 2
ssh -i ~/Downloads/key2.pem ubuntu@43.204.230.163 << 'EOF'
cd ~/opinion-poll
git pull origin main
npm install
cd backend && npm install && cd ..
npm run build
pm2 restart backend-server2 frontend-server2
EOF

# Server 3
ssh -i ~/Downloads/key2.pem ec2-user@65.2.142.131 << 'EOF'
cd ~/opinion-poll
git pull origin main
npm install
cd backend && npm install && cd ..
npm run build
pm2 restart backend-server3 frontend-server3
EOF
```

---

## 🆘 Emergency Procedures

### If Server Goes Down
1. **Check if PM2 process crashed:**
   ```bash
   pm2 list
   pm2 restart all
   ```

2. **Check if server is reachable:**
   ```bash
   curl http://SERVER_IP:3000
   ```

3. **Check logs for errors:**
   ```bash
   pm2 logs --err
   sudo tail -f /var/log/nginx/opinionpoll-error.log
   ```

### If Load Balancer Returns 502
1. **Verify upstream servers are running:**
   ```bash
   curl http://15.206.160.149:3000
   curl http://43.204.230.163:3000
   curl http://65.2.142.131:3000
   ```

2. **Check Nginx config and reload:**
   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

3. **Temporarily remove failing server:**
   ```bash
   sudo nano /etc/nginx/conf.d/opinionpoll.conf
   # Comment out the failing server line
   sudo systemctl reload nginx
   ```

### If Database Connection Fails
1. **Check MySQL is running:**
   ```bash
   ssh -i ~/Downloads/ooop.pem ec2-user@15.206.160.149 "sudo systemctl status mariadb"
   ```

2. **Restart MySQL if needed:**
   ```bash
   ssh -i ~/Downloads/ooop.pem ec2-user@15.206.160.149 "sudo systemctl restart mariadb"
   ```

3. **Test connection from failing server:**
   ```bash
   mysql -h 15.206.160.149 -u opinion_poll_user -pBiharPoll2025Secure bihar_opinion_poll -e "SELECT 1;"
   ```

---

## 📈 Performance Tuning

### Increase PM2 Cluster Size (if needed)
```bash
# Stop current process
pm2 delete frontend-server2

# Start in cluster mode with 2 instances
pm2 start npm --name frontend-server2 -i 2 -- start

# Save config
pm2 save
```

### Adjust Nginx Worker Processes
```bash
# Edit main Nginx config
sudo nano /etc/nginx/nginx.conf

# Set worker_processes to number of CPU cores
worker_processes auto;

# Reload
sudo systemctl reload nginx
```

---

## 🔐 Security

### Check Firewall Status
```bash
# Ubuntu (Server 2)
sudo ufw status

# Amazon Linux (Server 1, 3) - uses AWS Security Groups
# Check with AWS Console or CLI
```

### Review MySQL Access
```bash
sudo mysql -e "SELECT User, Host FROM mysql.user;"
sudo mysql -e "SHOW GRANTS FOR 'opinion_poll_user'@'43.204.230.163';"
```

---

## 📝 Important Files

### Server 1 (15.206.160.149)
- Backend: `~/biharop/backend/server.js`
- Frontend: `~/biharop/`
- Database: `/var/lib/mysql/`
- Env: `~/biharop/backend/.env`

### Server 2 (43.204.230.163)
- Backend: `~/opinion-poll/backend/server.js`
- Frontend: `~/opinion-poll/`
- Env Backend: `~/opinion-poll/backend/.env`
- Env Frontend: `~/opinion-poll/.env.local`

### Server 3 (65.2.142.131)
- Backend: `~/opinion-poll/backend/server.js`
- Frontend: `~/opinion-poll/`
- Nginx Config: `/etc/nginx/conf.d/opinionpoll.conf`
- Nginx Main: `/etc/nginx/nginx.conf`
- Env Backend: `~/opinion-poll/backend/.env`
- Env Frontend: `~/opinion-poll/.env.local`

---

## 🎯 Next Steps After DNS Update

1. **Update DNS to Load Balancer**
   ```
   A Record: opinionpoll.co.in → 65.2.142.131
   A Record: www.opinionpoll.co.in → 65.2.142.131
   TTL: 300 seconds
   ```

2. **Install SSL Certificate**
   ```bash
   ssh -i ~/Downloads/key2.pem ec2-user@65.2.142.131
   sudo yum install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d opinionpoll.co.in -d www.opinionpoll.co.in
   ```

3. **Update Frontend .env on All Servers**
   ```
   NEXT_PUBLIC_API_URL=https://opinionpoll.co.in/api
   ```

4. **Enable HTTPS Redirect in Nginx**
   (Certbot does this automatically)

---

## 📞 Quick Stats

```bash
# Get current vote count
ssh -i ~/Downloads/ooop.pem ec2-user@15.206.160.149 "sudo mysql bihar_opinion_poll -e 'SELECT COUNT(*) AS votes FROM Opinions;'"

# Get alliance standings
ssh -i ~/Downloads/ooop.pem ec2-user@15.206.160.149 "curl -s http://localhost:5001/api/predictions | grep -o '\"name\":\"[^\"]*\",\"leadingIn\":[0-9]*' | head -n 4"

# Get server uptime
for server in "ooop.pem ec2-user@15.206.160.149" "key2.pem ubuntu@43.204.230.163" "key2.pem ec2-user@65.2.142.131"; do
    key=$(echo $server | awk '{print $1}')
    user_host=$(echo $server | awk '{print $2}')
    echo "=== $user_host ==="
    ssh -i ~/Downloads/$key $user_host "uptime"
done
```

---

## 🎉 System Status

| Component | Status | Details |
|-----------|--------|---------|
| Load Balancer | ✅ **ONLINE** | Nginx 1.28.0 on port 80 |
| Server 1 | ✅ **ONLINE** | Master + DB + Backend + Frontend |
| Server 2 | ✅ **ONLINE** | Backend + Frontend |
| Server 3 | ✅ **ONLINE** | LB + Backend + Frontend |
| MySQL Database | ✅ **ONLINE** | 2,951 votes, 906 candidates |
| PM2 Processes | ✅ **ALL RUNNING** | 6 processes across 3 servers |

---

**Last Updated:** October 22, 2025  
**Architecture:** 3-Server Load Balanced  
**Total Capacity:** ~1,500 concurrent users  
**Status:** ✅ **PRODUCTION READY**
