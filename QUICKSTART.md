# Quick Start Guide
## बिहार चुनाव जनमत सर्वेक्षण - शीघ्र प्रारंभ गाइड

Get your Bihar Election Opinion Poll up and running in minutes!

## Prerequisites

Make sure you have installed:
- ✅ Node.js 18+ ([Download](https://nodejs.org/))
- ✅ MySQL 8.0+ ([Download](https://dev.mysql.com/downloads/mysql/))
- ✅ Git ([Download](https://git-scm.com/downloads))

## Installation Steps

### Step 1: Setup Database

Run the automated setup script:

```bash
./setup.sh
```

This will:
- Create the MySQL database
- Import the schema with sample data
- Generate environment configuration

**OR** do it manually:

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE bihar_election_poll CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Use the database
USE bihar_election_poll;

# Import schema
source backend/database/schema.sql;

# Exit MySQL
exit;
```

### Step 2: Configure Environment

Create `backend/.env` file:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your MySQL credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=bihar_election_poll
JWT_SECRET=change_this_to_a_random_secret_key
```

### Step 3: Install Dependencies

Already done! But if needed:

```bash
# Frontend dependencies
npm install

# Backend dependencies
cd backend && npm install
```

### Step 4: Start the Application

**Option A: Run both servers separately**

Terminal 1 - Backend:
```bash
npm run backend:dev
```

Terminal 2 - Frontend:
```bash
npm run dev
```

**Option B: Using PM2 (Production)**

```bash
# Install PM2
npm install -g pm2

# Start backend
pm2 start backend/server.js --name "opinion-poll-api"

# Start frontend
pm2 start npm --name "opinion-poll-web" -- start

# View status
pm2 status
```

### Step 5: Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Admin Panel:** http://localhost:3000/admin

## Default Admin Credentials

```
Username: admin
Password: admin123
```

**⚠️ IMPORTANT:** Change these immediately in production!

## What's Included Out of the Box

### Sample Data
- ✅ 8 Districts (पटना, गया, भागलपुर, etc.)
- ✅ 6 Political Parties (BJP, RJD, JDU, INC, BSP, IND)
- ✅ 5 Constituencies in Patna district
- ✅ 4 Sample candidates in Patna Sahib

### Features Ready to Use
- ✅ Complete voting flow (District → Constituency → Candidate)
- ✅ Duplicate vote prevention
- ✅ Real-time results display
- ✅ ECI compliance engine (blackout management)
- ✅ Admin panel with authentication
- ✅ Bilingual interface (Hindi/English)

## Testing the Application

### 1. Test Voting Flow

1. Go to http://localhost:3000
2. Click "अपनी राय दें" (Give Your Opinion)
3. Select: पटना → पटना साहिब → (Any candidate)
4. Submit vote
5. See confirmation page

### 2. Test Results Display

1. Go to http://localhost:3000/results
2. Select: पटना → पटना साहिब
3. View the bar chart results

### 3. Test Admin Panel

1. Go to http://localhost:3000/admin
2. Login with default credentials
3. Test adding a new district or candidate

### 4. Test Blackout Functionality

Add an election phase via API:

```bash
# First, login to get token
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Use the token to add a phase
curl -X POST http://localhost:5000/api/admin/phases \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "phase_name": "Test Phase",
    "poll_end_datetime": "2025-10-10T17:00:00"
  }'
```

## Common Issues & Solutions

### Issue: Port 3000 already in use
```bash
# Find and kill the process
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

### Issue: Port 5000 already in use
```bash
# Find and kill the process
lsof -ti:5000 | xargs kill -9

# Or change in backend/.env
PORT=5001
```

### Issue: Database connection failed
```bash
# Check MySQL is running
mysql.server status

# Start MySQL if needed
mysql.server start

# Verify credentials in backend/.env
```

### Issue: Cannot login to admin
```bash
# Verify admin account exists
mysql -u root -p bihar_election_poll -e "SELECT * FROM Admins;"

# Reset password if needed
# Password for 'admin123'
mysql -u root -p bihar_election_poll -e "
UPDATE Admins 
SET password_hash = '\$2a\$10\$ZB8BvT.k5XjD8oXY7pXkCeQJ4eTLPGcN8tH7M3fIrLxZ9JYwFpY0C' 
WHERE username = 'admin';
"
```

## Next Steps

1. **Add Your Data**
   - Add all Bihar districts
   - Add all constituencies
   - Add all parties and candidates
   - Upload candidate photos

2. **Configure Election Phases**
   - Set up polling dates
   - System will automatically manage blackouts

3. **Customize UI**
   - Update colors in `tailwind.config.js`
   - Modify text in components
   - Add your logo

4. **Deploy to Production**
   - Follow deployment guide in README.md
   - Set up SSL certificate
   - Configure domain
   - Enable backups

## API Testing with Postman

Import this collection to test all endpoints:

```json
{
  "info": {
    "name": "Bihar Opinion Poll API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get Districts",
      "request": {
        "method": "GET",
        "url": "http://localhost:5000/api/districts"
      }
    },
    {
      "name": "Submit Vote",
      "request": {
        "method": "POST",
        "url": "http://localhost:5000/api/vote",
        "body": {
          "mode": "raw",
          "raw": "{\"constituency_id\":1,\"candidate_id\":1}"
        }
      }
    }
  ]
}
```

## Need Help?

- 📚 Read the full [README.md](./README.md)
- 📖 Check [ADMIN_GUIDE.md](./ADMIN_GUIDE.md) for admin features
- 🐛 Report issues on GitHub
- 💬 Contact support

## Performance Tips

- Use Redis for caching results
- Set up MySQL read replicas
- Enable CDN for static assets
- Monitor with PM2 or New Relic

---

**Happy Polling! शुभ मतदान!** 🗳️
