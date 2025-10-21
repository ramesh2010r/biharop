const db = require('../config/database');

async function revertMigration() {
  try {
    console.log('Reverting: Making fingerprint columns NOT NULL again...');
    
    // First update any NULL values to empty string
    await db.query(`UPDATE Opinions SET fingerprint_hash = '' WHERE fingerprint_hash IS NULL`);
    await db.query(`UPDATE Opinions SET ip_address = '' WHERE ip_address IS NULL`);
    await db.query(`UPDATE Opinions SET user_agent = '' WHERE user_agent IS NULL`);
    
    // Then make columns NOT NULL
    await db.query(`
      ALTER TABLE Opinions 
        MODIFY COLUMN fingerprint_hash VARCHAR(64) NOT NULL,
        MODIFY COLUMN ip_address VARCHAR(45) NOT NULL,
        MODIFY COLUMN user_agent TEXT NOT NULL
    `);
    
    console.log('✓ Revert completed successfully');
    console.log('✓ Columns are now NOT NULL again');
    
    process.exit(0);
  } catch (error) {
    console.error('Revert failed:', error);
    process.exit(1);
  }
}

revertMigration();
