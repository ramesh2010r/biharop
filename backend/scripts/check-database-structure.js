const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function checkDatabaseStructure() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'opinion_poll'
    });
    
    console.log('🔗 Connected to database');
    
    // Check what tables exist
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('\n📋 Available tables:');
    tables.forEach(table => {
      console.log(`  ${Object.values(table)[0]}`);
    });
    
    // Check Parties table structure
    console.log('\n📋 Parties table structure:');
    try {
      const [partiesStructure] = await connection.execute('DESCRIBE Parties');
      partiesStructure.forEach(col => {
        console.log(`  ${col.Field}: ${col.Type}`);
      });
      
      // Show actual data
      const [partiesData] = await connection.execute('SELECT * FROM Parties LIMIT 5');
      console.log('\n📋 Sample parties data:');
      console.log(partiesData);
      
    } catch (error) {
      console.log('❌ Parties table error:', error.message);
    }
    
    // Check Constituencies table structure
    console.log('\n🗳️ Constituencies table structure:');
    try {
      const [constStructure] = await connection.execute('DESCRIBE Constituencies');
      constStructure.forEach(col => {
        console.log(`  ${col.Field}: ${col.Type}`);
      });
      
      // Show actual data
      const [constData] = await connection.execute('SELECT * FROM Constituencies LIMIT 5');
      console.log('\n🗳️ Sample constituencies data:');
      console.log(constData);
      
    } catch (error) {
      console.log('❌ Constituencies table error:', error.message);
    }
    
    // Check Candidates table structure
    console.log('\n👥 Candidates table structure:');
    try {
      const [candStructure] = await connection.execute('DESCRIBE Candidates');
      candStructure.forEach(col => {
        console.log(`  ${col.Field}: ${col.Type}`);
      });
      
      // Count candidates
      const [candCount] = await connection.execute('SELECT COUNT(*) as count FROM Candidates');
      console.log(`\n👥 Total candidates: ${candCount[0].count}`);
      
    } catch (error) {
      console.log('❌ Candidates table error:', error.message);
    }
    
    await connection.end();
    
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
  }
}

checkDatabaseStructure();