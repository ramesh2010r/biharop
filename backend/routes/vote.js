const express = require('express');
const router = express.Router();
const db = require('../config/database');
const crypto = require('crypto');

/**
 * Get system setting value
 */
async function getSystemSetting(key) {
  try {
    const [result] = await db.query(
      'SELECT setting_value FROM System_Settings WHERE setting_key = ?',
      [key]
    );
    return result.length > 0 ? result[0].setting_value === 'true' : true;
  } catch (error) {
    console.error('Error fetching system setting:', error);
    return true; // Default to enabled if error
  }
}

/**
 * Generate a simple fingerprint from request
 * In production, use FingerprintJS Pro for better accuracy
 */
function generateFingerprint(req) {
  const userAgent = req.headers['user-agent'] || '';
  const acceptLanguage = req.headers['accept-language'] || '';
  const acceptEncoding = req.headers['accept-encoding'] || '';
  
  const fingerprintString = `${userAgent}|${acceptLanguage}|${acceptEncoding}`;
  return crypto.createHash('sha256').update(fingerprintString).digest('hex');
}

/**
 * Get client IP address
 */
function getClientIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0] || 
         req.headers['x-real-ip'] || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress || 
         'unknown';
}

/**
 * POST /api/vote
 * Submit a vote/opinion
 */
router.post('/', async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    const { constituency_id, candidate_id } = req.body;
    
    // Validation
    if (!constituency_id || !candidate_id) {
      return res.status(400).json({ 
        error: 'कृपया सभी आवश्यक फ़ील्ड भरें',
        message: 'Constituency and candidate are required' 
      });
    }

    // Check if duplicate vote prevention is enabled
    const duplicatePreventionEnabled = await getSystemSetting('duplicate_vote_prevention');
    
    // Generate fingerprint and get IP
    const fingerprintId = generateFingerprint(req);
    const ipAddress = getClientIp(req);

    await connection.beginTransaction();

    // Only check for duplicates if prevention is enabled
    if (duplicatePreventionEnabled) {
      // Check for duplicate vote using fingerprint
      const [fingerprintCheck] = await connection.query(
        'SELECT id FROM Opinions WHERE fingerprint_hash = ? AND constituency_id = ? LIMIT 1',
        [fingerprintId, constituency_id]
      );

      if (fingerprintCheck.length > 0) {
        await connection.rollback();
        return res.status(409).json({ 
          error: 'आप पहले ही मतदान कर चुके हैं',
          message: 'You have already voted' 
        });
      }

      // Check for duplicate vote using IP address
      const [ipCheck] = await connection.query(
        'SELECT id FROM Opinions WHERE ip_address = ? AND constituency_id = ? LIMIT 1',
        [ipAddress, constituency_id]
      );

      if (ipCheck.length > 0) {
        await connection.rollback();
        return res.status(409).json({ 
          error: 'इस IP पते से पहले ही मतदान किया जा चुका है',
          message: 'A vote has already been cast from this IP address' 
        });
      }
    }

    // Verify candidate belongs to constituency
    const [candidateCheck] = await connection.query(
      'SELECT id FROM Candidates WHERE id = ? AND constituency_id = ?',
      [candidate_id, constituency_id]
    );

    if (candidateCheck.length === 0) {
      await connection.rollback();
      return res.status(400).json({ 
        error: 'अमान्य उम्मीदवार चयन',
        message: 'Invalid candidate selection for this constituency' 
      });
    }

    // Always store fingerprint and IP for security/audit purposes
    // The duplicate check above determines whether we enforce them
    // Even with settings disabled, we maintain the audit trail
    
    // Insert opinion (always store fingerprint/IP for audit trail)
    await connection.query(
      'INSERT INTO Opinions (constituency_id, candidate_id, fingerprint_hash, ip_address, user_agent) VALUES (?, ?, ?, ?, ?)',
      [constituency_id, candidate_id, fingerprintId, ipAddress, req.headers['user-agent'] || '']
    );

    // Update results summary (atomic operation)
    await connection.query(`
      INSERT INTO Results_Summary (constituency_id, candidate_id, vote_count) 
      VALUES (?, ?, 1) 
      ON DUPLICATE KEY UPDATE vote_count = vote_count + 1
    `, [constituency_id, candidate_id]);

    await connection.commit();

    res.status(201).json({ 
      success: true,
      message: 'आपका मत सफलतापूर्वक दर्ज हो गया है',
      messageEn: 'Your vote has been successfully recorded'
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error submitting vote:', error);
    res.status(500).json({ 
      error: 'मतदान में त्रुटि हुई',
      message: 'Error submitting vote' 
    });
  } finally {
    connection.release();
  }
});

module.exports = router;
