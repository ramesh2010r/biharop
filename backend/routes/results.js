const express = require('express');
const router = express.Router();
const db = require('../config/database');
const complianceEngine = require('../services/complianceEngine');

/**
 * GET /api/results/:constituencyId
 * Get voting results for a constituency (respects blackout periods)
 */
router.get('/:constituencyId', async (req, res) => {
  try {
    // Check blackout status first
    const blackoutStatus = await complianceEngine.checkBlackoutStatus();
    
    if (blackoutStatus.isBlackout) {
      return res.json({
        status: 'blackout_active',
        message: blackoutStatus.message,
        nextAvailableDate: blackoutStatus.nextAvailableDate
      });
    }

    const constituencyId = req.params.constituencyId;

    // Fetch results from the pre-aggregated Results_Summary table
    const [results] = await db.query(`
      SELECT 
        c.name_hindi AS candidate_name_hindi,
        c.name_english AS candidate_name_english,
        p.name_hindi AS party_name_hindi,
        p.name_english AS party_name_english,
        p.short_code AS party_abbreviation,
        rs.vote_count AS total_votes,
        c.photo_url,
        p.color_code AS party_color
      FROM Results_Summary rs
      JOIN Candidates c ON rs.candidate_id = c.id
      JOIN Parties p ON c.party_id = p.id
      WHERE rs.constituency_id = ?
      ORDER BY rs.vote_count DESC
    `, [constituencyId]);

    if (results.length === 0) {
      return res.json([]);
    }

    // Calculate total votes and percentages
    const totalVotes = results.reduce((sum, r) => sum + r.total_votes, 0);
    
    const formattedResults = results.map(result => ({
      candidate_name_hindi: result.candidate_name_hindi,
      candidate_name_english: result.candidate_name_english,
      party_name_hindi: result.party_name_hindi,
      party_name_english: result.party_name_english,
      party_abbreviation: result.party_abbreviation,
      party_color: result.party_color,
      total_votes: result.total_votes,
      percentage: totalVotes > 0 ? (result.total_votes / totalVotes) * 100 : 0,
      photo_url: result.photo_url
    }));

    res.json(formattedResults);

  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({ 
      error: 'परिणाम लोड नहीं हो सके',
      message: 'Error loading results' 
    });
  }
});

/**
 * GET /api/results/district/:districtId
 * Get aggregated results for all constituencies in a district
 */
router.get('/district/:districtId', async (req, res) => {
  try {
    // Check blackout status first
    const blackoutStatus = await complianceEngine.checkBlackoutStatus();
    
    if (blackoutStatus.isBlackout) {
      return res.json({
        status: 'blackout_active',
        message: blackoutStatus.message,
        nextAvailableDate: blackoutStatus.nextAvailableDate
      });
    }

    const districtId = req.params.districtId;

    const [results] = await db.query(`
      SELECT 
        cons.name AS constituency_name,
        c.name AS candidate_name,
        p.name AS party_name,
        p.abbreviation AS party_abbreviation,
        rs.total_votes
      FROM Results_Summary rs
      JOIN Candidates c ON rs.candidate_id = c.candidate_id
      JOIN Parties p ON c.party_id = p.party_id
      JOIN Constituencies cons ON rs.constituency_id = cons.constituency_id
      WHERE cons.district_id = ?
      ORDER BY cons.name ASC, rs.total_votes DESC
    `, [districtId]);

    res.json(results);

  } catch (error) {
    console.error('Error fetching district results:', error);
    res.status(500).json({ 
      error: 'जिले के परिणाम लोड नहीं हो सके',
      message: 'Error loading district results' 
    });
  }
});

module.exports = router;
