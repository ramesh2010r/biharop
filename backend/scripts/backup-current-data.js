const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

/**
 * Backup current candidate data before importing real data
 */
async function backupCurrentData() {
  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log('✓ Connected to MySQL database');

    // Get current candidates with all related data
    const [candidates] = await connection.query(`
      SELECT 
        c.id,
        c.name_hindi,
        c.name_english,
        c.photo_url,
        const.name_hindi as constituency_name,
        const.seat_no,
        p.name_hindi as party_name,
        p.short_code as party_code,
        p.symbol_url as party_symbol
      FROM Candidates c
      JOIN Constituencies const ON c.constituency_id = const.id
      JOIN Parties p ON c.party_id = p.id
      ORDER BY const.seat_no, c.name_hindi
    `);

    console.log(`📊 Found ${candidates.length} candidates to backup`);

    // Get vote counts
    const [votes] = await connection.query(`
      SELECT 
        candidate_id,
        COUNT(*) as vote_count
      FROM Opinions
      GROUP BY candidate_id
    `);

    const voteMap = {};
    votes.forEach(v => voteMap[v.candidate_id] = v.vote_count);

    // Create backup data structure
    const backupData = {
      backup_date: new Date().toISOString(),
      total_candidates: candidates.length,
      total_votes: votes.reduce((sum, v) => sum + parseInt(v.vote_count), 0),
      candidates: candidates.map(c => ({
        ...c,
        vote_count: voteMap[c.id] || 0
      }))
    };

    // Write backup file
    const backupFileName = `candidates-backup-${new Date().toISOString().split('T')[0]}.json`;
    const backupPath = path.join(__dirname, backupFileName);
    
    fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2));

    console.log(`✅ Backup saved to: ${backupFileName}`);
    console.log(`📊 Backup summary:`);
    console.log(`   - ${backupData.total_candidates} candidates`);
    console.log(`   - ${backupData.total_votes} total votes`);
    console.log(`   - ${[...new Set(candidates.map(c => c.constituency_name))].length} constituencies`);

    // Show constituencies with vote counts
    const constituencyStats = {};
    candidates.forEach(c => {
      if (!constituencyStats[c.constituency_name]) {
        constituencyStats[c.constituency_name] = { candidates: 0, votes: 0 };
      }
      constituencyStats[c.constituency_name].candidates++;
      constituencyStats[c.constituency_name].votes += (voteMap[c.id] || 0);
    });

    console.log('\n📋 Current data by constituency:');
    Object.entries(constituencyStats).forEach(([name, stats]) => {
      console.log(`   ${name}: ${stats.candidates} candidates, ${stats.votes} votes`);
    });

  } catch (error) {
    console.error('❌ Error creating backup:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n✓ Database connection closed');
    }
  }
}

backupCurrentData();