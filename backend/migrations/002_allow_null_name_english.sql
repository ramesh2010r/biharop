-- Migration: Allow NULL for name_english columns
-- Date: 2025-10-14
-- Purpose: Support Hindi-only data entry in admin panel

-- Modify Parties table
ALTER TABLE Parties MODIFY name_english VARCHAR(100) NULL;

-- Modify Candidates table
ALTER TABLE Candidates MODIFY name_english VARCHAR(100) NULL;

-- Verification queries
-- DESCRIBE Parties;
-- DESCRIBE Candidates;
