const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Path to the Excel file
const EXCEL_FILE_PATH = '/Users/rameshkumar/Downloads/Candidate List.xlsx';

async function analyzeExcelFile() {
  try {
    console.log('📊 Analyzing Excel file:', EXCEL_FILE_PATH);
    
    // Check if file exists
    if (!fs.existsSync(EXCEL_FILE_PATH)) {
      console.error('❌ Excel file not found:', EXCEL_FILE_PATH);
      return;
    }

    // Read the Excel file
    const workbook = XLSX.readFile(EXCEL_FILE_PATH);
    
    console.log('\n📋 Available sheets in the Excel file:');
    workbook.SheetNames.forEach((sheetName, index) => {
      const worksheet = workbook.Sheets[sheetName];
      const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:A1');
      const rowCount = range.e.r + 1;
      console.log(`  ${index + 1}. ${sheetName} (${rowCount} rows)`);
    });
    
    // Analyze each sheet
    console.log('\n🔍 Analyzing each sheet:');
    for (const sheetName of workbook.SheetNames) {
      console.log(`\n--- Sheet: ${sheetName} ---`);
      const worksheet = workbook.Sheets[sheetName];
      const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      if (rawData.length > 0) {
        console.log('Headers:', rawData[0]);
        console.log('Sample row:', rawData[1] || 'No data rows');
        console.log('Total rows:', rawData.length);
      } else {
        console.log('No data in this sheet');
      }
    }
    
  } catch (error) {
    console.error('❌ Error analyzing Excel file:', error);
  }
}

// Run the analysis
analyzeExcelFile();