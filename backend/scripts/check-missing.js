require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const db = require('../config/database');

async function check() {
  const searches = ['रोसड़ा', 'मसौढ़ी', 'गौड़ाबौराम', 'सिवान', 'तेघरा', 'महराजगंज', 'सुरसंड', 'हरनाखी', 'कुर्था', 'गोविंदगंज', 'अरराह', 'मरहौरा', 'नरहट'];
  
  console.log('Checking remaining constituencies...\n');
  
  for (const term of searches) {
    const [rows] = await db.query('SELECT name_hindi FROM Constituencies WHERE name_hindi LIKE ?', [`%${term}%`]);
    if (rows.length > 0) {
      console.log(`✓ ${term} → ${rows.map(r => r.name_hindi).join(', ')}`);
    } else {
      console.log(`✗ ${term} → NOT FOUND`);
    }
  }
  
  process.exit(0);
}

check().catch(console.error);
