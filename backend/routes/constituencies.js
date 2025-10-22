const express = require('express');
const router = express.Router();
const db = require('../config/database');

/**
 * GET /api/constituencies/:districtId
 * Get all constituencies for a district
 */
router.get('/:districtId', async (req, res) => {
  try {
    // Set aggressive cache headers (constituencies rarely change)
    res.set({
      'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000',
      'ETag': `constituencies-${req.params.districtId}-v1`,
      'Last-Modified': new Date('2025-01-01').toUTCString()
    });
    
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
