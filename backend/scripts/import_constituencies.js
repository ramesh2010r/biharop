const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Parse CSV file
function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',');
  
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const row = {};
    headers.forEach((header, index) => {
      row[header.trim()] = values[index] ? values[index].trim() : '';
    });
    data.push(row);
  }
  
  return data;
}

async function importData() {
  let connection;
  
  try {
    // Read CSV file
    const csvPath = '/Users/rameshkumar/Downloads/bihar_constituencies.csv';
    console.log('📄 Reading CSV file...');
    const constituencies = parseCSV(csvPath);
    console.log(`✓ Found ${constituencies.length} constituencies in CSV`);
    
    // Connect to database
    console.log('\n🔌 Connecting to database...');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'bihar_election_poll',
      port: process.env.DB_PORT || 3306
    });
    console.log('✓ Database connected');
    
    // Start transaction
    await connection.beginTransaction();
    console.log('\n📝 Starting data import...\n');
    
    // Extract unique districts
    const districtMap = new Map();
    constituencies.forEach(row => {
      const districtName = row.district_hindi;
      if (!districtMap.has(districtName)) {
        districtMap.set(districtName, {
          name: districtName,
          constituencies: []
        });
      }
      districtMap.get(districtName).constituencies.push({
        seat_no: parseInt(row.seat_no),
        name: row.constituency_hindi
      });
    });
    
    console.log(`📍 Found ${districtMap.size} unique districts`);
    
    // Clear existing data
    console.log('\n🗑️  Clearing existing constituencies and districts...');
    await connection.query('SET FOREIGN_KEY_CHECKS=0');
    await connection.query('TRUNCATE TABLE Constituencies');
    await connection.query('TRUNCATE TABLE Districts');
    await connection.query('SET FOREIGN_KEY_CHECKS=1');
    console.log('✓ Tables cleared');
    
    // Insert districts and constituencies
    let districtCount = 0;
    let constituencyCount = 0;
    
    for (const [districtName, districtData] of districtMap) {
      // Insert district
      const [districtResult] = await connection.query(
        'INSERT INTO Districts (name) VALUES (?)',
        [districtName]
      );
      const districtId = districtResult.insertId;
      districtCount++;
      
      console.log(`  ✓ District ${districtCount}: ${districtName} (ID: ${districtId})`);
      
      // Insert constituencies for this district
      for (const constituency of districtData.constituencies) {
        await connection.query(
          'INSERT INTO Constituencies (district_id, name) VALUES (?, ?)',
          [districtId, constituency.name]
        );
        constituencyCount++;
      }
      
      console.log(`    → Added ${districtData.constituencies.length} constituencies`);
    }
    
    // Commit transaction
    await connection.commit();
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ DATA IMPORT COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(60));
    console.log(`📊 Summary:`);
    console.log(`   • Districts imported: ${districtCount}`);
    console.log(`   • Constituencies imported: ${constituencyCount}`);
    console.log('='.repeat(60));
    
    // Display sample data
    console.log('\n📋 Sample data verification:');
    const [districts] = await connection.query(
      'SELECT d.name as district, COUNT(c.constituency_id) as constituency_count ' +
      'FROM Districts d LEFT JOIN Constituencies c ON d.district_id = c.district_id ' +
      'GROUP BY d.district_id ORDER BY d.name LIMIT 5'
    );
    console.log('\nFirst 5 districts:');
    districts.forEach(d => {
      console.log(`  • ${d.district} (${d.constituency_count} constituencies)`);
    });
    
    const [sampleConstituencies] = await connection.query(
      'SELECT c.name as constituency, d.name as district ' +
      'FROM Constituencies c ' +
      'JOIN Districts d ON c.district_id = d.district_id ' +
      'LIMIT 5'
    );
    console.log('\nFirst 5 constituencies:');
    sampleConstituencies.forEach(c => {
      console.log(`  • ${c.constituency} (${c.district})`);
    });
    
  } catch (error) {
    // Rollback on error
    if (connection) {
      await connection.rollback();
    }
    console.error('\n❌ Error during import:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Make sure MySQL is running and the credentials in .env are correct.');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error(`\n💡 Database '${process.env.DB_NAME}' does not exist. Create it first with:`);
      console.error(`   mysql -u root -p -e "CREATE DATABASE bihar_election_poll CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"`);
      console.error(`   Then run: mysql -u root -p bihar_election_poll < backend/database/schema.sql`);
    }
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

// Run import
console.log('╔═══════════════════════════════════════════════════════════╗');
console.log('║     Bihar Election Constituencies Data Import Tool       ║');
console.log('╔═══════════════════════════════════════════════════════════╗\n');

importData();
