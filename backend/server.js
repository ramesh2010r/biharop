const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy - required for rate limiting behind nginx
app.set('trust proxy', 1);

// Response compression middleware - must be before routes
app.use(compression({
  level: 6, // Compression level (0-9, 6 is balanced)
  threshold: 1024, // Only compress responses larger than 1KB
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "img-src": ["'self'", "data:", "http://localhost:5001", "http://localhost:3000"],
    },
  },
}));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory (for uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'बहुत सारे अनुरोध। कृपया बाद में पुनः प्रयास करें।'
});
app.use('/api/', limiter);

// Import routes
const districtRoutes = require('./routes/districts');
const constituencyRoutes = require('./routes/constituencies');
const candidateRoutes = require('./routes/candidates');
const voteRoutes = require('./routes/vote');
const resultsRoutes = require('./routes/results');
const complianceRoutes = require('./routes/compliance');
const adminRoutes = require('./routes/admin');
const uploadRoutes = require('./routes/upload');
const settingsRoutes = require('./routes/settings');
const predictionsRoutes = require('./routes/predictions');

// API Routes
app.use('/api/districts', districtRoutes);
app.use('/api/constituencies', constituencyRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/vote', voteRoutes);
app.use('/api/predictions', predictionsRoutes); // Changed from /api/results to avoid conflict
app.use('/api/results', resultsRoutes);
app.use('/api/blackout-status', complianceRoutes);
app.use('/api/settings', settingsRoutes); // Public settings
app.use('/api/admin', adminRoutes);
app.use('/api/admin', settingsRoutes); // Admin settings
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Bihar Election Opinion Poll API',
    version: '1.0.0',
    endpoints: [
      '/api/health',
      '/api/districts',
      '/api/constituencies/:districtId',
      '/api/candidates/:constituencyId',
      '/api/vote',
      '/api/results/:constituencyId',
      '/api/blackout-status',
      '/api/admin/*'
    ]
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ 
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
app.listen(PORT, () => {
  console.log('=================================');
  console.log('Bihar Election Opinion Poll API');
  console.log('=================================');
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✓ API URL: http://localhost:${PORT}`);
  console.log('=================================');
});

module.exports = app;
