const db = require('../config/database');

/**
 * Regulatory Compliance Engine
 * Checks if current time falls within ECI 48-hour blackout period
 */
class ComplianceEngine {
  
  /**
   * Check if results display is currently in blackout period
   * @returns {Promise<Object>} { inBlackout: boolean, message: string, nextAvailableDate: string }
   */
  async checkBlackoutStatus() {
    try {
      // First check if blackout enforcement is enabled
      const [settingResult] = await db.query(
        'SELECT setting_value FROM System_Settings WHERE setting_key = ?',
        ['blackout_enforcement']
      );
      
      const blackoutEnabled = settingResult.length > 0 
        ? settingResult[0].setting_value === 'true' 
        : true; // Default to enabled
      
      // If blackout enforcement is disabled, always return not in blackout
      if (!blackoutEnabled) {
        return {
          inBlackout: false,
          isBlackout: false,
          message: 'परिणाम उपलब्ध हैं (Blackout enforcement disabled)'
        };
      }

      const [phases] = await db.query(`
        SELECT 
          id,
          phase_number,
          result_date,
          blackout_start,
          blackout_end
        FROM Election_Phases
        WHERE status = 'Voting'
          AND NOW() BETWEEN blackout_start AND blackout_end
        ORDER BY result_date ASC
        LIMIT 1
      `);

      if (phases.length > 0) {
        const phase = phases[0];
        return {
          inBlackout: true,
          isBlackout: true,
          message: `परिणाम प्रदर्शन ECI नियमों के अनुसार Phase ${phase.phase_number} के लिए रोका गया है।`,
          phaseName: `Phase ${phase.phase_number}`,
          nextAvailableDate: phase.blackout_end
        };
      }

      return {
        inBlackout: false,
        isBlackout: false,
        message: 'परिणाम उपलब्ध हैं'
      };
    } catch (error) {
      console.error('Error checking blackout status:', error);
      // Fail-safe: if there's an error, allow results to show
      return {
        inBlackout: false,
        isBlackout: false,
        message: 'परिणाम उपलब्ध हैं'
      };
    }
  }

  /**
   * Get all active election phases
   * @returns {Promise<Array>} Array of election phases
   */
  async getActivePhases() {
    try {
      const [phases] = await db.query(`
        SELECT 
          id as phase_id,
          phase_number,
          CONCAT('Phase ', phase_number) as phase_name,
          voting_date,
          result_date as poll_end_datetime,
          blackout_start as blackout_start_datetime,
          blackout_end as blackout_end_datetime,
          status,
          CASE WHEN status = 'Voting' THEN 1 ELSE 0 END as is_active
        FROM Election_Phases
        ORDER BY voting_date ASC
      `);
      return phases;
    } catch (error) {
      console.error('Error fetching active phases:', error);
      return [];
    }
  }

  /**
   * Add a new election phase
   * @param {number} phaseNumber - Phase number (1, 2, 3, etc.)
   * @param {Date} votingDate - When voting happens
   * @param {Date} resultDate - When results are declared
   * @returns {Promise<number>} Inserted phase_id
   */
  async addPhase(phaseNumber, votingDate, resultDate) {
    try {
      // Note: blackout_start and blackout_end are auto-calculated by the database
      // They are generated columns: blackout_start = result_date - 48 hours

      const [result] = await db.query(
        `INSERT INTO Election_Phases (phase_number, voting_date, result_date, status) 
         VALUES (?, ?, ?, 'Upcoming')`,
        [phaseNumber, votingDate, resultDate]
      );
      return result.insertId;
    } catch (error) {
      console.error('Error adding phase:', error);
      throw error;
    }
  }

  /**
   * Update an election phase
   * @param {number} phaseId 
   * @param {number} phaseNumber 
   * @param {Date} votingDate 
   * @param {Date} resultDate 
   * @returns {Promise<boolean>} Success status
   */
  async updatePhase(phaseId, phaseNumber, votingDate, resultDate) {
    try {
      // Calculate 48-hour blackout period
      const blackoutEnd = new Date(resultDate);
      const blackoutStart = new Date(blackoutEnd.getTime() - (48 * 60 * 60 * 1000));
      
      await db.query(
        `UPDATE Election_Phases 
         SET phase_number = ?, voting_date = ?, result_date = ?, 
             blackout_start = ?, blackout_end = ?
         WHERE id = ?`,
        [phaseNumber, votingDate, resultDate, blackoutStart, blackoutEnd, phaseId]
      );
      return true;
    } catch (error) {
      console.error('Error updating phase:', error);
      throw error;
    }
  }

  /**
   * Delete an election phase
   * @param {number} phaseId 
   * @returns {Promise<boolean>} Success status
   */
  async deletePhase(phaseId) {
    try {
      await db.query('DELETE FROM Election_Phases WHERE id = ?', [phaseId]);
      return true;
    } catch (error) {
      console.error('Error deleting phase:', error);
      throw error
    }
  }

  /**
   * Manually toggle blackout (for emergency situations)
   * This could be implemented as a separate override table
   * @param {boolean} enableBlackout 
   */
  async setManualBlackout(enableBlackout) {
    // Implementation for manual override
    // Could use a separate config table or cache
    console.log('Manual blackout:', enableBlackout ? 'ENABLED' : 'DISABLED');
  }
}

module.exports = new ComplianceEngine();
