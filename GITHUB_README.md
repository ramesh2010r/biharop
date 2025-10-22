# 🗳️ Bihar Election Opinion Poll

A comprehensive web-based opinion poll platform for Bihar Assembly Elections built with Next.js, Express.js, and MySQL.

![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)
![Node.js](https://img.shields.io/badge/Node.js-20.x-green)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🚀 Features

### Frontend
- ✅ **Modern Next.js 15** with App Router
- ✅ **Bilingual Support** - Hindi & English
- ✅ **Responsive Design** - Works on all devices
- ✅ **Real-time Results** - Live vote aggregation
- ✅ **Admin Dashboard** - Complete management interface
- ✅ **Indian Government UI** - Tri-color theme

### Backend
- ✅ **Express.js API** - RESTful endpoints
- ✅ **MySQL Database** - Robust data storage
- ✅ **JWT Authentication** - Secure admin access
- ✅ **File Uploads** - Candidate photos, party symbols
- ✅ **Data Validation** - Input sanitization

### Election Features
- ✅ **542 Candidates** - Across 15 political parties
- ✅ **243 Constituencies** - All Bihar assembly seats
- ✅ **38 Districts** - Complete coverage
- ✅ **ECI Compliance** - 48-hour blackout period
- ✅ **Duplicate Prevention** - Device fingerprinting
- ✅ **Anonymous Voting** - Privacy-focused
- ✅ **Phase Management** - Multi-phase election support

## 📊 Database Statistics

- **Candidates**: 542
- **Constituencies**: 243
- **Districts**: 38
- **Parties**: 15
- **Reserved Seats**: SC: ~25, ST: ~2

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS |
| Backend | Node.js, Express.js, JWT |
| Database | MySQL 8.0 |
| Deployment | PM2, Nginx, AWS EC2/Oracle Cloud |
| Security | Helmet, CORS, bcrypt, JWT |

## 📋 Prerequisites

- Node.js 20.x or higher
- MySQL 8.0 or higher
- npm or yarn
- Git

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/bihar-opinion-poll.git
cd bihar-opinion-poll
```

### 2. Install Dependencies
```bash
# Frontend dependencies
npm install

# Backend dependencies
cd backend
npm install
cd ..
```

### 3. Setup Database
```bash
# Create MySQL database
mysql -u root -p

CREATE DATABASE bihar_opinion_poll;
CREATE USER 'opinionpoll'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON bihar_opinion_poll.* TO 'opinionpoll'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Import schema
cd backend
mysql -u opinionpoll -p bihar_opinion_poll < database/schema.sql
mysql -u opinionpoll -p bihar_opinion_poll < database/system_settings.sql
```

### 4. Configure Environment

**Backend `.env`:**
```bash
cd backend
cat > .env << EOF
PORT=5001
DB_HOST=localhost
DB_USER=opinionpoll
DB_PASSWORD=your_password
DB_NAME=bihar_opinion_poll
JWT_SECRET=$(openssl rand -hex 32)
NODE_ENV=development
EOF
```

**Frontend `.env.local`:**
```bash
cd ..
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:5001
EOF
```

### 5. Create Admin User
```bash
cd backend
node scripts/create-admin.js admin admin@example.com Admin@123
cd ..
```

### 6. Run Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 7. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001/api/health
- **Admin Panel**: http://localhost:3000/admin

**Admin Credentials:**
- Username: `admin`
- Password: `Admin@123`

## 📦 Production Deployment

### Option 1: AWS EC2 (Automated)
```bash
chmod +x deploy.sh
./deploy.sh
```

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

### Option 2: Oracle Cloud Free Tier
See [ORACLE_CLOUD_DEPLOYMENT.md](./ORACLE_CLOUD_DEPLOYMENT.md)

### Option 3: Docker
```bash
docker-compose up -d
```

## 📖 Documentation

- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Production deployment
- [Oracle Cloud Setup](./ORACLE_CLOUD_DEPLOYMENT.md) - Free tier hosting
- [Quick Start](./QUICKSTART.md) - Getting started guide
- [Admin Guide](./ADMIN_PHASE_CONSTITUENCY_GUIDE.md) - Admin features
- [ECI Compliance](./ECI_COMPLIANCE_SETTINGS_GUIDE.md) - Compliance settings
- [File Upload System](./FILE_UPLOAD_SYSTEM.md) - Upload configuration
- [Backup Guide](./README_BACKUP.md) - Backup & restore

## 🗂️ Project Structure

```
bihar-opinion-poll/
├── src/                          # Frontend source
│   ├── app/                      # Next.js App Router
│   │   ├── admin/               # Admin dashboard
│   │   ├── vote/                # Voting page
│   │   ├── results/             # Results page
│   │   └── api/                 # API routes
│   └── components/              # React components
│
├── backend/                      # Backend API
│   ├── routes/                  # Express routes
│   ├── services/                # Business logic
│   ├── middleware/              # Auth middleware
│   ├── database/                # SQL schemas
│   ├── scripts/                 # Utility scripts
│   └── server.js               # Entry point
│
├── public/                       # Static assets
│   └── images/                  # Party logos
│
├── deploy.sh                    # Deployment script
├── backup.sh                    # Backup script
└── docker-compose.yml           # Docker configuration
```

## 🔒 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ SQL injection prevention
- ✅ XSS protection
- ✅ Rate limiting
- ✅ Input validation

## 🎯 API Endpoints

### Public Endpoints
```
GET  /api/health                 # Health check
GET  /api/constituencies         # List constituencies
GET  /api/candidates/:id         # Get candidates
POST /api/vote                   # Submit vote
GET  /api/results                # Get results
GET  /api/compliance/status      # Check blackout status
```

### Admin Endpoints (Requires JWT)
```
POST /api/admin/login            # Admin login
GET  /api/admin/candidates       # All candidates
POST /api/admin/candidates       # Add candidate
PUT  /api/admin/candidates/:id   # Update candidate
DELETE /api/admin/candidates/:id # Delete candidate
GET  /api/admin/phases           # Election phases
POST /api/admin/phases           # Create phase
PUT  /api/admin/phases/:id       # Update phase
```

## 🛠️ Development Tools

```bash
# Run development
npm run dev

# Build for production
npm run build

# Start production
npm start

# Lint code
npm run lint

# Database backup
./backup.sh

# Import candidates from CSV
cd backend
node scripts/import-csv-validated-sync.js --sync
```

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Check MySQL is running
sudo systemctl status mysql

# Test connection
mysql -u opinionpoll -p bihar_opinion_poll -e "SELECT 1;"
```

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill

# Kill process on port 5001
lsof -ti:5001 | xargs kill
```

### PM2 Issues
```bash
# Check PM2 status
pm2 status

# Restart apps
pm2 restart all

# View logs
pm2 logs
```

## 📊 Performance

- **Load Time**: < 2s
- **API Response**: < 100ms
- **Database Queries**: Optimized with indexes
- **Concurrent Users**: Supports 1000+ users
- **Auto-scaling**: PM2 cluster mode ready

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - *Initial work*

## 🙏 Acknowledgments

- Election Commission of India for guidelines
- Bihar State Election Commission
- Next.js team for the amazing framework
- Open source community

## 📞 Support

For support, email admin@biharopinion.com or create an issue in GitHub.

## 🔮 Roadmap

- [ ] Mobile app (React Native)
- [ ] SMS voting integration
- [ ] Real-time analytics dashboard
- [ ] Multi-language support (Bhojpuri, Maithili)
- [ ] Exit poll predictions
- [ ] Social media integration
- [ ] Voice voting (accessibility)

## 📈 Project Status

✅ **Production Ready**

---

**Made with ❤️ for Bihar Elections**
