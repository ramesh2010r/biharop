const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

async function createDefaultAdmin() {
  let connection;
  
  try {
    // Create database connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'bihar_opinion_poll',
      port: process.env.DB_PORT || 3306
    });

    console.log('✓ Connected to database');

    // Check if admin table exists
    const [tables] = await connection.query(
      "SHOW TABLES LIKE 'Admins'"
    );

    if (tables.length === 0) {
      console.log('Creating Admins table...');
      await connection.query(`
        CREATE TABLE Admins (
          admin_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
          username VARCHAR(100) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          role ENUM('superadmin', 'manager') DEFAULT 'manager',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('✓ Admins table created');
    }

    // Check if admin already exists
    const [existingAdmins] = await connection.query(
      'SELECT * FROM Admins WHERE username = ?',
      ['adminuser']
    );

    if (existingAdmins.length > 0) {
      console.log('⚠️  Admin user already exists');
      console.log('Username: adminuser');
      console.log('\nTo reset password, delete the admin user and run this script again.');
      await connection.end();
      process.exit(0);
    }

    // Create default admin
    const defaultPassword = 'Test@123';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    await connection.query(
      'INSERT INTO Admins (username, password_hash, role) VALUES (?, ?, ?)',
      ['adminuser', hashedPassword, 'Super Admin']
    );

    console.log('\n✅ Admin user created successfully!');
    console.log('═══════════════════════════════════════');
    console.log('Username: adminuser');
    console.log('Password: Test@123');
    console.log('Role: Super Admin');
    console.log('═══════════════════════════════════════');
    console.log('\n⚠️  IMPORTANT: Keep these credentials secure!');
    console.log('Login at: http://localhost:3000/admin\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the script
createDefaultAdmin();
