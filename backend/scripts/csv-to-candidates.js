const fs = require('fs');
const path = require('path');

/**
 * CSV to JavaScript Array Converter for Bihar Election Candidates
 * 
 * Instructions:
 * 1. Export your Google Sheets as CSV
 * 2. Place the CSV file in this directory
 * 3. Run: node csv-to-candidates.js your-file.csv
 * 4. Copy the generated JavaScript array to import-real-candidates.js
 */

function parseCSVToJavaScript(csvFilePath) {
  try {
    if (!fs.existsSync(csvFilePath)) {
      console.log('❌ CSV file not found:', csvFilePath);
      console.log('📝 Please make sure the file exists in this directory');
      return;
    }

    const csvContent = fs.readFileSync(csvFilePath, 'utf-8');
    const lines = csvContent.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      console.log('❌ CSV file is empty');
      return;
    }

    // Parse header row
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    console.log('📋 CSV Headers:', headers);
    
    // Expected columns (adjust based on your Google Sheets structure)
    const expectedHeaders = {
      constituency: ['constituency', 'विधानसभा', 'seat', 'क्षेत्र'],
      seat_no: ['seat_no', 'seat', 'number', 'संख्या'],
      candidate_hindi: ['candidate_hindi', 'name_hindi', 'नाम', 'उम्मीदवार'],
      candidate_english: ['candidate_english', 'name_english', 'name', 'english_name'],
      party: ['party', 'party_code', 'दल', 'political_party']
    };

    // Auto-detect column indices
    const columnMap = {};
    Object.keys(expectedHeaders).forEach(key => {
      const possibleNames = expectedHeaders[key];
      const index = headers.findIndex(header => 
        possibleNames.some(name => header.toLowerCase().includes(name.toLowerCase()))
      );
      if (index !== -1) {
        columnMap[key] = index;
        console.log(`✓ Found ${key}: Column ${index + 1} (${headers[index]})`);
      } else {
        console.log(`❌ Could not find column for ${key}. Expected one of: ${possibleNames.join(', ')}`);
      }
    });

    // Check if we have minimum required columns
    const required = ['constituency', 'candidate_hindi', 'party'];
    const missing = required.filter(req => !columnMap[req]);
    
    if (missing.length > 0) {
      console.log('\n❌ Missing required columns:', missing.join(', '));
      console.log('\n📝 Please ensure your CSV has columns for:');
      console.log('- Constituency name (Hindi or English)');
      console.log('- Candidate name (Hindi)');
      console.log('- Party code (BJP, INC, RJD, etc.)');
      console.log('\nOptional columns:');
      console.log('- Seat number');
      console.log('- Candidate name (English)');
      return;
    }

    // Parse data rows
    const candidates = [];
    const constituencyGroups = {};

    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(',').map(cell => cell.trim().replace(/"/g, ''));
      
      if (row.length < headers.length) {
        console.log(`⚠️  Skipping row ${i + 1}: insufficient data`);
        continue;
      }

      const constituency = row[columnMap.constituency] || '';
      const seatNo = columnMap.seat_no ? row[columnMap.seat_no] : i;
      const candidateHindi = row[columnMap.candidate_hindi] || '';
      const candidateEnglish = columnMap.candidate_english ? row[columnMap.candidate_english] : candidateHindi;
      const party = row[columnMap.party] || '';

      if (!constituency || !candidateHindi || !party) {
        console.log(`⚠️  Skipping row ${i + 1}: missing essential data`);
        continue;
      }

      // Group by constituency
      if (!constituencyGroups[constituency]) {
        constituencyGroups[constituency] = {
          constituency_name: constituency,
          seat_no: parseInt(seatNo) || i,
          candidates: []
        };
      }

      constituencyGroups[constituency].candidates.push({
        name_hindi: candidateHindi,
        name_english: candidateEnglish,
        party_code: party.toUpperCase()
      });
    }

    // Convert to array format
    const formattedData = Object.values(constituencyGroups);
    
    console.log(`\n✅ Successfully parsed ${formattedData.length} constituencies with ${formattedData.reduce((sum, c) => sum + c.candidates.length, 0)} candidates`);

    // Generate JavaScript code
    const jsCode = `// Generated from ${path.basename(csvFilePath)} on ${new Date().toLocaleString()}
const REAL_CANDIDATES_DATA = ${JSON.stringify(formattedData, null, 2)};

// Summary:
// - ${formattedData.length} constituencies
// - ${formattedData.reduce((sum, c) => sum + c.candidates.length, 0)} total candidates
// - Parties found: ${[...new Set(formattedData.flatMap(c => c.candidates.map(cand => cand.party_code)))].join(', ')}

module.exports = REAL_CANDIDATES_DATA;
`;

    // Write to output file
    const outputFile = csvFilePath.replace('.csv', '-candidates.js');
    fs.writeFileSync(outputFile, jsCode);

    console.log(`\n📄 JavaScript code written to: ${outputFile}`);
    console.log('\n📋 Next steps:');
    console.log('1. Review the generated file');
    console.log('2. Copy the REAL_CANDIDATES_DATA array to import-real-candidates.js');
    console.log('3. Run: node import-real-candidates.js');

    // Show preview
    console.log('\n👀 Preview of first constituency:');
    console.log(JSON.stringify(formattedData[0], null, 2));

  } catch (error) {
    console.error('❌ Error parsing CSV:', error.message);
  }
}

// Command line usage
const csvFile = process.argv[2];
if (!csvFile) {
  console.log('📝 Usage: node csv-to-candidates.js your-file.csv');
  console.log('\n💡 Steps to use:');
  console.log('1. Open your Google Sheets');
  console.log('2. Go to File > Download > Comma-separated values (.csv)');
  console.log('3. Place the CSV file in this directory');
  console.log('4. Run this script with the CSV filename');
} else {
  parseCSVToJavaScript(csvFile);
}