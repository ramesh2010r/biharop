const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Real candidate data from Google Sheets
// UPDATE THIS SECTION WITH YOUR REAL DATA
const REAL_CANDIDATES_DATA = [
  {
    constituency_name: "वैशाली",
    seat_no: 1,
    candidates: [
      {
        name_hindi: "रघुवंश प्रसाद सिंह",
        name_english: "Raghuvansh Prasad Singh",
        party_code: "RJD"
      },
      {
        name_hindi: "दिलीप जायसवाल",
        name_english: "Dilip Jaiswal", 
        party_code: "BJP"
      },
      {
        name_hindi: "उदय नारायण चौधरी",
        name_english: "Uday Narayan Chaudhary",
        party_code: "JDU"
      }
    ]
  },
  {
    constituency_name: "महुआ",
    seat_no: 2,
    candidates: [
      {
        name_hindi: "मुकेश सहनी",
        name_english: "Mukesh Sahni",
        party_code: "VIP"
      },
      {
        name_hindi: "राज कुशवाहा",
        name_english: "Raj Kushwaha",
        party_code: "BJP"
      },
      {
        name_hindi: "प्रमोद कुमार",
        name_english: "Pramod Kumar",
        party_code: "RJD"
      }
    ]
  }
  
  // TODO: ADD MORE REAL CANDIDATES FROM YOUR GOOGLE SHEETS
  // Follow the same format as above
];

async function importRealCandidates() {
  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,  
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log('✓ Connected to MySQL database');

    if (REAL_CANDIDATES_DATA.length === 0) {
      console.log('\n❌ No candidate data found!');
      console.log('📝 Please add real candidate data to the REAL_CANDIDATES_DATA array in this script.');
      console.log('📋 Expected format:');
      console.log(`
{
  constituency: "Constituency Name in Hindi",
  seat_no: 1,
  candidates: [
    {
      name_hindi: "Candidate Name in Hindi",
      name_english: "Candidate Name in English", 
      party_code: "PARTY_CODE",
      photo_url: null // or URL to photo
    }
  ]
}`);
      return;
    }

    // Get existing parties and constituencies
    const [parties] = await connection.query('SELECT id as party_id, name_hindi, name_english, short_code FROM Parties');
    const [constituencies] = await connection.query('SELECT id as constituency_id, name_hindi, name_english, seat_no FROM Constituencies');
    
    // Create lookup maps
    const partyMap = {};
    parties.forEach(p => {
      partyMap[p.short_code] = p.party_id;
      partyMap[p.name_hindi] = p.party_id; 
      partyMap[p.name_english] = p.party_id;
    });

    const constituencyMap = {};
    constituencies.forEach(c => {
      constituencyMap[c.name_hindi] = c.constituency_id;
      constituencyMap[c.name_english] = c.constituency_id;
      constituencyMap[c.seat_no] = c.constituency_id;
    });

    console.log('\n📋 Available parties:', Object.keys(partyMap).join(', '));
    console.log(`\n🗳️  Found ${constituencies.length} constituencies in database`);

    // Clear existing candidates and results
    console.log('\n🧹 Clearing existing candidates and results...');
    await connection.query('DELETE FROM Results_Summary');
    await connection.query('DELETE FROM Candidates');
    console.log('✓ Cleared existing data');

    let totalCandidates = 0;
    let errors = [];

    // Process each constituency
    for (const constituencyData of REAL_CANDIDATES_DATA) {
      const { constituency_name, seat_no, candidates } = constituencyData;
      
      // Find constituency ID
      let constituencyId = constituencyMap[constituency_name] || constituencyMap[seat_no];
      
      if (!constituencyId) {
        errors.push(`❌ Constituency not found: ${constituency_name} (Seat: ${seat_no})`);
        continue;
      }

      console.log(`\n📍 Processing: ${constituency_name} (${candidates.length} candidates)`);

      // Process each candidate
      for (const candidate of candidates) {
        const { name_hindi, name_english, party_code, photo_url } = candidate;
        
        // Find party ID
        const partyId = partyMap[party_code];
        if (!partyId) {
          errors.push(`❌ Party not found: ${party_code} for candidate ${name_hindi}`);
          continue;
        }

        try {
          // Insert candidate
          const [result] = await connection.query(`
            INSERT INTO Candidates (constituency_id, party_id, name_hindi, name_english, photo_url) 
            VALUES (?, ?, ?, ?, ?)
          `, [constituencyId, partyId, name_hindi, name_english, photo_url || null]);

          const candidateId = result.insertId;

          // Initialize results summary (if table exists)
          try {
            await connection.query(`
              INSERT INTO Results_Summary (constituency_id, candidate_id, total_votes) 
              VALUES (?, ?, 0)
            `, [constituencyId, candidateId]);
          } catch (summaryError) {
            console.log(`  ⚠️  Results_Summary table may not exist - ${summaryError.message}`);
          }

          console.log(`  ✓ Added: ${name_hindi} (${party_code})`);
          totalCandidates++;

        } catch (error) {
          errors.push(`❌ Error adding candidate ${name_hindi}: ${error.message}`);
        }
      }
    }

    // Summary
    console.log(`\n🎉 Import completed!`);
    console.log(`✓ Total candidates added: ${totalCandidates}`);
    
    if (errors.length > 0) {
      console.log(`\n⚠️  Errors encountered: ${errors.length}`);
      errors.forEach(error => console.log(error));
    }

    // Generate data validation report
    const [candidateCount] = await connection.query(`
      SELECT 
        c.name_hindi as constituency,
        COUNT(cand.id) as candidate_count
      FROM Constituencies c
      LEFT JOIN Candidates cand ON c.id = cand.constituency_id
      GROUP BY c.id, c.name_hindi
      ORDER BY c.seat_no
    `);

    console.log('\n📊 Candidates per constituency:');
    candidateCount.forEach(row => {
      console.log(`  ${row.constituency}: ${row.candidate_count} candidates`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n✓ Database connection closed');
    }
  }
}

// Helper function to generate template from Google Sheets CSV
function generateTemplateFromCSV(csvFilePath) {
  console.log('\n📝 CSV Import Helper');
  console.log('If you have exported your Google Sheets as CSV, place it in this directory and run:');
  console.log('node import-real-candidates.js --csv your-file.csv');
  
  // TODO: Add CSV parsing logic if needed
}

// Check if running with CSV argument
if (process.argv.includes('--csv')) {
  const csvFile = process.argv[process.argv.indexOf('--csv') + 1];
  if (csvFile) {
    generateTemplateFromCSV(csvFile);
  } else {
    console.log('❌ Please provide a CSV file: node import-real-candidates.js --csv your-file.csv');
  }
} else {
  importRealCandidates();
}