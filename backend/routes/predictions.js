const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Updated Party alliance mappings based on Bihar Election 2025
const INDIA_ALLIANCE = ['INC', 'RJD', 'CPIM', 'CPI', 'CPI(ML)', 'CONG', 'RLD'];
const NDA_ALLIANCE = ['BJP', 'JDU', 'LJP', 'LJPRV', 'HAM', 'RLJP'];
const JAN_SURAJ = ['JSKP', 'JSP']; // Jan Suraaj Party (Prashant Kishor)
const AAP_ALLIANCE = ['AAP']; // Aam Aadmi Party

// Simple prediction: Count which party is leading (most votes) in each constituency
router.get('/predictions', async (req, res) => {
  try {
    // Step 1: Get the leading party in each constituency (simple: whoever has most votes wins)
    const [constituencies] = await db.query(`
      SELECT 
        o.constituency_id,
        con.name_english as constituency_name,
        p.abbreviation as party_abbreviation,
        p.name_english as party_name,
        COUNT(o.id) as votes,
        ROUND(COUNT(o.id) * 100.0 / SUM(COUNT(o.id)) OVER (PARTITION BY o.constituency_id), 2) as vote_percentage
      FROM Opinions o
      JOIN Candidates c ON o.candidate_id = c.id
      JOIN Parties p ON c.party_id = p.id
      JOIN Constituencies con ON o.constituency_id = con.id
      GROUP BY o.constituency_id, con.name_english, p.id, p.abbreviation, p.name_english
      ORDER BY o.constituency_id, votes DESC
    `);

    if (constituencies.length === 0) {
      return res.json({
        success: true,
        predictions: [],
        totalSeats: 243,
        majorityMark: 122,
        message: 'No voting data available yet'
      });
    }

    // Step 2: For each constituency, find the winner (party with most votes)
    const constituencyWinners = {};
    const partyVoteData = {};
    
    constituencies.forEach(row => {
      const constId = row.constituency_id;
      const party = row.party_abbreviation;
      
      // Track winner per constituency
      if (!constituencyWinners[constId] || row.votes > constituencyWinners[constId].votes) {
        constituencyWinners[constId] = {
          party: party,
          votes: row.votes,
          percentage: row.vote_percentage,
          name: row.constituency_name
        };
      }
      
      // Track total votes per party across all constituencies
      if (!partyVoteData[party]) {
        partyVoteData[party] = {
          name: row.party_name,
          totalVotes: 0,
          seatsWon: 0
        };
      }
      partyVoteData[party].totalVotes += parseInt(row.votes);
    });

    // Step 3: Count seats won by each party
    Object.values(constituencyWinners).forEach(winner => {
      if (partyVoteData[winner.party]) {
        partyVoteData[winner.party].seatsWon += 1;
      }
    });

    // Step 4: Calculate total votes for percentage
    const totalVotesOverall = Object.values(partyVoteData).reduce((sum, p) => sum + p.totalVotes, 0);
    Object.keys(partyVoteData).forEach(party => {
      partyVoteData[party].percentage = ((partyVoteData[party].totalVotes / totalVotesOverall) * 100).toFixed(2);
    });

    // Step 5: Group by alliance
    const calculateAllianceData = (allianceName, partyAbbreviations, color) => {
      let totalSeats = 0;
      let totalVotes = 0;
      const parties = [];

      partyAbbreviations.forEach(abbr => {
        if (partyVoteData[abbr]) {
          totalSeats += partyVoteData[abbr].seatsWon;
          totalVotes += partyVoteData[abbr].totalVotes;
          
          if (partyVoteData[abbr].seatsWon > 0) {
            parties.push({
              abbreviation: abbr,
              name: partyVoteData[abbr].name,
              seats: partyVoteData[abbr].seatsWon,
              votes: partyVoteData[abbr].totalVotes,
              percentage: partyVoteData[abbr].percentage
            });
          }
        }
      });

      const percentage = totalVotesOverall > 0 ? ((totalVotes / totalVotesOverall) * 100).toFixed(2) : 0;

      return {
        groupName: allianceName,
        groupColor: color,
        projectedSeats: totalSeats,
        percentage: parseFloat(percentage),
        leadingIn: totalSeats,
        parties
      };
    };

    // Calculate for all alliances
    const allPredictions = [
      calculateAllianceData('NDA', NDA_ALLIANCE, '#FF6B00'),
      calculateAllianceData('INDIA', INDIA_ALLIANCE, '#FF9933'),
      calculateAllianceData('Jan Suraaj', JAN_SURAJ, '#00A86B'),
      calculateAllianceData('AAP', AAP_ALLIANCE, '#0066CC')
    ];

    // Add Others (parties not in any major alliance)
    const knownParties = [...INDIA_ALLIANCE, ...NDA_ALLIANCE, ...JAN_SURAJ, ...AAP_ALLIANCE];
    const otherParties = Object.keys(partyVoteData).filter(abbr => !knownParties.includes(abbr));
    
    if (otherParties.length > 0) {
      const othersData = calculateAllianceData('Others', otherParties, '#808080');
      if (othersData.projectedSeats > 0) {
        allPredictions.push(othersData);
      }
    }

    // Filter and sort
    const predictions = allPredictions
      .filter(alliance => alliance.projectedSeats > 0)
      .sort((a, b) => b.projectedSeats - a.projectedSeats);

    res.json({
      success: true,
      predictions,
      totalSeats: 243,
      majorityMark: 122,
      constituenciesReported: Object.keys(constituencyWinners).length,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching predictions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch prediction data',
      predictions: [],
      message: error.message
    });
  }
});

module.exports = router;
