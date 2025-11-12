#!/usr/bin/env node

/**
 * Run Database Migration: 004_add_states_support.sql
 * This script executes the multi-state migration safely
 */

const fs = require('fs');
const path = require('path');
const pool = require('../config/database');

async function runMigration() {
  console.log('🚀 Starting Migration: Add Multi-State Support\n');
  
  const migrationFile = path.join(__dirname, '../migrations/004_add_states_support.sql');
  
  if (!fs.existsSync(migrationFile)) {
    console.error('❌ Migration file not found:', migrationFile);
    process.exit(1);
  }
  
  const sql = fs.readFileSync(migrationFile, 'utf8');
  
  // Split SQL file into individual statements
  const statements = sql
    .split(';')
    .map(stmt => stmt.trim())
    .filter(stmt => {
      // Filter out comments and empty statements
      return stmt.length > 0 && 
             !stmt.startsWith('--') && 
             !stmt.startsWith('/*') &&
             !stmt.match(/^COMMENT/i);
    });
  
  console.log(`📋 Found ${statements.length} SQL statements to execute\n`);
  
  let connection;
  try {
    connection = await pool.getConnection();
    
    // Start transaction for safety
    await connection.beginTransaction();
    console.log('✓ Transaction started\n');
    
    let successCount = 0;
    let skipCount = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      // Skip comment-only statements
      if (!statement.trim() || statement.trim().startsWith('--')) {
        skipCount++;
        continue;
      }
      
      try {
        // Extract command type for logging
        const commandMatch = statement.match(/^(CREATE|ALTER|INSERT|UPDATE|DROP|SELECT)/i);
        const command = commandMatch ? commandMatch[1].toUpperCase() : 'EXEC';
        
        // Show what we're executing
        const preview = statement.substring(0, 80).replace(/\n/g, ' ');
        console.log(`[${i + 1}/${statements.length}] ${command}: ${preview}...`);
        
        await connection.query(statement);
        successCount++;
        console.log(`  ✓ Success\n`);
        
      } catch (error) {
        // Check if error is "already exists" - these are safe to ignore
        if (error.message.includes('already exists') || 
            error.message.includes('Duplicate column name') ||
            error.message.includes('Duplicate key name')) {
          console.log(`  ⚠ Already exists (skipping)\n`);
          skipCount++;
        } else {
          console.error(`  ❌ Error: ${error.message}\n`);
          throw error; // Rollback transaction
        }
      }
    }
    
    // Commit transaction
    await connection.commit();
    console.log('✅ Transaction committed successfully\n');
    
    // Summary
    console.log('━'.repeat(60));
    console.log('📊 MIGRATION SUMMARY:');
    console.log('━'.repeat(60));
    console.log(`✓ Successful: ${successCount} statements`);
    console.log(`⚠ Skipped:    ${skipCount} statements (already existed)`);
    console.log(`❌ Failed:    0 statements`);
    console.log('━'.repeat(60));
    
    // Verification queries
    console.log('\n🔍 VERIFICATION:\n');
    
    // Check States table
    const [states] = await connection.query('SELECT COUNT(*) as count FROM States');
    console.log(`✓ States table: ${states[0].count} states loaded`);
    
    // Check state_id columns
    const [columns] = await connection.query(`
      SELECT TABLE_NAME, COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND COLUMN_NAME = 'state_id'
      ORDER BY TABLE_NAME
    `);
    console.log(`✓ state_id column added to ${columns.length} tables:`);
    columns.forEach(col => {
      console.log(`  - ${col.TABLE_NAME}`);
    });
    
    // Check Bihar data
    const [biharVotes] = await connection.query('SELECT COUNT(*) as count FROM Votes WHERE state_id = 1');
    const [biharCandidates] = await connection.query('SELECT COUNT(*) as count FROM Candidates WHERE state_id = 1');
    const [biharBlogs] = await connection.query('SELECT COUNT(*) as count FROM Blog_Posts WHERE state_id = 1');
    
    console.log(`\n✓ Bihar data integrity:`);
    console.log(`  - Votes: ${biharVotes[0].count}`);
    console.log(`  - Candidates: ${biharCandidates[0].count}`);
    console.log(`  - Blogs: ${biharBlogs[0].count}`);
    
    // Show active states
    const [activeStates] = await connection.query(`
      SELECT name, slug, active, coming_soon, launch_date 
      FROM States 
      ORDER BY active DESC, launch_date ASC
    `);
    
    console.log(`\n✓ States configured:`);
    activeStates.forEach(state => {
      const status = state.active ? '🟢 LIVE' : state.coming_soon ? '🟡 COMING SOON' : '⚪ PLANNED';
      const launch = state.launch_date ? ` (${state.launch_date.toISOString().split('T')[0]})` : '';
      console.log(`  ${status} ${state.name} (/${state.slug}/)${launch}`);
    });
    
    console.log('\n✅ MIGRATION COMPLETED SUCCESSFULLY!\n');
    console.log('Next Steps:');
    console.log('1. Test Bihar queries: curl http://localhost:3001/api/results');
    console.log('2. Update API routes to accept state slug parameter');
    console.log('3. Create /states page for state selection');
    console.log('4. Update homepage to show all states\n');
    
  } catch (error) {
    if (connection) {
      await connection.rollback();
      console.error('\n❌ MIGRATION FAILED - Transaction rolled back');
    }
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      connection.release();
    }
    await pool.end();
  }
}

// Run migration
runMigration().catch(console.error);
