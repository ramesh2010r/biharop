const XLSX = require('xlsx');
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Path to the Excel file
const EXCEL_FILE_PATH = '/Users/rameshkumar/Downloads/Candidate List.xlsx';

// Party code mapping from sheet names to our database codes
const PARTY_MAPPING = {
  'BJP (101)': 'BJP',
  'JDU (101)': 'JDU', 
  'LJP(29)': 'LJPRV',
  'RLM(6)': 'LJPRV', // Rashtriya Lok Morcha might be part of LJP alliance
  'HAM(S)(6)': 'HAMS',
  'Jan Suraj (116)': 'JAN_SURAJ',
  'RJD (37)': 'RJD',
  'INC (48)': 'INC',
  'JJD (22)': 'JJD',
  'CPI(ML) (18)': 'CPIM',
  'AAP (59)': 'AAP'
};

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'opinion_poll'
};

async function importAllCandidates() {
  let connection;
  
  try {
    console.log('📊 Reading Excel file:', EXCEL_FILE_PATH);
    
    // Check if file exists
    if (!fs.existsSync(EXCEL_FILE_PATH)) {
      console.error('❌ Excel file not found:', EXCEL_FILE_PATH);
      return;
    }

    // Connect to database
    console.log('🔗 Connecting to MySQL database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✓ Connected to MySQL database');

    // Get available parties from database
    const [parties] = await connection.execute('SELECT id, name_hindi, short_code FROM Parties');
    const partyMap = new Map();
    parties.forEach(p => {
      partyMap.set(p.short_code, p.id);
      partyMap.set(p.name_hindi, p.id);
    });
    console.log('📋 Available parties:', parties.map(p => p.short_code).join(', '));

    // Get constituencies from database
    const [constituencies] = await connection.execute('SELECT id, name_hindi, name_english FROM Constituencies');
    const constituencyMap = new Map();
    constituencies.forEach(c => {
      // Create mapping for both Hindi and English names
      constituencyMap.set(c.name_hindi, c.id);
      if (c.name_english) {
        constituencyMap.set(c.name_english, c.id);
      }
      
      // Also try to match with constituency name without reservation info in parentheses
      const hindiClean = c.name_hindi.replace(/\s*\([^)]*\)\s*/g, '').trim();
      if (hindiClean !== c.name_hindi) {
        constituencyMap.set(hindiClean, c.id);
      }
    });
    console.log(`🗳️  Found ${constituencies.length} constituencies in database`);

    // Clear existing candidates and results
    console.log('🧹 Clearing existing candidates and results...');
    await connection.execute('DELETE FROM Results_Summary');
    await connection.execute('DELETE FROM Opinions');
    await connection.execute('DELETE FROM Candidates');
    console.log('✓ Cleared existing data');

    // Read the Excel file
    const workbook = XLSX.readFile(EXCEL_FILE_PATH);
    
    let totalCandidatesAdded = 0;
    const constituencyStats = new Map();

    // Process each sheet
      for (const sheetName of workbook.SheetNames) {
      console.log(`\n📍 Processing sheet: ${sheetName}`);
      
      const partyAbbreviation = PARTY_MAPPING[sheetName] || 'IND';
      const partyId = partyMap.get(partyAbbreviation);
      
      if (!partyId) {
        console.log(`   ⚠️  Party not found in database: ${partyAbbreviation}, skipping sheet`);
        continue;
      }
      
      console.log(`   Party: ${partyAbbreviation} (ID: ${partyId})`);      const worksheet = workbook.Sheets[sheetName];
      const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      if (rawData.length <= 1) {
        console.log('   ⚠️  No data rows found, skipping');
        continue;
      }

      // Skip header row and process data
      const dataRows = rawData.slice(1);
      let sheetCandidatesAdded = 0;
      
      for (const row of dataRows) {
        if (!row || row.length < 2) continue;
        
        const constituencyName = row[0]?.toString().trim();
        const candidateName = row[1]?.toString().trim();
        
        if (!constituencyName || !candidateName) continue;
        
        // Try to find constituency ID
        let constituencyId = null;
        
        // Try exact match first
        if (constituencyMap.has(constituencyName)) {
          constituencyId = constituencyMap.get(constituencyName);
        } else {
          // Try to match without English name in parentheses
          const hindiOnly = constituencyName.replace(/\s*\([^)]+\)\s*/g, '').trim();
          if (constituencyMap.has(hindiOnly)) {
            constituencyId = constituencyMap.get(hindiOnly);
          } else {
            // Try to find partial match
            for (const [dbName, id] of constituencyMap) {
              if (dbName.includes(hindiOnly) || hindiOnly.includes(dbName)) {
                constituencyId = id;
                break;
              }
            }
          }
        }
        
        if (!constituencyId) {
          console.log(`   ⚠️  Constituency not found: ${constituencyName}`);
          continue;
        }
        
        // Clean candidate name (remove titles and English names in parentheses)
        const cleanCandidateName = candidateName
          .replace(/^(श्री|श्रीमती|डॉ|Dr\.?)\s*/i, '')
          .replace(/\s*\([^)]+\)\s*$/g, '')
          .trim();
        
        try {
          // Insert candidate
          await connection.execute(
            `INSERT INTO Candidates (
              constituency_id, 
              party_id,
              name_hindi,
              name_english,
              photo_url
            ) VALUES (?, ?, ?, ?, ?)`,
            [constituencyId, partyId, cleanCandidateName, cleanCandidateName, null]
          );
          
          sheetCandidatesAdded++;
          totalCandidatesAdded++;
          
          // Update constituency stats
          const constituencyKey = constituencies.find(c => c.id === constituencyId)?.name_hindi;
          if (constituencyKey) {
            constituencyStats.set(constituencyKey, (constituencyStats.get(constituencyKey) || 0) + 1);
          }
          
        } catch (error) {
          console.log(`   ❌ Error adding candidate ${cleanCandidateName}: ${error.message}`);
        }
      }
      
      console.log(`   ✓ Added ${sheetCandidatesAdded} candidates from ${sheetName}`);
    }
    
    console.log(`\n🎉 Import completed!`);
    console.log(`✓ Total candidates added: ${totalCandidatesAdded}`);
    
    // Show constituency statistics
    console.log(`\n📊 Candidates per constituency (showing constituencies with candidates):`);
    const sortedStats = Array.from(constituencyStats.entries())
      .sort((a, b) => b[1] - a[1]) // Sort by candidate count descending
      .slice(0, 20); // Show top 20
    
    sortedStats.forEach(([constituency, count]) => {
      console.log(`  ${constituency}: ${count} candidates`);
    });
    
    if (constituencyStats.size > 20) {
      console.log(`  ... and ${constituencyStats.size - 20} more constituencies`);
    }
    
  } catch (error) {
    console.error('❌ Error importing candidates:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('✓ Database connection closed');
    }
  }
}

// Run the import
if (require.main === module) {
  importAllCandidates();
}

module.exports = { importAllCandidates };