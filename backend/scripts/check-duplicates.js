const db = require('../config/database');

async function checkDuplicates() {
  try {
    console.log('\n🔍 CHECKING FOR DUPLICATES IN DATABASE...\n');
    
    // 1. Check for duplicate parties
    console.log('1️⃣ Checking for DUPLICATE PARTIES:\n');
    const [duplicateParties] = await db.query(`
      SELECT 
        short_code,
        name_hindi,
        COUNT(*) as count
      FROM Parties
      GROUP BY short_code, name_hindi
      HAVING COUNT(*) > 1
      ORDER BY count DESC
    `);
    
    if (duplicateParties.length > 0) {
      console.log('❌ Found duplicate parties:');
      console.table(duplicateParties);
      
      // Get details of these duplicates
      for (const dup of duplicateParties) {
        const [details] = await db.query(
          'SELECT id, short_code, name_hindi, name_english, symbol_url FROM Parties WHERE short_code = ?',
          [dup.short_code]
        );
        console.log(`\nDetails for ${dup.short_code}:`);
        console.table(details);
      }
    } else {
      console.log('✅ No duplicate parties found\n');
    }
    
    // 2. Check for duplicate candidates in same constituency
    console.log('\n2️⃣ Checking for DUPLICATE CANDIDATES (same party in same constituency):\n');
    const [duplicateCandidates] = await db.query(`
      SELECT 
        c.constituency_id,
        con.name_hindi as constituency_name,
        c.party_id,
        p.short_code,
        p.name_hindi as party_name,
        COUNT(*) as candidate_count,
        GROUP_CONCAT(c.name_hindi SEPARATOR ', ') as candidates
      FROM Candidates c
      JOIN Parties p ON c.party_id = p.id
      JOIN Constituencies con ON c.constituency_id = con.id
      GROUP BY c.constituency_id, c.party_id
      HAVING COUNT(*) > 1
      ORDER BY candidate_count DESC, c.constituency_id
    `);
    
    if (duplicateCandidates.length > 0) {
      console.log(`❌ Found ${duplicateCandidates.length} cases of duplicate candidates (same party, same constituency):`);
      console.table(duplicateCandidates.map(d => ({
        Constituency: d.constituency_name?.substring(0, 30) || d.constituency_id,
        Party: d.short_code,
        'Party Name': d.party_name?.substring(0, 30),
        'Candidate Count': d.candidate_count,
        'Candidates': d.candidates?.substring(0, 50)
      })));
    } else {
      console.log('✅ No duplicate candidates found (same party in same constituency)\n');
    }
    
    // 3. Check for party alliances with duplicates
    console.log('\n3️⃣ Checking for PARTY ALLIANCE issues:\n');
    const [allianceStats] = await db.query(`
      SELECT 
        p.short_code,
        p.name_hindi as party_name,
        COUNT(DISTINCT c.constituency_id) as constituencies_count,
        COUNT(c.id) as total_candidates
      FROM Parties p
      LEFT JOIN Candidates c ON p.id = c.party_id
      GROUP BY p.id
      ORDER BY total_candidates DESC
    `);
    
    console.log('Party Alliance Statistics:');
    console.table(allianceStats.slice(0, 15).map(p => ({
      Party: p.short_code,
      'Party Name': p.party_name?.substring(0, 30),
      'Constituencies': p.constituencies_count,
      'Total Candidates': p.total_candidates
    })));
    
    // 4. Check constituencies with multiple candidates from allied parties
    console.log('\n4️⃣ Checking constituencies with MULTIPLE CANDIDATES from major alliances:\n');
    
    // NDA alliance check (BJP, JDU, LJP, etc.)
    const [ndaDuplicates] = await db.query(`
      SELECT 
        con.id as constituency_id,
        con.name_hindi as constituency_name,
        GROUP_CONCAT(DISTINCT p.short_code ORDER BY p.short_code SEPARATOR ', ') as nda_parties,
        COUNT(*) as nda_candidate_count,
        GROUP_CONCAT(c.name_hindi SEPARATOR ', ') as candidates
      FROM Candidates c
      JOIN Parties p ON c.party_id = p.id
      JOIN Constituencies con ON c.constituency_id = con.id
      WHERE p.short_code IN ('BJP', 'JDU', 'LJP', 'LJPRV', 'HAM', 'HAMS')
      GROUP BY c.constituency_id
      HAVING COUNT(*) > 1
      ORDER BY nda_candidate_count DESC
    `);
    
    if (ndaDuplicates.length > 0) {
      console.log(`❌ Found ${ndaDuplicates.length} constituencies with multiple NDA candidates:`);
      console.table(ndaDuplicates.map(d => ({
        'Constituency': d.constituency_name?.substring(0, 30),
        'NDA Parties': d.nda_parties,
        'Count': d.nda_candidate_count,
        'Candidates': d.candidates?.substring(0, 40)
      })));
    } else {
      console.log('✅ No constituencies with multiple NDA alliance candidates\n');
    }
    
    // INDIA alliance check (INC, RJD, CPI, CPIM, CPI(ML), etc.)
    const [indiaDuplicates] = await db.query(`
      SELECT 
        con.id as constituency_id,
        con.name_hindi as constituency_name,
        GROUP_CONCAT(DISTINCT p.short_code ORDER BY p.short_code SEPARATOR ', ') as india_parties,
        COUNT(*) as india_candidate_count,
        GROUP_CONCAT(c.name_hindi SEPARATOR ', ') as candidates
      FROM Candidates c
      JOIN Parties p ON c.party_id = p.id
      JOIN Constituencies con ON c.constituency_id = con.id
      WHERE p.short_code IN ('INC', 'RJD', 'CPI', 'CPIM', 'CPI(ML)', 'CPIML')
      GROUP BY c.constituency_id
      HAVING COUNT(*) > 1
      ORDER BY india_candidate_count DESC
    `);
    
    if (indiaDuplicates.length > 0) {
      console.log(`\n❌ Found ${indiaDuplicates.length} constituencies with multiple INDIA alliance candidates:`);
      console.table(indiaDuplicates.map(d => ({
        'Constituency': d.constituency_name?.substring(0, 30),
        'INDIA Parties': d.india_parties,
        'Count': d.india_candidate_count,
        'Candidates': d.candidates?.substring(0, 40)
      })));
    } else {
      console.log('✅ No constituencies with multiple INDIA alliance candidates\n');
    }
    
    // 5. Summary statistics
    console.log('\n📊 OVERALL STATISTICS:\n');
    const [stats] = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM Parties) as total_parties,
        (SELECT COUNT(*) FROM Constituencies) as total_constituencies,
        (SELECT COUNT(*) FROM Candidates) as total_candidates,
        (SELECT COUNT(DISTINCT constituency_id) FROM Candidates) as constituencies_with_candidates
    `);
    
    console.table([{
      'Total Parties': stats[0].total_parties,
      'Total Constituencies': stats[0].total_constituencies,
      'Total Candidates': stats[0].total_candidates,
      'Constituencies with Candidates': stats[0].constituencies_with_candidates
    }]);
    
    // Calculate average candidates per constituency
    const [avgStats] = await db.query(`
      SELECT 
        constituency_id,
        COUNT(*) as candidate_count
      FROM Candidates
      GROUP BY constituency_id
      ORDER BY candidate_count DESC
      LIMIT 10
    `);
    
    if (avgStats.length > 0) {
      console.log('\n📈 Top 10 Constituencies by Candidate Count:');
      const [constituencies] = await db.query(`
        SELECT 
          con.id as constituency_id,
          con.name_hindi,
          COUNT(c.id) as candidate_count
        FROM Constituencies con
        LEFT JOIN Candidates c ON con.id = c.constituency_id
        GROUP BY con.id
        ORDER BY candidate_count DESC
        LIMIT 10
      `);
      console.table(constituencies.map(c => ({
        'Constituency': c.name_hindi?.substring(0, 30),
        'Candidates': c.candidate_count
      })));
    }
    
    console.log('\n✅ Duplicate check complete!\n');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkDuplicates();
