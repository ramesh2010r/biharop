const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const complianceEngine = require('../services/complianceEngine');
const { authenticateAdmin, requireSuperAdmin } = require('../middleware/auth');

/**
 * POST /api/admin/login
 * Admin login
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'उपयोगकर्ता नाम और पासवर्ड आवश्यक हैं' });
    }

    const [admins] = await db.query(
      'SELECT id, username, password_hash, role FROM Admins WHERE username = ?',
      [username]
    );

    if (admins.length === 0) {
      return res.status(401).json({ error: 'अमान्य क्रेडेंशियल' });
    }

    const admin = admins[0];
    const isValidPassword = await bcrypt.compare(password, admin.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'अमान्य क्रेडेंशियल' });
    }

    // Update last_login
    await db.query(
      'UPDATE Admins SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
      [admin.id]
    );

    const token = jwt.sign(
      { 
        admin_id: admin.id, 
        username: admin.username, 
        role: admin.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      admin: {
        admin_id: admin.id,
        username: admin.username,
        role: admin.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'लॉगिन में त्रुटि' });
  }
});

/**
 * GET /api/admin/stats
 * Get overall statistics
 */
router.get('/stats', authenticateAdmin, async (req, res) => {
  try {
    const [totalVotes] = await db.query('SELECT COUNT(*) as count FROM Opinions');
    const [totalConstituencies] = await db.query('SELECT COUNT(*) as count FROM Constituencies');
    const [totalCandidates] = await db.query('SELECT COUNT(*) as count FROM Candidates');
    const [totalDistricts] = await db.query('SELECT COUNT(*) as count FROM Districts');
    const [totalParties] = await db.query('SELECT COUNT(*) as count FROM Parties');
    
    // Get active phase
    const [activePhases] = await db.query(
      'SELECT phase_number FROM Election_Phases WHERE status = ? LIMIT 1',
      ['Voting']
    );
    
    // Check if blackout is active
    const blackoutStatus = await complianceEngine.checkBlackoutStatus();

    res.json({
      totalVotes: totalVotes[0].count,
      totalConstituencies: totalConstituencies[0].count,
      totalCandidates: totalCandidates[0].count,
      totalDistricts: totalDistricts[0].count,
      totalParties: totalParties[0].count,
      activePhase: activePhases.length > 0 ? `Phase ${activePhases[0].phase_number}` : 'No Active Phase',
      blackoutActive: blackoutStatus.inBlackout || false
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'आंकड़े लोड नहीं हो सके' });
  }
});

// ==================== ELECTION PHASE MANAGEMENT ====================

/**
 * GET /api/admin/phases
 * Get all election phases
 */
router.get('/phases', authenticateAdmin, async (req, res) => {
  try {
    const phases = await complianceEngine.getActivePhases();
    
    // Get constituency count for each phase
    for (let phase of phases) {
      const [count] = await db.query(
        'SELECT COUNT(*) as count FROM Constituencies WHERE phase_id = ?',
        [phase.id || phase.phase_id]
      );
      phase.constituency_count = count[0].count;
    }
    
    res.json(phases);
  } catch (error) {
    console.error('Error fetching phases:', error);
    res.status(500).json({ error: 'चरण लोड नहीं हो सके' });
  }
});

/**
 * POST /api/admin/phases
 * Add a new election phase
 */
router.post('/phases', authenticateAdmin, requireSuperAdmin, async (req, res) => {
  try {
    const { phase_number, voting_date, result_date } = req.body;

    if (!phase_number || !voting_date || !result_date) {
      return res.status(400).json({ error: 'सभी फ़ील्ड आवश्यक हैं (Phase number, Voting date, Result date required)' });
    }

    const phaseId = await complianceEngine.addPhase(phase_number, voting_date, result_date);
    
    res.status(201).json({ 
      success: true, 
      phase_id: phaseId,
      message: 'चरण सफलतापूर्वक जोड़ा गया' 
    });

  } catch (error) {
    console.error('Error adding phase:', error);
    res.status(500).json({ error: 'चरण जोड़ने में त्रुटि' });
  }
});

/**
 * PUT /api/admin/phases/:id
 * Update an election phase
 */
router.put('/phases/:id', authenticateAdmin, requireSuperAdmin, async (req, res) => {
  try {
    const { phase_number, voting_date, result_date } = req.body;

    if (!phase_number || !voting_date || !result_date) {
      return res.status(400).json({ error: 'सभी फ़ील्ड आवश्यक हैं' });
    }

    await complianceEngine.updatePhase(
      req.params.id, 
      phase_number, 
      voting_date, 
      result_date
    );

    res.json({ success: true, message: 'चरण अपडेट किया गया' });

  } catch (error) {
    console.error('Error updating phase:', error);
    res.status(500).json({ error: 'चरण अपडेट करने में त्रुटि' });
  }
});

/**
 * DELETE /api/admin/phases/:id
 * Delete an election phase
 */
router.delete('/phases/:id', authenticateAdmin, requireSuperAdmin, async (req, res) => {
  try {
    await complianceEngine.deletePhase(req.params.id);
    res.json({ success: true, message: 'चरण हटाया गया' });
  } catch (error) {
    console.error('Error deleting phase:', error);
    res.status(500).json({ error: 'चरण हटाने में त्रुटि' });
  }
});

/**
 * PATCH /api/admin/phases/:id/toggle
 * Toggle phase active status
 */
router.patch('/phases/:id/toggle', authenticateAdmin, requireSuperAdmin, async (req, res) => {
  try {
    const phaseId = req.params.id;
    const { is_active } = req.body;

    // Determine the new status based on is_active
    let newStatus = 'Upcoming';
    if (is_active) {
      newStatus = 'Voting';
    } else {
      // Check if this phase should be completed or upcoming
      const [phase] = await db.query(
        'SELECT result_date FROM Election_Phases WHERE id = ?',
        [phaseId]
      );
      if (phase.length > 0 && new Date(phase[0].result_date) < new Date()) {
        newStatus = 'Completed';
      }
    }

    // If activating, deactivate all other phases first
    if (is_active) {
      await db.query(
        "UPDATE Election_Phases SET status = CASE WHEN result_date < NOW() THEN 'Completed' ELSE 'Upcoming' END WHERE id != ?",
        [phaseId]
      );
    }

    // Update the target phase
    await db.query(
      'UPDATE Election_Phases SET status = ? WHERE id = ?',
      [newStatus, phaseId]
    );

    res.json({ 
      success: true, 
      message: is_active ? 'चरण सक्रिय किया गया' : 'चरण निष्क्रिय किया गया',
      status: newStatus
    });

  } catch (error) {
    console.error('Error toggling phase:', error);
    res.status(500).json({ error: 'चरण स्थिति बदलने में त्रुटि' });
  }
});

// ==================== DISTRICT MANAGEMENT ====================

/**
 * POST /api/admin/districts
 * Add a new district
 */
router.post('/districts', authenticateAdmin, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'जिले का नाम आवश्यक है' });
    }

    const [result] = await db.query(
      'INSERT INTO Districts (name) VALUES (?)',
      [name]
    );

    res.status(201).json({ 
      success: true, 
      district_id: result.insertId,
      message: 'जिला जोड़ा गया' 
    });

  } catch (error) {
    console.error('Error adding district:', error);
    res.status(500).json({ error: 'जिला जोड़ने में त्रुटि' });
  }
});

/**
 * PUT /api/admin/districts/:id
 * Update a district
 */
router.put('/districts/:id', authenticateAdmin, async (req, res) => {
  try {
    const { name } = req.body;

    await db.query(
      'UPDATE Districts SET name = ? WHERE district_id = ?',
      [name, req.params.id]
    );

    res.json({ success: true, message: 'जिला अपडेट किया गया' });

  } catch (error) {
    console.error('Error updating district:', error);
    res.status(500).json({ error: 'जिला अपडेट करने में त्रुटि' });
  }
});

/**
 * DELETE /api/admin/districts/:id
 * Delete a district
 */
router.delete('/districts/:id', authenticateAdmin, requireSuperAdmin, async (req, res) => {
  try {
    await db.query('DELETE FROM Districts WHERE district_id = ?', [req.params.id]);
    res.json({ success: true, message: 'जिला हटाया गया' });
  } catch (error) {
    console.error('Error deleting district:', error);
    res.status(500).json({ error: 'जिला हटाने में त्रुटि' });
  }
});

// ==================== PARTY MANAGEMENT ====================

/**
 * GET /api/admin/parties
 * Get all parties
 */
router.get('/parties', authenticateAdmin, async (req, res) => {
  try {
    const [parties] = await db.query('SELECT * FROM Parties ORDER BY name_hindi ASC');
    res.json(parties);
  } catch (error) {
    console.error('Error fetching parties:', error);
    res.status(500).json({ error: 'पार्टियां लोड नहीं हो सकीं' });
  }
});

/**
 * GET /api/admin/constituencies
 * Get all constituencies with phase information
 */
router.get('/constituencies', authenticateAdmin, async (req, res) => {
  try {
    const [constituencies] = await db.query(`
      SELECT 
        c.*,
        d.name_hindi as district_name,
        d.name_english as district_name_english,
        ep.phase_number,
        ep.voting_date,
        ep.result_date,
        ep.status as phase_status
      FROM Constituencies c
      LEFT JOIN Districts d ON c.district_id = d.id
      LEFT JOIN Election_Phases ep ON c.phase_id = ep.id
      ORDER BY c.seat_no ASC
    `);
    res.json(constituencies);
  } catch (error) {
    console.error('Error fetching constituencies:', error);
    res.status(500).json({ error: 'विधानसभा क्षेत्र लोड नहीं हो सके' });
  }
});

/**
 * POST /api/admin/constituencies
 * Add a new constituency
 */
router.post('/constituencies', authenticateAdmin, requireSuperAdmin, async (req, res) => {
  try {
    const { 
      seat_no, 
      name_hindi, 
      name_english, 
      district_id, 
      phase_id,
      is_reserved, 
      reservation_type 
    } = req.body;

    if (!seat_no || !name_hindi || !name_english || !district_id) {
      return res.status(400).json({ error: 'सीट नंबर, नाम (हिंदी), नाम (अंग्रेजी), और जिला आवश्यक हैं' });
    }

    // Check if seat_no already exists
    const [existing] = await db.query(
      'SELECT id FROM Constituencies WHERE seat_no = ?',
      [seat_no]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'यह सीट नंबर पहले से मौजूद है' });
    }

    const [result] = await db.query(
      `INSERT INTO Constituencies 
       (seat_no, name_hindi, name_english, district_id, phase_id, is_reserved, reservation_type) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        seat_no, 
        name_hindi, 
        name_english, 
        district_id, 
        phase_id || null,
        is_reserved ? 1 : 0, 
        reservation_type || null
      ]
    );

    res.status(201).json({ 
      success: true, 
      constituency_id: result.insertId,
      message: 'विधानसभा क्षेत्र सफलतापूर्वक जोड़ा गया' 
    });

  } catch (error) {
    console.error('Error adding constituency:', error);
    res.status(500).json({ error: 'विधानसभा क्षेत्र जोड़ने में त्रुटि' });
  }
});

/**
 * PUT /api/admin/constituencies/:id
 * Update a constituency
 */
router.put('/constituencies/:id', authenticateAdmin, requireSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      seat_no, 
      name_hindi, 
      name_english, 
      district_id, 
      phase_id,
      is_reserved, 
      reservation_type 
    } = req.body;

    if (!seat_no || !name_hindi || !name_english || !district_id) {
      return res.status(400).json({ error: 'सभी फ़ील्ड आवश्यक हैं' });
    }

    // Check if seat_no already exists for another constituency
    const [existing] = await db.query(
      'SELECT id FROM Constituencies WHERE seat_no = ? AND id != ?',
      [seat_no, id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'यह सीट नंबर पहले से उपयोग में है' });
    }

    await db.query(
      `UPDATE Constituencies 
       SET seat_no = ?, name_hindi = ?, name_english = ?, district_id = ?, 
           phase_id = ?, is_reserved = ?, reservation_type = ?
       WHERE id = ?`,
      [
        seat_no, 
        name_hindi, 
        name_english, 
        district_id, 
        phase_id || null,
        is_reserved ? 1 : 0, 
        reservation_type || null, 
        id
      ]
    );

    res.json({ 
      success: true, 
      message: 'विधानसभा क्षेत्र सफलतापूर्वक अपडेट किया गया' 
    });

  } catch (error) {
    console.error('Error updating constituency:', error);
    res.status(500).json({ error: 'विधानसभा क्षेत्र अपडेट करने में त्रुटि' });
  }
});

/**
 * DELETE /api/admin/constituencies/:id
 * Delete a constituency
 */
router.delete('/constituencies/:id', authenticateAdmin, requireSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if constituency has candidates
    const [candidates] = await db.query(
      'SELECT COUNT(*) as count FROM Candidates WHERE constituency_id = ?',
      [id]
    );

    if (candidates[0].count > 0) {
      return res.status(400).json({ 
        error: 'इस विधानसभा क्षेत्र में उम्मीदवार हैं। पहले उम्मीदवारों को हटाएं।' 
      });
    }

    await db.query('DELETE FROM Constituencies WHERE id = ?', [id]);

    res.json({ 
      success: true, 
      message: 'विधानसभा क्षेत्र सफलतापूर्वक हटाया गया' 
    });

  } catch (error) {
    console.error('Error deleting constituency:', error);
    res.status(500).json({ error: 'विधानसभा क्षेत्र हटाने में त्रुटि' });
  }
});

/**
 * GET /api/admin/districts
 * Get all districts
 */
router.get('/districts', authenticateAdmin, async (req, res) => {
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
 * POST /api/admin/parties
 * Add a new party
 */
router.post('/parties', authenticateAdmin, async (req, res) => {
  try {
    const { name_hindi, name_english, short_code, symbol_url, color_code } = req.body;

    if (!name_hindi || !short_code) {
      return res.status(400).json({ error: 'नाम (हिंदी) और संक्षिप्त नाम आवश्यक हैं' });
    }

    // Check if short_code already exists
    const [existing] = await db.query(
      'SELECT id FROM Parties WHERE short_code = ?',
      [short_code]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'यह संक्षिप्त नाम पहले से उपयोग में है' });
    }

    const [result] = await db.query(
      'INSERT INTO Parties (name_hindi, name_english, short_code, symbol_url, color_code) VALUES (?, ?, ?, ?, ?)',
      [name_hindi, name_english || null, short_code, symbol_url || null, color_code || '#000000']
    );

    res.status(201).json({ 
      success: true, 
      party_id: result.insertId,
      message: 'पार्टी सफलतापूर्वक जोड़ी गई' 
    });

  } catch (error) {
    console.error('Error adding party:', error);
    res.status(500).json({ error: 'पार्टी जोड़ने में त्रुटि' });
  }
});

/**
 * GET /api/admin/parties
 * Get all parties
 */
router.get('/parties', authenticateAdmin, async (req, res) => {
  try {
    const [parties] = await db.query(`
      SELECT id, name_hindi, name_english, short_code AS abbreviation, symbol_url, color_code, created_at
      FROM Parties
      ORDER BY name_hindi ASC
    `);
    res.json(parties);
  } catch (error) {
    console.error('Error fetching parties:', error);
    res.status(500).json({ error: 'पार्टियाँ लोड नहीं हो सकीं' });
  }
});

/**
 * PUT /api/admin/parties/:id
 * Update a party
 */
router.put('/parties/:id', authenticateAdmin, async (req, res) => {
  try {
    const { name_hindi, name_english, short_code, symbol_url, color_code } = req.body;

    console.log('UPDATE Party Request:', {
      id: req.params.id,
      name_hindi,
      short_code,
      symbol_url,
      color_code
    });

    if (!name_hindi || !short_code) {
      return res.status(400).json({ error: 'नाम (हिंदी) और संक्षिप्त नाम आवश्यक हैं' });
    }

    // Check if short_code is already used by another party
    const [existing] = await db.query(
      'SELECT id FROM Parties WHERE short_code = ? AND id != ?',
      [short_code, req.params.id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'यह संक्षिप्त नाम पहले से उपयोग में है' });
    }

    const [result] = await db.query(
      'UPDATE Parties SET name_hindi = ?, name_english = ?, short_code = ?, symbol_url = ?, color_code = ? WHERE id = ?',
      [name_hindi, name_english || null, short_code, symbol_url || null, color_code || '#000000', req.params.id]
    );

    console.log('UPDATE Party Result:', result);

    res.json({ 
      success: true, 
      message: 'पार्टी अपडेट हो गई' 
    });

  } catch (error) {
    console.error('Error updating party:', error);
    res.status(500).json({ error: 'पार्टी अपडेट करने में त्रुटि' });
  }
});

/**
 * DELETE /api/admin/parties/:id
 * Delete a party
 */
router.delete('/parties/:id', authenticateAdmin, async (req, res) => {
  try {
    await db.query('DELETE FROM Parties WHERE id = ?', [req.params.id]);
    res.json({ 
      success: true, 
      message: 'पार्टी हटा दी गई' 
    });
  } catch (error) {
    console.error('Error deleting party:', error);
    res.status(500).json({ error: 'पार्टी हटाने में त्रुटि' });
  }
});

// ==================== CANDIDATE MANAGEMENT ====================

/**
 * GET /api/admin/candidates
 * Get all candidates with party and constituency details
 */
router.get('/candidates', authenticateAdmin, async (req, res) => {
  try {
    const [candidates] = await db.query(`
      SELECT 
        c.id AS candidate_id,
        c.name_hindi,
        c.name_english,
        c.constituency_id,
        c.party_id,
        c.photo_url,
        p.name_hindi AS party_name_hindi,
        p.short_code AS party_abbreviation,
        con.name_hindi AS constituency_name_hindi
      FROM Candidates c
      LEFT JOIN Parties p ON c.party_id = p.id
      LEFT JOIN Constituencies con ON c.constituency_id = con.id
      ORDER BY c.name_hindi ASC
    `);

    // Format response to match frontend expectations
    const formattedCandidates = candidates.map(candidate => ({
      candidate_id: candidate.candidate_id,
      name_hindi: candidate.name_hindi,
      name_english: candidate.name_english,
      constituency_id: candidate.constituency_id,
      party_id: candidate.party_id,
      photo_url: candidate.photo_url,
      party: {
        abbreviation: candidate.party_abbreviation,
        name_hindi: candidate.party_name_hindi
      },
      constituency: {
        name_hindi: candidate.constituency_name_hindi
      }
    }));

    res.json({ candidates: formattedCandidates });
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ error: 'उम्मीदवार लोड नहीं हो सके' });
  }
});

/**
 * POST /api/admin/candidates
 * Add a new candidate
 */
router.post('/candidates', authenticateAdmin, async (req, res) => {
  try {
    const { name_hindi, name_english, constituency_id, party_id, photo_url } = req.body;

    if (!name_hindi || !constituency_id || !party_id) {
      return res.status(400).json({ error: 'सभी आवश्यक फ़ील्ड भरें (Name Hindi, Constituency, Party required)' });
    }

    const englishNormalized = name_english && String(name_english).trim() ? String(name_english).trim() : null;
    const [result] = await db.query(
      'INSERT INTO Candidates (name_hindi, name_english, constituency_id, party_id, photo_url) VALUES (?, ?, ?, ?, ?)',
      [name_hindi, englishNormalized, constituency_id, party_id, photo_url || null]
    );

    res.status(201).json({ 
      success: true, 
      candidate_id: result.insertId,
      message: 'उम्मीदवार जोड़ा गया' 
    });

  } catch (error) {
    console.error('Error adding candidate:', error);
    res.status(500).json({ error: 'उम्मीदवार जोड़ने में त्रुटि' });
  }
});

/**
 * PUT /api/admin/candidates/:id
 * Update a candidate
 */
router.put('/candidates/:id', authenticateAdmin, async (req, res) => {
  try {
    const { name_hindi, name_english, party_id, photo_url } = req.body;
    
    console.log('UPDATE Candidate Request:', {
      id: req.params.id,
      name_hindi,
      party_id,
      photo_url
    });

    if (!name_hindi || !party_id) {
      return res.status(400).json({ error: 'सभी आवश्यक फ़ील्ड भरें' });
    }

    const englishNormalized = name_english && String(name_english).trim() ? String(name_english).trim() : null;
    const [result] = await db.query(
      'UPDATE Candidates SET name_hindi = ?, name_english = ?, party_id = ?, photo_url = ? WHERE id = ?',
      [name_hindi, englishNormalized, party_id, photo_url, req.params.id]
    );
    
    console.log('UPDATE Result:', result);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'उम्मीदवार नहीं मिला' });
    }

    res.json({ success: true, message: 'उम्मीदवार अपडेट किया गया' });

  } catch (error) {
    console.error('Error updating candidate:', error);
    res.status(500).json({ error: 'उम्मीदवार अपडेट करने में त्रुटि' });
  }
});

/**
 * DELETE /api/admin/candidates/:id
 * Delete a candidate
 */
router.delete('/candidates/:id', authenticateAdmin, requireSuperAdmin, async (req, res) => {
  try {
    await db.query('DELETE FROM Candidates WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'उम्मीदवार हटाया गया' });
  } catch (error) {
    console.error('Error deleting candidate:', error);
    res.status(500).json({ error: 'उम्मीदवार हटाने में त्रुटि' });
  }
});

// ==================== VOTE MANAGEMENT ====================

/**
 * GET /api/admin/votes/recent
 * Get recent votes with candidate and constituency details
 */
router.get('/votes/recent', authenticateAdmin, async (req, res) => {
  try {
    const limit = req.query.limit || 100;
    
    const [votes] = await db.query(`
      SELECT 
        o.id as opinion_id,
        o.candidate_id,
        o.constituency_id,
        o.voted_at as created_at,
        c.name_hindi as candidate_name_hindi,
        c.name_english as candidate_name_english,
        con.name_hindi as constituency_name_hindi,
        con.name_english as constituency_name_english,
        p.short_code as party_abbreviation
      FROM Opinions o
      LEFT JOIN Candidates c ON o.candidate_id = c.id
      LEFT JOIN Constituencies con ON o.constituency_id = con.id
      LEFT JOIN Parties p ON c.party_id = p.id
      ORDER BY o.voted_at DESC
      LIMIT ?
    `, [parseInt(limit)]);

    // Format response
    const formattedVotes = votes.map(vote => ({
      opinion_id: vote.opinion_id,
      candidate_id: vote.candidate_id,
      constituency_id: vote.constituency_id,
      created_at: vote.created_at,
      candidate: {
        name_hindi: vote.candidate_name_hindi,
        name_english: vote.candidate_name_english,
        party: {
          abbreviation: vote.party_abbreviation
        }
      },
      constituency: {
        name_hindi: vote.constituency_name_hindi,
        name_english: vote.constituency_name_english
      }
    }));

    res.json({ votes: formattedVotes });
  } catch (error) {
    console.error('Error fetching votes:', error);
    res.status(500).json({ error: 'वोट लोड नहीं हो सके' });
  }
});

/**
 * DELETE /api/admin/votes/clear
 * Clear all votes (Super Admin only)
 */
router.delete('/votes/clear', authenticateAdmin, requireSuperAdmin, async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM Opinions');
    
    res.json({ 
      success: true, 
      message: 'सभी वोट हटा दिए गए',
      deleted_count: result.affectedRows 
    });
  } catch (error) {
    console.error('Error clearing votes:', error);
    res.status(500).json({ error: 'वोट हटाने में त्रुटि' });
  }
});

// ==================== DATA EXPORT ====================

/**
 * GET /api/admin/export
 * Export all data as JSON
 */
router.get('/export', authenticateAdmin, async (req, res) => {
  try {
    const [districts] = await db.query('SELECT * FROM Districts');
    const [constituencies] = await db.query('SELECT * FROM Constituencies');
    const [parties] = await db.query('SELECT * FROM Parties');
    const [candidates] = await db.query(`
      SELECT c.*, p.name_hindi as party_name, con.name_hindi as constituency_name
      FROM Candidates c
      LEFT JOIN Parties p ON c.party_id = p.id
      LEFT JOIN Constituencies con ON c.constituency_id = con.id
    `);
    const [votes] = await db.query(`
      SELECT o.*, c.name_hindi as candidate_name, con.name_hindi as constituency_name
      FROM Opinions o
      LEFT JOIN Candidates c ON o.candidate_id = c.id
      LEFT JOIN Constituencies con ON o.constituency_id = con.id
    `);
    const [phases] = await db.query('SELECT * FROM Election_Phases');

    const exportData = {
      export_date: new Date().toISOString(),
      generated_by: req.admin.username,
      data: {
        districts,
        constituencies,
        parties,
        candidates,
        votes,
        phases
      },
      statistics: {
        total_districts: districts.length,
        total_constituencies: constituencies.length,
        total_parties: parties.length,
        total_candidates: candidates.length,
        total_votes: votes.length,
        total_phases: phases.length
      }
    };

    res.json(exportData);
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).json({ error: 'डेटा एक्सपोर्ट करने में त्रुटि' });
  }
});

module.exports = router;
