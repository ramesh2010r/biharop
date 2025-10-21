#!/usr/bin/env node

/**
 * Test script to debug candidate update issue
 * Run: node test_candidate_update.js
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
    // Get a sample candidate
    console.log('=== Fetching sample candidate ===');
    const [candidates] = await db.query(`
      SELECT c.id, c.name_hindi, c.name_english, c.party_id, c.constituency_id, c.photo_url
      FROM Candidates c
      LIMIT 1
    `);
    
    if (candidates.length === 0) {
      console.log('No candidates found in database');
      return;
    }
    
    const candidate = candidates[0];
    console.log('Sample candidate:', candidate);
    
    // Test UPDATE with NULL name_english
    console.log('\n=== Testing UPDATE with NULL name_english ===');
    const [result] = await db.query(
      'UPDATE Candidates SET name_hindi = ?, name_english = ?, party_id = ?, photo_url = ? WHERE id = ?',
      [candidate.name_hindi, null, candidate.party_id, candidate.photo_url, candidate.id]
    );
    
    console.log('Update result:', {
      affectedRows: result.affectedRows,
      changedRows: result.changedRows,
      info: result.info
    });
    
    // Verify the update
    const [updated] = await db.query('SELECT * FROM Candidates WHERE id = ?', [candidate.id]);
    console.log('\n=== Updated candidate ===');
    console.log(updated[0]);
    
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Full error:', error);
  } finally {
    await db.end();
  }
})();
