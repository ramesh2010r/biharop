const mysql = require('mysql2/promise');
require('dotenv').config();

// Create optimized connection pool for better performance
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'bihar_election_poll',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 20, // Increased from 10 for better concurrency
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  maxIdle: 10, // Max idle connections
  idleTimeout: 60000, // 60 seconds idle timeout
  connectTimeout: 10000, // 10 seconds connection timeout
  timezone: '+00:00' // UTC timezone
});

// Test connection
pool.getConnection()
  .then(connection => {
    console.log('✓ Database connected successfully');
    connection.release();
  })
  .catch(err => {
    console.error('✗ Database connection failed:', err.message);
  });

module.exports = pool;
