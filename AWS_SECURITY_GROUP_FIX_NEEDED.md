# 🚨 Cloudflare Error 521 - AWS Security Group Fix Required

**Date:** October 23, 2025  
**Current Status:** 🔴 **BLOCKED BY AWS SECURITY GROUP**  
**Issue:** Cloudflare cannot reach Server 3 (Load Balancer)

---

## 🔍 Diagnosis Complete

### What's Confirmed Working ✅
- ✅ Nginx is running on Server 3 (port 80)
- ✅ Load balancer configuration is correct
- ✅ Server 2 and Server 3 backends are online
- ✅ Direct HTTP access works: `http://65.2.142.131`
- ✅ Cloudflare proxy is enabled (orange cloud 🟠)
- ✅ DNS points to correct IP: 65.2.142.131

### What's Broken ❌
- ❌ Cloudflare cannot connect to origin server
- ❌ AWS Security Group is blocking Cloudflare IPs
- ❌ Error 521: "Web server is down" (but it's not down, just blocked)

### Error Details
```bash
curl -I https://opinionpoll.co.in
# HTTP/2 521
# server: cloudflare
# cf-ray: 992b8cc2e937e1f8-MRS
```

This means:
- Cloudflare IS proxying (proxy enabled ✅)
- Cloudflare CANNOT reach origin (firewall blocked ❌)

---

## 🛡️ The Root Cause

**AWS Security Groups** control which IPs can connect to your EC2 instances.

### Current Situation
```
Cloudflare IPs → [AWS Security Group BLOCKS] → Server 3 (65.2.142.131:80)
                          ❌
```

### What Needs to Happen
```
Cloudflare IPs → [AWS Security Group ALLOWS] → Server 3 (65.2.142.131:80)
                          ✅
```

---

## 🔧 How to Fix (AWS Console - 10 minutes)

### Step 1: Go to AWS EC2 Console

1. **Open AWS Console:**
   - Go to: https://console.aws.amazon.com/ec2/
   - Make sure you're in the correct region: **ap-south-1** (Mumbai)

2. **Find Your Instance:**
   - Click: **Instances** (left sidebar)
   - Look for: IP **65.2.142.131** or name your Server 3

### Step 2: Locate Security Group

1. **Click on the instance** (65.2.142.131)
2. **Scroll down** to the instance details
3. **Click on the "Security" tab**
4. **Find "Security groups"** section
5. **Click on the security group name** (e.g., "launch-wizard-1" or similar)

### Step 3: Edit Inbound Rules

1. **You'll see a list of inbound rules**
2. **Click: "Edit inbound rules"** button (bottom right)
3. **Current rules probably look like:**
   ```
   Type        Protocol    Port    Source
   SSH         TCP         22      0.0.0.0/0
   Custom TCP  TCP         3000    Your IP only
   Custom TCP  TCP         5001    Your IP only
   ```

### Step 4: Add HTTP Rule for All IPs

**Click: "Add rule"**

Configure the new rule:
```
Type: HTTP
Protocol: TCP
Port Range: 80
Source: 0.0.0.0/0 (Anywhere-IPv4)
Description: Allow HTTP from internet (Cloudflare)
```

**Click: "Add rule" again**

Add IPv6 rule:
```
Type: HTTP
Protocol: TCP  
Port Range: 80
Source: ::/0 (Anywhere-IPv6)
Description: Allow HTTP from internet IPv6
```

### Step 5: Save Rules

1. **Click: "Save rules"** (bottom right)
2. **Wait 10-20 seconds** for AWS to apply changes
3. **Done!**

---

## 🎯 Alternative: Allow Only Cloudflare IPs (More Secure)

Instead of allowing all IPs (0.0.0.0/0), you can restrict to **only Cloudflare IPs**:

### Cloudflare IPv4 Ranges
Add each of these as separate rules:
```
Type: HTTP, Port: 80, Source: 173.245.48.0/20
Type: HTTP, Port: 80, Source: 103.21.244.0/22
Type: HTTP, Port: 80, Source: 103.22.200.0/22
Type: HTTP, Port: 80, Source: 103.31.4.0/22
Type: HTTP, Port: 80, Source: 141.101.64.0/18
Type: HTTP, Port: 80, Source: 108.162.192.0/18
Type: HTTP, Port: 80, Source: 190.93.240.0/20
Type: HTTP, Port: 80, Source: 188.114.96.0/20
Type: HTTP, Port: 80, Source: 197.234.240.0/22
Type: HTTP, Port: 80, Source: 198.41.128.0/17
Type: HTTP, Port: 80, Source: 162.158.0.0/15
Type: HTTP, Port: 80, Source: 104.16.0.0/13
Type: HTTP, Port: 80, Source: 104.24.0.0/14
Type: HTTP, Port: 80, Source: 172.64.0.0/13
Type: HTTP, Port: 80, Source: 131.0.72.0/22
```

**Note:** This is more secure but requires more rules. For simplicity, using `0.0.0.0/0` is fine since you're using Cloudflare proxy.

---

## ✅ After Fixing Security Group

### Test Immediately
```bash
# Wait 20-30 seconds after saving, then test:
curl -I https://opinionpoll.co.in

# Expected result:
HTTP/2 200 
server: cloudflare
cf-ray: xxxxx
✅ Success!
```

### Open in Browser
```
https://opinionpoll.co.in
```

Should load with:
- ✅ Green padlock (SSL)
- ✅ Fast loading
- ✅ Full website content

---

## 📊 Expected Security Group After Fix

Your Server 3 Security Group should have these inbound rules:

| Type | Protocol | Port | Source | Description |
|------|----------|------|--------|-------------|
| SSH | TCP | 22 | Your IP | SSH access |
| HTTP | TCP | 80 | 0.0.0.0/0 | Web traffic (Cloudflare) |
| Custom | TCP | 3000 | 43.204.230.163/32 | Server 2 can reach frontend |
| Custom | TCP | 5001 | 43.204.230.163/32 | Server 2 can reach backend |

---

## 🧪 Verification Steps

### Step 1: Check Direct Access (Should Still Work)
```bash
curl http://65.2.142.131
# Status: 200 OK ✅
```

### Step 2: Check via Cloudflare (Should Work After Fix)
```bash
curl -I https://opinionpoll.co.in
# HTTP/2 200 ✅
# server: cloudflare ✅
```

### Step 3: Check Nginx Logs (Should See Cloudflare IPs)
```bash
ssh -i ~/Downloads/key2.pem ec2-user@65.2.142.131 \
  "sudo tail -f /var/log/nginx/opinionpoll-access.log"

# Should see entries like:
# 172.67.x.x - - [date] "GET / HTTP/1.1" 200
# 104.21.x.x - - [date] "GET /api/... HTTP/1.1" 200
```

### Step 4: Browser Test
```
Open: https://opinionpoll.co.in
Should load completely with SSL certificate
```

---

## 📸 Visual Guide: AWS Console Steps

### 1. EC2 Dashboard
```
AWS Console → Services → EC2 → Instances
```

### 2. Select Instance
```
Click on instance with IP: 65.2.142.131
```

### 3. Security Tab
```
Scroll down → Click "Security" tab
```

### 4. Security Group
```
Under "Security groups" → Click the sg-xxxxx link
```

### 5. Edit Rules
```
Click "Edit inbound rules" button
```

### 6. Add HTTP Rule
```
Click "Add rule"
Type: HTTP
Port: 80
Source: 0.0.0.0/0
Save rules
```

---

## 🚨 Important Notes

### Why This Happened
- AWS EC2 instances have **Security Groups** (like a firewall)
- By default, most ports are closed
- You likely opened port 22 (SSH) manually
- Port 80 (HTTP) was never opened for public access
- Your direct IP tests worked because you were testing from your own IP

### Why We Need Port 80 Open
- Cloudflare connects to your server using HTTP (port 80)
- Cloudflare provides HTTPS to users
- Your server only needs HTTP enabled
- This is called "Flexible SSL" in Cloudflare

### Security Considerations
- Opening port 80 to 0.0.0.0/0 is **SAFE** because:
  - Cloudflare proxy protects your origin IP
  - Only Cloudflare IPs will actually connect
  - DDoS protection from Cloudflare
  - Rate limiting from Cloudflare
  
- If you want extra security:
  - Use the Cloudflare IP ranges only
  - Keep Cloudflare proxy enabled (orange cloud)
  - Never expose your origin IP

---

## 🔄 What Happens After Fix

### Immediate (0-30 seconds)
```
AWS applies security group rules
Port 80 becomes accessible from Cloudflare IPs
```

### Within 1 minute
```
Cloudflare successfully connects to origin
Error 521 disappears
HTTPS starts working
```

### Within 5 minutes
```
All Cloudflare edge servers updated
Site accessible worldwide
Full HTTPS with green padlock
```

---

## 🆘 Troubleshooting

### If Still Error 521 After Opening Port 80

1. **Wait 60 seconds** - AWS takes time to apply rules

2. **Verify rule was added:**
   - Go back to Security Group
   - Confirm HTTP port 80 rule exists
   - Source should be 0.0.0.0/0

3. **Test direct access:**
   ```bash
   curl http://65.2.142.131
   # Should work
   ```

4. **Purge Cloudflare cache:**
   - Cloudflare Dashboard → Caching
   - Click "Purge Everything"
   - Wait 2 minutes
   - Test again

5. **Check Cloudflare SSL mode:**
   - SSL/TLS → Overview
   - Should be: **Flexible**
   - If not, change it and wait 2 minutes

### If You Can't Find Security Groups

1. **Make sure you're in the right region:**
   - Top right of AWS Console
   - Should show: ap-south-1 (Mumbai)

2. **Look for "Network & Security":**
   - In EC2 left sidebar
   - Click "Security Groups"
   - Find the one attached to your instance

---

## ✅ Success Indicators

You'll know it's working when:

### Command Line
```bash
$ curl -I https://opinionpoll.co.in

HTTP/2 200  ← Success!
server: cloudflare  ← Going through Cloudflare
cf-ray: xxxxx  ← Cloudflare is proxying
```

### Browser
- https://opinionpoll.co.in loads
- Green padlock visible
- No certificate errors
- Page loads in < 2 seconds

### Nginx Logs (Server 3)
```bash
# Shows Cloudflare IPs connecting:
172.67.x.x - - "GET /" 200
104.21.x.x - - "GET /api/predictions" 200
```

---

## 📋 Quick Checklist

- [ ] Logged into AWS Console
- [ ] Found EC2 instance (65.2.142.131)
- [ ] Located Security Group
- [ ] Clicked "Edit inbound rules"
- [ ] Added HTTP rule (port 80, source 0.0.0.0/0)
- [ ] Saved rules
- [ ] Waited 30 seconds
- [ ] Tested: `curl -I https://opinionpoll.co.in`
- [ ] Opened browser: https://opinionpoll.co.in
- [ ] Site loads with HTTPS ✅

---

## 🎯 Current Architecture (Will Work After Fix)

```
┌─────────────────────────────────────┐
│         Internet Users              │
│    https://opinionpoll.co.in        │
└──────────────┬──────────────────────┘
               │ HTTPS (443)
               ▼
┌─────────────────────────────────────┐
│      Cloudflare CDN (Global)        │
│  - SSL/TLS Termination              │
│  - DDoS Protection                  │
│  - Caching                          │
└──────────────┬──────────────────────┘
               │ HTTP (80)
               ▼
┌─────────────────────────────────────┐
│   [AWS Security Group]              │
│   Must Allow: Port 80 from 0.0.0.0/0│ ← FIX THIS
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Server 3: Load Balancer            │
│  IP: 65.2.142.131                   │
│  Nginx on port 80                   │
└──────────────┬──────────────────────┘
               │
        ┌──────┴──────┐
        ▼             ▼
┌────────────┐  ┌────────────┐
│  Server 2  │  │  Server 3  │
│  :3000     │  │  :3000     │
└────────────┘  └────────────┘
```

---

**Status:** 🔴 **BLOCKED - AWS SECURITY GROUP FIX REQUIRED**  
**Action:** Open port 80 in AWS Security Group for instance 65.2.142.131  
**Time:** 10 minutes (AWS Console navigation + rule addition)  
**After Fix:** HTTPS will work immediately (30 seconds propagation)

**The servers are ready, Cloudflare is ready, just need to open the door (port 80)!** 🚪
