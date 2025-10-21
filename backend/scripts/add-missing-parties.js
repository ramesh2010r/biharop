const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Party mappings from Excel sheets that need to be added to database
const NEW_PARTIES = [
  { name_hindi: 'लोक जन शक्ति पार्टी (राम विलास)', short_code: 'LJPRV', color_code: '#004d00' },
  { name_hindi: 'हिन्दुस्तानी अवाम मोर्चा (सेकुलर)', short_code: 'HAMS', color_code: '#ff4500' },
  { name_hindi: 'जन सुराज', short_code: 'JAN_SURAJ', color_code: '#800080' },
  { name_hindi: 'झारखंड जनता दल', short_code: 'JJD', color_code: '#00ff00' },
  { name_hindi: 'आम आदमी पार्टी', short_code: 'AAP', color_code: '#0066cc' },
  { name_hindi: 'विकासशील इंसान पार्टी', short_code: 'VIP', color_code: '#ffff00' },
  { name_hindi: 'निर्दलीय', short_code: 'IND', color_code: '#808080' }
];

async function addMissingParties() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'opinion_poll'
    });
    
    console.log('🔗 Connected to database');
    
    // Check existing parties
    const [existingParties] = await connection.execute('SELECT short_code FROM Parties');
    const existingCodes = existingParties.map(p => p.short_code);
    console.log('📋 Existing parties:', existingCodes.join(', '));
    
    // Add missing parties
    for (const party of NEW_PARTIES) {
      if (!existingCodes.includes(party.short_code)) {
        try {
          await connection.execute(
            'INSERT INTO Parties (name_hindi, name_english, short_code, color_code) VALUES (?, ?, ?, ?)',
            [party.name_hindi, party.name_hindi, party.short_code, party.color_code]
          );
          console.log(`✅ Added party: ${party.short_code} - ${party.name_hindi}`);
        } catch (error) {
          console.log(`❌ Error adding party ${party.short_code}: ${error.message}`);
        }
      } else {
        console.log(`⚠️  Party already exists: ${party.short_code}`);
      }
    }
    
    // Show final party list
    const [finalParties] = await connection.execute('SELECT short_code, name_hindi FROM Parties ORDER BY short_code');
    console.log('\n📋 Final party list:');
    finalParties.forEach(p => {
      console.log(`  ${p.short_code}: ${p.name_hindi}`);
    });
    
    await connection.end();
    console.log('\n✅ Parties update completed');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

addMissingParties();