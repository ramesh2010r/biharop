#!/usr/bin/env node

/**
 * Test script to verify party edit functionality
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
  const db = await mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    // Get party #1 (BJP)
    console.log('=== Getting Party #1 (BJP) ===');
    const [parties] = await db.query('SELECT * FROM Parties WHERE id = 1');
    const party = parties[0];
    console.log('Current party:', {
      id: party.id,
      name_hindi: party.name_hindi,
      short_code: party.short_code,
      color_code: party.color_code
    });
    
    // Simulate an update (change name slightly)
    const newName = 'भारतीय जनता पार्टी (Updated)';
    console.log('\n=== Simulating UPDATE ===');
    console.log('New name:', newName);
    console.log('Same short_code:', party.short_code);
    console.log('Same color:', party.color_code);
    
    const [result] = await db.query(
      'UPDATE Parties SET name_hindi = ?, name_english = ?, short_code = ?, symbol_url = ?, color_code = ? WHERE id = ?',
      [newName, null, party.short_code, party.symbol_url, party.color_code, party.id]
    );
    
    console.log('\nUpdate result:', {
      affectedRows: result.affectedRows,
      changedRows: result.changedRows,
      info: result.info
    });
    
    // Verify the update
    const [updated] = await db.query('SELECT * FROM Parties WHERE id = 1');
    console.log('\n=== After Update ===');
    console.log('Updated party:', {
      id: updated[0].id,
      name_hindi: updated[0].name_hindi,
      short_code: updated[0].short_code,
      color_code: updated[0].color_code
    });
    
    // Revert the change
    console.log('\n=== Reverting Change ===');
    await db.query(
      'UPDATE Parties SET name_hindi = ? WHERE id = ?',
      [party.name_hindi, party.id]
    );
    console.log('✓ Reverted to original name');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await db.end();
  }
})();
