const express = require('express');
const router = express.Router();
const db = require('../config/database');

/**
 * GET /api/districts
 * Get all districts
 */
router.get('/', async (req, res) => {
  try {
    const [districts] = await db.query(`
      SELECT id, name_hindi, name_english 
      FROM Districts 
      ORDER BY name_hindi ASC
    `);
    
    res.json(districts);
  } catch (error) {
    console.error('Error fetching districts:', error);
    res.status(500).json({ error: 'जिले लोड नहीं हो सके' });
  }
});

/**
 * GET /api/districts/:id
 * Get a specific district
 */
router.get('/:id', async (req, res) => {
  try {
    const [districts] = await db.query(
      'SELECT district_id, name FROM Districts WHERE district_id = ?',
      [req.params.id]
    );
    
    if (districts.length === 0) {
      return res.status(404).json({ error: 'जिला नहीं मिला' });
    }
    
    res.json(districts[0]);
  } catch (error) {
    console.error('Error fetching district:', error);
    res.status(500).json({ error: 'जिला लोड नहीं हो सका' });
  }
});

module.exports = router;
