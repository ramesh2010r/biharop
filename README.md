# Bihar Election Opinion Poll 2025
## बिहार चुनाव जनमत सर्वेक्षण 2025

A compliance-first web application for conducting anonymous opinion polls for the Bihar Assembly Election 2025, with automatic adherence to ECI (Election Commission of India) regulations.

## 🎯 Project Overview

This platform allows citizens to anonymously express their opinion for the November 2025 Bihar Assembly Election while ensuring 100% compliance with the Election Commission of India's Model Code of Conduct, specifically the 48-hour "silent period" (Section 126 of the R.P. Act, 1951).

### Key Features

- ✅ **ECI Compliance**: Automatic blackout enforcement during 48-hour silent periods
- 🔒 **Anonymous Voting**: No personal information collected
- 🛡️ **Duplicate Prevention**: Hybrid system using device fingerprinting and IP tracking
- 📊 **Real-time Results**: Pre-aggregated data for instant result display
- 🎨 **Indian Government UI**: Design based on UX4G Design System
- 🌐 **Bilingual**: Hindi (primary) and English support
- 🚀 **High Performance**: Optimized for millions of concurrent users

## 🏗️ Technology Stack

### Frontend
- **Framework**: Next.js 14+ (React 18+)
- **Styling**: Tailwind CSS with custom Indian Government theme
- **Language**: TypeScript
- **Fonts**: Noto Sans Devanagari for Hindi text

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL with InnoDB engine
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate Limiting

### Database Schema Highlights
- **Opinions Table**: High-traffic write operations
- **Results_Summary Table**: Pre-aggregated data for fast reads
- **Election_Phases Table**: Manages blackout periods automatically

## 📁 Project Structure

```
opinion-pole/
├── src/                          # Frontend (Next.js)
│   ├── app/                      # App Router pages
│   │   ├── page.tsx              # Welcome page
│   │   ├── vote/                 # Voting page
│   │   ├── confirmation/         # Confirmation page
│   │   └── results/              # Results dashboard
│   └── components/               # React components
│       ├── WelcomePage.tsx
│       ├── VotingPage.tsx
│       ├── ConfirmationPage.tsx
│       ├── ResultsPage.tsx
│       └── DisclaimerBanner.tsx
├── backend/                      # Backend API
│   ├── config/
│   │   └── database.js           # MySQL connection pool
│   ├── routes/
│   │   ├── districts.js
│   │   ├── constituencies.js
│   │   ├── candidates.js
│   │   ├── vote.js
│   │   ├── results.js
│   │   ├── compliance.js
│   │   └── admin.js
│   ├── services/
│   │   └── complianceEngine.js   # ECI blackout logic
│   ├── middleware/
│   │   └── auth.js               # JWT authentication
│   ├── database/
│   │   └── schema.sql            # Database schema
│   └── server.js                 # Main server file
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- MySQL 8.0+
- Git

### Installation

1. **Clone the repository**
   ```bash
   cd /path/to/your/workspace
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Set up the database**
   
   Create a MySQL database:
   ```sql
   CREATE DATABASE bihar_election_poll CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

   Import the schema:
   ```bash
   mysql -u root -p bihar_election_poll < backend/database/schema.sql
   ```

5. **Configure environment variables**
   
   Copy the example environment file:
   ```bash
   cp backend/.env.example backend/.env
   ```

   Edit `backend/.env` with your configuration:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=bihar_election_poll
   DB_PORT=3306
   PORT=5000
   JWT_SECRET=your_super_secret_key_change_this
   FRONTEND_URL=http://localhost:3000
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   npm run backend:dev
   ```
   The API will be available at `http://localhost:5000`

2. **Start the frontend (in a new terminal)**
   ```bash
   npm run dev
   ```
   The website will be available at `http://localhost:3000`

## 🔐 Admin Panel

### Default Credentials
- **Username**: `admin`
- **Password**: `admin123` (⚠️ Change this immediately in production!)

### Admin Features
- Manage election phases and blackout periods
- Add/edit/delete districts, constituencies, parties, and candidates
- View real-time statistics
- Manual blackout override for emergencies

### API Endpoints

#### Public Endpoints
- `GET /api/districts` - List all districts
- `GET /api/constituencies/:districtId` - List constituencies in a district
- `GET /api/candidates/:constituencyId` - List candidates in a constituency
- `POST /api/vote` - Submit a vote
- `GET /api/results/:constituencyId` - Get results (respects blackout)
- `GET /api/blackout-status` - Check if blackout is active

#### Admin Endpoints (Require Authentication)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/stats` - Get statistics
- `GET /api/admin/phases` - List election phases
- `POST /api/admin/phases` - Add election phase
- `PUT /api/admin/phases/:id` - Update phase
- `DELETE /api/admin/phases/:id` - Delete phase
- `POST /api/admin/districts` - Add district
- `POST /api/admin/parties` - Add party
- `POST /api/admin/candidates` - Add candidate

## 📊 Database Optimization Strategy

### The Two-Table Approach

**Opinions Table** (Write-Heavy)
- Logs every single vote with fingerprint and IP
- Indexed for fast duplicate checking

**Results_Summary Table** (Read-Heavy)
- Pre-aggregated vote counts per candidate
- Updated atomically with each vote using `ON DUPLICATE KEY UPDATE`
- Provides instant results without expensive `COUNT(*)` queries

This architecture ensures:
- ⚡ Instant result display even with millions of votes
- 🔒 Effective duplicate vote prevention
- 📈 Linear scalability

## 🛡️ ECI Compliance Implementation

### Regulatory Compliance Engine

The `complianceEngine.js` service:
1. Calculates 48-hour blackout periods automatically
2. Checks current server time against active phases
3. Returns blackout status to frontend
4. Blocks result API if within blackout period

### How It Works

1. Admin enters poll end datetime for each phase
2. System automatically calculates blackout start (48 hours before)
3. During blackout: Results API returns `{ status: 'blackout_active' }`
4. Frontend displays compliance notice instead of results
5. After polling ends: Results become available automatically

## 🎨 UI/UX Design

Based on the UX4G Design System 2.0 (Indian Government):
- Saffron, white, and green color scheme
- Noto Sans Devanagari font for Hindi text
- Accessible and mobile-responsive
- Clear visual hierarchy

## 🔒 Security Features

- **Rate Limiting**: Prevents API abuse
- **Helmet.js**: Sets security headers
- **CORS**: Restricts cross-origin requests
- **JWT Authentication**: Secure admin access
- **Bcrypt**: Password hashing
- **Input Validation**: Prevents SQL injection

## 📱 User Flow

1. **Welcome Page** → Carousel, disclaimer, "Give Opinion" button
2. **Voting Page** → Select District → Constituency → Candidate → Submit
3. **Confirmation Page** → Success message, link to results
4. **Results Page** → Live results OR blackout notice

## 🚀 Production Deployment

### Database Optimization
1. Enable MySQL query cache
2. Set up read replicas for result queries
3. Implement Redis caching for Results_Summary
4. Monitor and optimize slow queries

### Server Optimization
1. Use PM2 for process management
2. Set up load balancer (Nginx)
3. Enable Gzip compression
4. Use CDN for static assets

### Security Checklist
- [ ] Change default admin password
- [ ] Update JWT secret
- [ ] Enable HTTPS
- [ ] Set up firewall rules
- [ ] Configure backup strategy
- [ ] Enable MySQL binary logging

## 📝 License

MIT License - Feel free to use this project for educational purposes.

## 🤝 Contributing

This is an educational project. Contributions are welcome!

## ⚠️ Disclaimer

This is an independent opinion poll and is NOT affiliated with the Election Commission of India. Results reflect public opinion only and should not be considered official election predictions.

---

**Developed with ❤️ for transparent democracy in Bihar**
