const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function importDemoCandidates() {
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

    // Clear existing candidates and results
    console.log('\n🧹 Clearing existing candidates and results...');
    await connection.query('DELETE FROM Results_Summary');
    await connection.query('DELETE FROM Candidates');
    console.log('✓ Cleared existing data');

    // Get all parties
    const [parties] = await connection.query('SELECT id, short_code FROM Parties');
    const partyMap = {};
    parties.forEach(p => partyMap[p.short_code] = p.id);

    console.log('\n📋 Available parties:', Object.keys(partyMap).join(', '));

    // Get all constituencies
    const [constituencies] = await connection.query('SELECT id, seat_no, name_hindi FROM Constituencies ORDER BY seat_no ASC');
    
    console.log(`\n🗳️  Found ${constituencies.length} constituencies`);
    console.log('📝 Adding 3-5 demo candidates per constituency...\n');

    // Common Hindi first names for candidates
    const hindiFirstNames = [
      'राजेश', 'सुरेश', 'मुकेश', 'दिनेश', 'रमेश',
      'विजय', 'अजय', 'संजय', 'राज', 'अमित',
      'प्रमोद', 'प्रवीन', 'राकेश', 'नरेश', 'महेश',
      'सुनील', 'अनिल', 'कमल', 'विक्रम', 'मनोज',
      'राहुल', 'रोहित', 'सचिन', 'विशाल', 'आशीष',
      'नितिन', 'पवन', 'चंदन', 'रवि', 'शंकर',
      'प्रदीप', 'संदीप', 'अभिषेक', 'अंकित', 'निखिल'
    ];

    const hindiLastNames = [
      'कुमार', 'सिंह', 'यादव', 'प्रसाद', 'शर्मा',
      'वर्मा', 'गुप्ता', 'पाण्डेय', 'मिश्रा', 'तिवारी',
      'चौधरी', 'राय', 'झा', 'ठाकुर', 'पटेल',
      'मंडल', 'साहू', 'राम', 'दास', 'कुशवाहा',
      'मौर्या', 'सहनी', 'भारती', 'देवी', 'कुमारी'
    ];

    const englishFirstNames = [
      'Rajesh', 'Suresh', 'Mukesh', 'Dinesh', 'Ramesh',
      'Vijay', 'Ajay', 'Sanjay', 'Raj', 'Amit',
      'Pramod', 'Praveen', 'Rakesh', 'Naresh', 'Mahesh',
      'Sunil', 'Anil', 'Kamal', 'Vikram', 'Manoj',
      'Rahul', 'Rohit', 'Sachin', 'Vishal', 'Ashish',
      'Nitin', 'Pavan', 'Chandan', 'Ravi', 'Shankar',
      'Pradeep', 'Sandeep', 'Abhishek', 'Ankit', 'Nikhil'
    ];

    const englishLastNames = [
      'Kumar', 'Singh', 'Yadav', 'Prasad', 'Sharma',
      'Verma', 'Gupta', 'Pandey', 'Mishra', 'Tiwari',
      'Chaudhary', 'Rai', 'Jha', 'Thakur', 'Patel',
      'Mandal', 'Sahu', 'Ram', 'Das', 'Kushwaha',
      'Maurya', 'Sahni', 'Bharti', 'Devi', 'Kumari'
    ];

    // Party distribution strategy for realistic scenario
    const mainParties = ['BJP', 'RJD', 'JDU', 'INC'];
    const smallerParties = ['CPIM', 'LJPRV', 'IND'];

    let totalCandidates = 0;
    let processedCount = 0;

    // Add candidates for each constituency
    for (const constituency of constituencies) {
      const numCandidates = Math.floor(Math.random() * 3) + 3; // 3-5 candidates per constituency
      const usedNames = new Set();
      const usedParties = new Set();

      // Ensure main parties get representation
      const constituencyParties = [...mainParties];
      
      // Add some smaller parties randomly
      if (Math.random() > 0.5) {
        constituencyParties.push(smallerParties[Math.floor(Math.random() * smallerParties.length)]);
      }
      if (Math.random() > 0.7) {
        constituencyParties.push(smallerParties[Math.floor(Math.random() * smallerParties.length)]);
      }

      // Shuffle parties
      constituencyParties.sort(() => Math.random() - 0.5);

      for (let i = 0; i < numCandidates && i < constituencyParties.length; i++) {
        let candidateNameHindi, candidateNameEnglish;
        
        // Generate unique name
        do {
          const firstNameIndex = Math.floor(Math.random() * hindiFirstNames.length);
          const lastNameIndex = Math.floor(Math.random() * hindiLastNames.length);
          
          candidateNameHindi = `${hindiFirstNames[firstNameIndex]} ${hindiLastNames[lastNameIndex]}`;
          candidateNameEnglish = `${englishFirstNames[firstNameIndex]} ${englishLastNames[lastNameIndex]}`;
        } while (usedNames.has(candidateNameHindi));

        usedNames.add(candidateNameHindi);

        const partyCode = constituencyParties[i];
        const partyId = partyMap[partyCode];

        if (!partyId) {
          console.warn(`⚠️  Party not found: ${partyCode}`);
          continue;
        }

        // Insert candidate
        await connection.query(
          `INSERT INTO Candidates (name_hindi, name_english, constituency_id, party_id) 
           VALUES (?, ?, ?, ?)`,
          [candidateNameHindi, candidateNameEnglish, constituency.id, partyId]
        );

        // Initialize Results_Summary entry
        const [candidateResult] = await connection.query(
          'SELECT id FROM Candidates WHERE name_hindi = ? AND constituency_id = ?',
          [candidateNameHindi, constituency.id]
        );

        if (candidateResult.length > 0) {
          await connection.query(
            `INSERT INTO Results_Summary (constituency_id, candidate_id, vote_count) 
             VALUES (?, ?, 0)`,
            [constituency.id, candidateResult[0].id]
          );
        }

        totalCandidates++;
      }

      processedCount++;
      if (processedCount % 50 === 0) {
        console.log(`✓ Processed ${processedCount}/${constituencies.length} constituencies...`);
      }
    }

    console.log(`\n✅ Successfully added ${totalCandidates} demo candidates!`);

    // Verify data
    const [candidateCount] = await connection.query('SELECT COUNT(*) as count FROM Candidates');
    const [resultsSummaryCount] = await connection.query('SELECT COUNT(*) as count FROM Results_Summary');

    console.log('\n📊 Database Summary:');
    console.log(`   Total Candidates: ${candidateCount[0].count}`);
    console.log(`   Results Summary Entries: ${resultsSummaryCount[0].count}`);

    // Show sample data
    console.log('\n📋 Sample Candidates:');
    const [sampleCandidates] = await connection.query(`
      SELECT 
        c.name_hindi, 
        c.name_english,
        p.short_code as party,
        co.name_hindi as constituency
      FROM Candidates c
      JOIN Parties p ON c.party_id = p.id
      JOIN Constituencies co ON c.constituency_id = co.id
      ORDER BY RAND()
      LIMIT 10
    `);

    sampleCandidates.forEach((candidate, index) => {
      console.log(`   ${index + 1}. ${candidate.name_hindi} (${candidate.name_english}) - ${candidate.party}`);
      console.log(`      Constituency: ${candidate.constituency}`);
    });

    console.log('\n🎯 Next steps:');
    console.log('   1. Restart the backend server if needed');
    console.log('   2. Visit http://localhost:3000/vote');
    console.log('   3. Select a district and constituency to see candidates');
    console.log('   4. Test the voting flow end-to-end');

  } catch (error) {
    console.error('❌ Error during import:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the import
importDemoCandidates()
  .then(() => {
    console.log('\n✨ Demo candidates import completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });
