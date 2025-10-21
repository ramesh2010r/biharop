const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateAdmin, requireSuperAdmin } = require('../middleware/auth');

/**
 * GET /api/settings/public
 * Get public system settings (no auth required)
 */
router.get('/public', async (req, res) => {
  try {
    const [settings] = await db.query('SELECT setting_key, setting_value FROM System_Settings WHERE setting_key IN (?, ?, ?)', 
      ['blackout_enforcement', 'duplicate_vote_prevention', 'anonymous_voting']
    );
    
    // Convert to key-value object
    const settingsObj = {};
    settings.forEach(setting => {
      settingsObj[setting.setting_key] = setting.setting_value === 'true';
    });
    
    res.json(settingsObj);
  } catch (error) {
    console.error('Error fetching public settings:', error);
    // Return defaults if error
    res.json({
      blackout_enforcement: true,
      duplicate_vote_prevention: true,
      anonymous_voting: true
    });
  }
});

/**
 * GET /api/admin/settings
 * Get all system settings
 */
router.get('/settings', authenticateAdmin, async (req, res) => {
  try {
    const [settings] = await db.query('SELECT * FROM System_Settings ORDER BY setting_key');
    
    // Convert to key-value object
    const settingsObj = {};
    settings.forEach(setting => {
      settingsObj[setting.setting_key] = setting.setting_value === 'true';
    });
    
    res.json(settingsObj);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'सेटिंग्स लोड नहीं हो सकीं' });
  }
});

/**
 * PUT /api/admin/settings/:key
 * Update a specific system setting
 */
router.put('/settings/:key', authenticateAdmin, requireSuperAdmin, async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    
    if (typeof value !== 'boolean') {
      return res.status(400).json({ error: 'मान सही या गलत होना चाहिए' });
    }
    
    const allowedKeys = ['blackout_enforcement', 'duplicate_vote_prevention', 'anonymous_voting'];
    if (!allowedKeys.includes(key)) {
      return res.status(400).json({ error: 'अमान्य सेटिंग कुंजी' });
    }
    
    await db.query(
      'UPDATE System_Settings SET setting_value = ?, updated_by = ?, updated_at = CURRENT_TIMESTAMP WHERE setting_key = ?',
      [value ? 'true' : 'false', req.admin.admin_id, key]
    );
    
    res.json({ 
      success: true, 
      message: 'सेटिंग अपडेट की गई',
      setting: key,
      value: value
    });
    
  } catch (error) {
    console.error('Error updating setting:', error);
    res.status(500).json({ error: 'सेटिंग अपडेट करने में त्रुटि' });
  }
});

module.exports = router;
