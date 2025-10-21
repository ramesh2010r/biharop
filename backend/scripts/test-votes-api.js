require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const db = require('../config/database');

async function testVotesAPI() {
  try {
    const limit = 5;
    
    console.log('Testing the votes API query...\n');
    
    const [votes] = await db.query(`
      SELECT 
        o.id as opinion_id,
        o.candidate_id,
        o.constituency_id,
        o.voted_at as created_at,
        c.name_hindi as candidate_name_hindi,
        c.name_english as candidate_name_english,
        con.name_hindi as constituency_name_hindi,
        con.name_english as constituency_name_english,
        p.short_code as party_abbreviation
      FROM Opinions o
      LEFT JOIN Candidates c ON o.candidate_id = c.id
      LEFT JOIN Constituencies con ON o.constituency_id = con.id
      LEFT JOIN Parties p ON c.party_id = p.id
      ORDER BY o.voted_at DESC
      LIMIT ?
    `, [parseInt(limit)]);

    console.log(`Found ${votes.length} votes\n`);
    
    // Format response (same as API)
    const formattedVotes = votes.map(vote => ({
      opinion_id: vote.opinion_id,
      candidate_id: vote.candidate_id,
      constituency_id: vote.constituency_id,
      created_at: vote.created_at,
      candidate: {
        name_hindi: vote.candidate_name_hindi,
        name_english: vote.candidate_name_english,
        party: {
          abbreviation: vote.party_abbreviation
        }
      },
      constituency: {
        name_hindi: vote.constituency_name_hindi,
        name_english: vote.constituency_name_english
      }
    }));

    console.log('Formatted API Response:');
    console.log(JSON.stringify({ votes: formattedVotes }, null, 2));
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testVotesAPI();
