const express = require('express');
const router = express.Router();
const complianceEngine = require('../services/complianceEngine');

/**
 * GET /api/blackout-status
 * Check if results display is in blackout period
 */
router.get('/', async (req, res) => {
  try {
    const status = await complianceEngine.checkBlackoutStatus();
    res.json(status);
  } catch (error) {
    console.error('Error checking blackout status:', error);
    res.status(500).json({ 
      error: 'स्थिति जांच में त्रुटि',
      isBlackout: false
    });
  }
});

module.exports = router;
