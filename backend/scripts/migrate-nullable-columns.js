const db = require('../config/database');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  try {
    console.log('Making fingerprint columns nullable...');
    
    await db.query(`
      ALTER TABLE Opinions 
        MODIFY COLUMN fingerprint_hash VARCHAR(64) NULL,
        MODIFY COLUMN ip_address VARCHAR(45) NULL,
        MODIFY COLUMN user_agent TEXT NULL
    `);
    
    console.log('✓ Migration completed successfully');
    console.log('✓ Columns are now nullable for anonymous voting');
    
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
