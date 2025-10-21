const express = require('express');
const router = express.Router();
const db = require('../config/database');

/**
 * GET /api/constituencies/:districtId
 * Get all constituencies for a district
 */
router.get('/:districtId', async (req, res) => {
  try {
    const [constituencies] = await db.query(`
      SELECT id, district_id, seat_no, name_hindi, name_english, is_reserved, reservation_type 
      FROM Constituencies 
      WHERE district_id = ?
      ORDER BY seat_no ASC
    `, [req.params.districtId]);
    
    res.json(constituencies);
  } catch (error) {
    console.error('Error fetching constituencies:', error);
    res.status(500).json({ error: 'विधानसभा क्षेत्र लोड नहीं हो सके' });
  }
});

module.exports = router;
