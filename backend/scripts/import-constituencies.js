const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function importConstituencies() {
  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      multipleStatements: true
    });

    console.log('✓ Connected to MySQL');

    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    console.log(`✓ Database '${process.env.DB_NAME}' ready`);

    await connection.query(`USE ${process.env.DB_NAME}`);

    // Create tables
    console.log('\n📋 Creating tables...');
    
    const createTablesSQL = `
      CREATE TABLE IF NOT EXISTS Districts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name_hindi VARCHAR(100) NOT NULL,
        name_english VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_district (name_hindi)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

      CREATE TABLE IF NOT EXISTS Constituencies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        seat_no INT NOT NULL UNIQUE,
        name_hindi VARCHAR(100) NOT NULL,
        name_english VARCHAR(100) NOT NULL,
        district_id INT NOT NULL,
        is_reserved BOOLEAN DEFAULT FALSE,
        reservation_type ENUM('None', 'SC', 'ST') DEFAULT 'None',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (district_id) REFERENCES Districts(id) ON DELETE CASCADE,
        INDEX idx_district (district_id),
        INDEX idx_seat_no (seat_no)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

      CREATE TABLE IF NOT EXISTS Parties (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name_hindi VARCHAR(100) NOT NULL,
        name_english VARCHAR(100) NOT NULL,
        short_code VARCHAR(20) NOT NULL UNIQUE,
        symbol_url VARCHAR(255),
        color_code VARCHAR(7),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

      CREATE TABLE IF NOT EXISTS Candidates (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name_hindi VARCHAR(100) NOT NULL,
        name_english VARCHAR(100) NOT NULL,
        constituency_id INT NOT NULL,
        party_id INT NOT NULL,
        photo_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (constituency_id) REFERENCES Constituencies(id) ON DELETE CASCADE,
        FOREIGN KEY (party_id) REFERENCES Parties(id) ON DELETE CASCADE,
        INDEX idx_constituency (constituency_id),
        INDEX idx_party (party_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

      CREATE TABLE IF NOT EXISTS Election_Phases (
        id INT AUTO_INCREMENT PRIMARY KEY,
        phase_number INT NOT NULL,
        voting_date DATE NOT NULL,
        result_date DATE NOT NULL,
        blackout_start DATETIME GENERATED ALWAYS AS (DATE_SUB(result_date, INTERVAL 48 HOUR)) STORED,
        blackout_end DATETIME GENERATED ALWAYS AS (result_date) STORED,
        status ENUM('Upcoming', 'Voting', 'Counting', 'Completed') DEFAULT 'Upcoming',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_dates (voting_date, result_date),
        INDEX idx_blackout (blackout_start, blackout_end)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

      CREATE TABLE IF NOT EXISTS Opinions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        constituency_id INT NOT NULL,
        candidate_id INT NOT NULL,
        fingerprint_hash VARCHAR(64) NOT NULL,
        ip_address VARCHAR(45) NOT NULL,
        user_agent TEXT,
        voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (constituency_id) REFERENCES Constituencies(id) ON DELETE CASCADE,
        FOREIGN KEY (candidate_id) REFERENCES Candidates(id) ON DELETE CASCADE,
        INDEX idx_constituency (constituency_id),
        INDEX idx_candidate (candidate_id),
        INDEX idx_duplicate_check (constituency_id, fingerprint_hash, ip_address),
        INDEX idx_voted_at (voted_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

      CREATE TABLE IF NOT EXISTS Results_Summary (
        id INT AUTO_INCREMENT PRIMARY KEY,
        constituency_id INT NOT NULL,
        candidate_id INT NOT NULL,
        vote_count INT DEFAULT 0,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_result (constituency_id, candidate_id),
        FOREIGN KEY (constituency_id) REFERENCES Constituencies(id) ON DELETE CASCADE,
        FOREIGN KEY (candidate_id) REFERENCES Candidates(id) ON DELETE CASCADE,
        INDEX idx_constituency (constituency_id),
        INDEX idx_candidate (candidate_id),
        INDEX idx_vote_count (vote_count DESC)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

      CREATE TABLE IF NOT EXISTS Admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        email VARCHAR(100),
        role ENUM('Super Admin', 'Admin', 'Viewer') DEFAULT 'Admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP NULL,
        INDEX idx_username (username)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    await connection.query(createTablesSQL);
    console.log('✓ All tables created');

    // Read CSV file
    const csvPath = '/Users/rameshkumar/Downloads/bihar_constituencies.csv';
    
    if (!fs.existsSync(csvPath)) {
      throw new Error(`CSV file not found at: ${csvPath}`);
    }

    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split('\n').filter(line => line.trim());
    
    // Skip header
    const dataLines = lines.slice(1);
    
    console.log(`\n📊 Found ${dataLines.length} constituencies in CSV`);

    // Parse CSV and organize data
    const districtMap = new Map();
    const constituenciesData = [];

    for (const line of dataLines) {
      const [seat_no, constituency_hindi, district_hindi] = line.split(',').map(s => s.trim());
      
      if (!seat_no || !constituency_hindi || !district_hindi) {
        continue;
      }

      if (!districtMap.has(district_hindi)) {
        districtMap.set(district_hindi, {
          name_hindi: district_hindi,
          name_english: transliterateToEnglish(district_hindi)
        });
      }

      constituenciesData.push({
        seat_no: parseInt(seat_no),
        constituency_hindi,
        constituency_english: transliterateToEnglish(constituency_hindi),
        district_hindi,
        is_reserved: constituency_hindi.includes('(अजा)') || constituency_hindi.includes('(अजजा)'),
        reservation_type: constituency_hindi.includes('(अजा)') ? 'SC' : constituency_hindi.includes('(अजजा)') ? 'ST' : 'None'
      });
    }

    console.log(`\n🏛️  Importing ${districtMap.size} districts...`);

    // Insert districts
    for (const [hindi, data] of districtMap) {
      await connection.query(
        'INSERT IGNORE INTO Districts (name_hindi, name_english) VALUES (?, ?)',
        [data.name_hindi, data.name_english]
      );
    }

    console.log('✓ Districts imported');

    // Get district IDs
    const [districts] = await connection.query('SELECT id, name_hindi FROM Districts');
    const districtIdMap = new Map();
    districts.forEach(d => districtIdMap.set(d.name_hindi, d.id));

    console.log(`\n🗳️  Importing ${constituenciesData.length} constituencies...`);

    // Insert constituencies
    let imported = 0;
    for (const constituency of constituenciesData) {
      const districtId = districtIdMap.get(constituency.district_hindi);
      
      if (!districtId) {
        console.warn(`⚠️  District not found: ${constituency.district_hindi}`);
        continue;
      }

      await connection.query(
        `INSERT INTO Constituencies (seat_no, name_hindi, name_english, district_id, is_reserved, reservation_type) 
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name_hindi = VALUES(name_hindi), name_english = VALUES(name_english)`,
        [
          constituency.seat_no,
          constituency.constituency_hindi,
          constituency.constituency_english,
          districtId,
          constituency.is_reserved,
          constituency.reservation_type
        ]
      );
      imported++;
    }

    console.log(`✓ ${imported} constituencies imported`);

    // Insert sample parties
    console.log('\n🎭 Adding sample political parties...');
    
    const parties = [
      { name_hindi: 'भारतीय जनता पार्टी', name_english: 'Bharatiya Janata Party', short_code: 'BJP', color_code: '#FF9933' },
      { name_hindi: 'राष्ट्रीय जनता दल', name_english: 'Rashtriya Janata Dal', short_code: 'RJD', color_code: '#006400' },
      { name_hindi: 'जनता दल (यूनाइटेड)', name_english: 'Janata Dal (United)', short_code: 'JDU', color_code: '#006400' },
      { name_hindi: 'भारतीय राष्ट्रीय कांग्रेस', name_english: 'Indian National Congress', short_code: 'INC', color_code: '#19AAED' },
      { name_hindi: 'कम्युनिस्ट पार्टी ऑफ इंडिया (मार्क्सवादी)', name_english: 'Communist Party of India (Marxist)', short_code: 'CPIM', color_code: '#FF0000' },
      { name_hindi: 'लोक जनशक्ति पार्टी (राम विलास)', name_english: 'Lok Janshakti Party (Ram Vilas)', short_code: 'LJPRV', color_code: '#0000FF' },
      { name_hindi: 'निर्दलीय', name_english: 'Independent', short_code: 'IND', color_code: '#808080' }
    ];

    for (const party of parties) {
      await connection.query(
        `INSERT INTO Parties (name_hindi, name_english, short_code, color_code) 
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name_hindi = VALUES(name_hindi)`,
        [party.name_hindi, party.name_english, party.short_code, party.color_code]
      );
    }

    console.log('✓ Political parties added');

    // Verify data
    const [districtCount] = await connection.query('SELECT COUNT(*) as count FROM Districts');
    const [constituencyCount] = await connection.query('SELECT COUNT(*) as count FROM Constituencies');
    const [partyCount] = await connection.query('SELECT COUNT(*) as count FROM Parties');

    console.log('\n✅ Import completed successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   Districts: ${districtCount[0].count}`);
    console.log(`   Constituencies: ${constituencyCount[0].count}`);
    console.log(`   Political Parties: ${partyCount[0].count}`);
    
    console.log('\n🎯 Next steps:');
    console.log('   1. Add candidates for each constituency');
    console.log('   2. Configure election phases in admin panel');
    console.log('   3. Start the backend server: cd backend && npm start');
    console.log('   4. Start the frontend: npm run dev');

  } catch (error) {
    console.error('❌ Error during import:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Simple transliteration function (basic mapping)
function transliterateToEnglish(hindiText) {
  // Remove reservation markers
  let text = hindiText.replace(/\(अजा\)/g, '(SC)').replace(/\(अजजा\)/g, '(ST)');
  
  // Common Hindi to English mappings for Bihar districts/constituencies
  const mappings = {
    'पश्चिम चंपारण': 'West Champaran',
    'पूर्वी चंपारण': 'East Champaran',
    'शिवहर': 'Sheohar',
    'सीतामढ़ी': 'Sitamarhi',
    'मधुबनी': 'Madhubani',
    'सुपौल': 'Supaul',
    'अररिया': 'Araria',
    'किशनगंज': 'Kishanganj',
    'पूर्णिया': 'Purnia',
    'कटिहार': 'Katihar',
    'मधेपुरा': 'Madhepura',
    'सहरसा': 'Saharsa',
    'दरभंगा': 'Darbhanga',
    'मुजफ्फरपुर': 'Muzaffarpur',
    'गोपालगंज': 'Gopalganj',
    'सीवान': 'Siwan',
    'सारण': 'Saran',
    'वैशाली': 'Vaishali',
    'समस्तीपुर': 'Samastipur',
    'बेगूसराय': 'Begusarai',
    'खगड़िया': 'Khagaria',
    'भागलपुर': 'Bhagalpur',
    'बाँका': 'Banka',
    'मुंगेर': 'Munger',
    'लखीसराय': 'Lakhisarai',
    'शेखपुरा': 'Sheikhpura',
    'नालंदा': 'Nalanda',
    'पटना': 'Patna',
    'भोजपुर': 'Bhojpur',
    'बक्सर': 'Buxar',
    'कैमूर': 'Kaimur',
    'रोहतास': 'Rohtas',
    'औरंगाबाद': 'Aurangabad',
    'गया': 'Gaya',
    'नवादा': 'Nawada',
    'जमुई': 'Jamui',
    'जहानाबाद': 'Jehanabad',
    'अरवल': 'Arwal'
  };

  // Return mapped value if exists, otherwise return transliterated version
  return mappings[text] || text;
}

// Run the import
importConstituencies()
  .then(() => {
    console.log('\n✨ All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });
