const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function checkParties() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'opinion_poll'
    });
    
    console.log('🔗 Connected to database');
    
    const [parties] = await connection.execute('SELECT * FROM Parties');
    console.log('\n📋 Current parties in database:');
    parties.forEach(party => {
      console.log(`  ID: ${party.party_id}, Name: ${party.name}, Abbrev: ${party.abbreviation}`);
    });
    
    const [constituencies] = await connection.execute('SELECT constituency_id, name FROM Constituencies LIMIT 10');
    console.log('\n🗳️ Sample constituencies:');
    constituencies.forEach(c => {
      console.log(`  ID: ${c.constituency_id}, Name: ${c.name}`);
    });
    
    await connection.end();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkParties();