const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'bihar_poll'
    });

    console.log('Connected to database\n');

    // Check Opinions table
    console.log('=== Opinions Table ===');
    const [opinions] = await connection.query('DESCRIBE Opinions');
    console.log(JSON.stringify(opinions.map(r => r.Field), null, 2));

    // Check if there's any data
    const [opinionCount] = await connection.query('SELECT COUNT(*) as count FROM Opinions');
    console.log(`\nTotal votes: ${opinionCount[0].count}\n`);

    // Check Election_Phases table
    console.log('=== Election_Phases Table ===');
    const [phases] = await connection.query('DESCRIBE Election_Phases');
    console.log(JSON.stringify(phases.map(r => r.Field), null, 2));

    await connection.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkDatabase();
