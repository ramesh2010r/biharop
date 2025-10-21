const express = require('express');
const router = express.Router();
const db = require('../config/database');

/**
 * GET /api/candidates/:constituencyId
 * Get all candidates for a constituency with party information
 */
router.get('/:constituencyId', async (req, res) => {
  try {
    const [candidates] = await db.query(`
      SELECT 
        c.id AS candidate_id,
        c.name_hindi,
        c.name_english,
        c.constituency_id,
        c.photo_url,
        p.id AS party_id,
        p.name_hindi AS party_name_hindi,
        p.name_english AS party_name_english,
        p.short_code AS party_abbreviation,
        p.symbol_url AS party_symbol,
        p.color_code AS party_color
      FROM Candidates c
      JOIN Parties p ON c.party_id = p.id
      WHERE c.constituency_id = ?
      ORDER BY c.name_hindi ASC
    `, [req.params.constituencyId]);
    
    // Format the response
    const formattedCandidates = candidates.map(candidate => ({
      candidate_id: candidate.candidate_id,
      name_hindi: candidate.name_hindi,
      name_english: candidate.name_english,
      constituency_id: candidate.constituency_id,
      photo_url: candidate.photo_url,
      party: {
        party_id: candidate.party_id,
        name_hindi: candidate.party_name_hindi,
        name_english: candidate.party_name_english,
        abbreviation: candidate.party_abbreviation,
        symbol_url: candidate.party_symbol,
        color_code: candidate.party_color
      }
    }));
    
    res.json(formattedCandidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ error: 'उम्मीदवार लोड नहीं हो सके' });
  }
});

module.exports = router;

module.exports = router;
