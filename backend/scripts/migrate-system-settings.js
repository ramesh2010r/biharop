const db = require('../config/database');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  try {
    console.log('Running System Settings migration...');
    
    const sqlFile = fs.readFileSync(
      path.join(__dirname, '../database/system_settings.sql'),
      'utf8'
    );
    
    // Split by semicolon and execute each statement
    const statements = sqlFile
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    for (const statement of statements) {
      await db.query(statement);
    }
    
    console.log('✓ System Settings table created successfully');
    console.log('✓ Default settings inserted');
    
    // Verify
    const [settings] = await db.query('SELECT * FROM System_Settings');
    console.log('\nCurrent settings:');
    settings.forEach(s => {
      console.log(`  - ${s.setting_key}: ${s.setting_value}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
