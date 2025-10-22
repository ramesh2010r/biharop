const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get prediction data grouped by party alliances
router.get('/predictions', async (req, res) => {
  try {
    // Get vote counts by party
    const [votesByParty] = await db.query(`
      SELECT 
        p.party_id,
        p.name_hindi as party_name,
        p.abbreviation,
        COUNT(DISTINCT o.constituency_id) as leading_constituencies,
        COUNT(o.opinion_id) as total_votes,
        (COUNT(o.opinion_id) * 100.0 / (SELECT COUNT(*) FROM opinions)) as vote_percentage
      FROM opinions o
      JOIN candidates c ON o.candidate_id = c.candidate_id
      JOIN parties p ON c.party_id = p.party_id
      GROUP BY p.party_id, p.name_hindi, p.abbreviation
      ORDER BY total_votes DESC
    `);

    // Get leading party per constituency
    const [leadingByConstituency] = await db.query(`
      SELECT 
        o.constituency_id,
        p.party_id,
        p.abbreviation,
        COUNT(o.opinion_id) as votes,
        ROW_NUMBER() OVER (PARTITION BY o.constituency_id ORDER BY COUNT(o.opinion_id) DESC) as rank
      FROM opinions o
      JOIN candidates c ON o.candidate_id = c.candidate_id
      JOIN parties p ON c.party_id = p.party_id
      GROUP BY o.constituency_id, p.party_id, p.abbreviation
    `);

    // Filter only leading parties (rank 1)
    const leadingParties = leadingByConstituency.filter(l => l.rank === 1);

    // Count leading constituencies per party
    const leadingCount = {};
    leadingParties.forEach(l => {
      leadingCount[l.party_id] = (leadingCount[l.party_id] || 0) + 1;
    });

    // Party alliance groupings
    const INDIA_ALLIANCE = ['INC', 'RJD', 'CPIM', 'CPI', 'CONG', 'RLD'];
    const NDA_ALLIANCE = ['BJP', 'JDU', 'LJP', 'LJPRV'];

    // Group parties by alliance
    const indiaParties = votesByParty.filter(p => 
      INDIA_ALLIANCE.includes(p.abbreviation?.toUpperCase())
    );
    const ndaParties = votesByParty.filter(p => 
      NDA_ALLIANCE.includes(p.abbreviation?.toUpperCase())
    );
    const otherParties = votesByParty.filter(p => 
      !INDIA_ALLIANCE.includes(p.abbreviation?.toUpperCase()) && 
      !NDA_ALLIANCE.includes(p.abbreviation?.toUpperCase())
    );

    // Calculate alliance totals
    const calculateAllianceData = (parties, name, color) => {
      const totalVotes = parties.reduce((sum, p) => sum + parseInt(p.total_votes), 0);
      const votePercentage = parties.reduce((sum, p) => sum + parseFloat(p.vote_percentage || 0), 0);
      const leadingIn = parties.reduce((sum, p) => sum + (leadingCount[p.party_id] || 0), 0);
      
      // Project seats based on vote share with slight adjustment for leading constituencies
      const projectedSeats = Math.round((votePercentage / 100) * 243 * 1.1) + Math.floor(leadingIn * 0.3);
      
      return {
        groupName: name,
        groupColor: color,
        totalSeats: 243,
        projectedSeats: Math.min(projectedSeats, 243),
        percentage: votePercentage,
        leadingIn: leadingIn,
        parties: parties.map(p => p.abbreviation || p.party_name)
      };
    };

    const predictions = [
      calculateAllianceData(ndaParties, 'NDA Alliance', '#ff6b35'),
      calculateAllianceData(indiaParties, 'INDIA Alliance', '#0077b6'),
      calculateAllianceData(otherParties, 'Other Parties', '#6c757d')
    ].filter(p => p.projectedSeats > 0)
     .sort((a, b) => b.projectedSeats - a.projectedSeats);

    res.json({
      success: true,
      predictions,
      totalSeats: 243,
      majorityMark: 122,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching predictions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch prediction data',
      predictions: []
    });
  }
});

module.exports = router;
