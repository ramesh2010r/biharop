const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Path to the Excel file
const EXCEL_FILE_PATH = '/Users/rameshkumar/Downloads/Candidate List.xlsx';
const OUTPUT_FILE_PATH = path.join(__dirname, 'candidates-data.json');

async function convertExcelToCandidates() {
  try {
    console.log('📊 Reading Excel file:', EXCEL_FILE_PATH);
    
    // Check if file exists
    if (!fs.existsSync(EXCEL_FILE_PATH)) {
      console.error('❌ Excel file not found:', EXCEL_FILE_PATH);
      return;
    }

    // Read the Excel file
    const workbook = XLSX.readFile(EXCEL_FILE_PATH);
    const sheetName = workbook.SheetNames[0]; // Use first sheet
    const worksheet = workbook.Sheets[sheetName];
    
    console.log('📋 Sheet name:', sheetName);
    
    // Convert to JSON
    const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    if (rawData.length === 0) {
      console.error('❌ No data found in Excel file');
      return;
    }

    console.log('📊 Total rows:', rawData.length);
    console.log('📋 First few rows:');
    rawData.slice(0, 5).forEach((row, index) => {
      console.log(`Row ${index + 1}:`, row);
    });

    // Try to identify columns
    const headers = rawData[0];
    console.log('\n📋 Headers detected:', headers);
    
    // Ask user to map columns
    console.log('\n🔍 Please check the column mapping and update the script accordingly.');
    console.log('Expected columns: Constituency Name, Candidate Name (Hindi), Candidate Name (English), Party Code/Name');
    
    // For now, let's assume a basic structure and process what we can
    const candidatesData = [];
    const dataRows = rawData.slice(1); // Skip header row
    
    // Group by constituency
    const constituencyMap = new Map();
    
    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      
      if (!row || row.length === 0) continue;
      
      // Try to extract data (you may need to adjust these indices based on your Excel structure)
      const constituency = row[0]?.toString().trim();
      const candidateHindi = row[1]?.toString().trim();
      const candidateEnglish = row[2]?.toString().trim();
      const party = row[3]?.toString().trim();
      
      if (constituency && candidateHindi) {
        if (!constituencyMap.has(constituency)) {
          constituencyMap.set(constituency, {
            constituency_name: constituency,
            seat_no: constituencyMap.size + 1,
            candidates: []
          });
        }
        
        constituencyMap.get(constituency).candidates.push({
          name_hindi: candidateHindi,
          name_english: candidateEnglish || candidateHindi,
          party_code: party || 'IND'
        });
      }
    }
    
    // Convert map to array
    const candidatesArray = Array.from(constituencyMap.values());
    
    console.log(`\n✅ Processed ${candidatesArray.length} constituencies`);
    candidatesArray.forEach(const_ => {
      console.log(`  ${const_.constituency_name}: ${const_.candidates.length} candidates`);
    });
    
    // Save to JSON file
    fs.writeFileSync(OUTPUT_FILE_PATH, JSON.stringify(candidatesArray, null, 2));
    console.log(`\n💾 Candidates data saved to: ${OUTPUT_FILE_PATH}`);
    
    // Show sample data
    console.log('\n📋 Sample constituency data:');
    if (candidatesArray.length > 0) {
      console.log(JSON.stringify(candidatesArray[0], null, 2));
    }
    
    return candidatesArray;
    
  } catch (error) {
    console.error('❌ Error converting Excel file:', error);
  }
}

// Run the conversion
if (require.main === module) {
  convertExcelToCandidates();
}

module.exports = { convertExcelToCandidates };