-- 004_add_states_support.sql
-- Migration: Add States table and state_id columns to support multi-state platform
-- Created: 2025-11-11
-- Notes:
-- 1) Run this on a staging / backup first. Verify application queries.
-- 2) This migration intentionally DOES NOT add foreign key constraints to avoid migration failures
--    on older MySQL versions or if the States rows are not present yet. Add FK later if desired.

START TRANSACTION;

-- 1. Create States table
CREATE TABLE IF NOT EXISTS `States` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `capital` VARCHAR(100),
  `population` BIGINT DEFAULT NULL,
  `total_seats` INT DEFAULT NULL,
  `active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Seed core states (id specified to ensure Bihar=1)
INSERT INTO `States` (`id`,`name`,`slug`,`capital`,`population`,`total_seats`,`active`)
VALUES
  (1,'Bihar','bihar','Patna',104099452,243,1),
  (2,'Maharashtra','maharashtra','Mumbai',112374333,288,0),
  (3,'Jharkhand','jharkhand','Ranchi',32988134,81,0)
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `slug` = VALUES(`slug`),
  `capital` = VALUES(`capital`),
  `population` = VALUES(`population`),
  `total_seats` = VALUES(`total_seats`),
  `active` = VALUES(`active`),
  `updated_at` = CURRENT_TIMESTAMP;

-- 3. Add state_id columns to existing tables if they don't exist.
-- Replace table names below with the actual table names in your schema if different.

ALTER TABLE `Candidates`    ADD COLUMN IF NOT EXISTS `state_id` INT NOT NULL DEFAULT 1;
ALTER TABLE `Constituencies` ADD COLUMN IF NOT EXISTS `state_id` INT NOT NULL DEFAULT 1;
ALTER TABLE `Districts`     ADD COLUMN IF NOT EXISTS `state_id` INT NOT NULL DEFAULT 1;
ALTER TABLE `Votes`         ADD COLUMN IF NOT EXISTS `state_id` INT NOT NULL DEFAULT 1;
ALTER TABLE `Blog_Posts`    ADD COLUMN IF NOT EXISTS `state_id` INT NOT NULL DEFAULT 1;

-- 4. (Optional) If you have other tables that require state scoping, add them similarly.

-- 5. Backfill: ensure existing rows map to Bihar (id=1). If ADD COLUMN with DEFAULT already set,
--    existing rows will have value 1. This update is safe; it will set NULLs to 1 if any.
UPDATE `Candidates`    SET `state_id` = 1 WHERE `state_id` IS NULL;
UPDATE `Constituencies` SET `state_id` = 1 WHERE `state_id` IS NULL;
UPDATE `Districts`     SET `state_id` = 1 WHERE `state_id` IS NULL;
UPDATE `Votes`         SET `state_id` = 1 WHERE `state_id` IS NULL;
UPDATE `Blog_Posts`    SET `state_id` = 1 WHERE `state_id` IS NULL;

-- 6. (Optional) Add indexes to speed up queries by state
CREATE INDEX IF NOT EXISTS `idx_candidates_state` ON `Candidates` (`state_id`);
CREATE INDEX IF NOT EXISTS `idx_constituencies_state` ON `Constituencies` (`state_id`);
CREATE INDEX IF NOT EXISTS `idx_districts_state` ON `Districts` (`state_id`);
CREATE INDEX IF NOT EXISTS `idx_votes_state` ON `Votes` (`state_id`);
CREATE INDEX IF NOT EXISTS `idx_blogposts_state` ON `Blog_Posts` (`state_id`);

COMMIT;

-- Rollback (manual): To reverse this migration, run the following carefully (will drop columns and seeded states):
-- START TRANSACTION;
-- ALTER TABLE `Candidates` DROP COLUMN IF EXISTS `state_id`;
-- ALTER TABLE `Constituencies` DROP COLUMN IF EXISTS `state_id`;
-- ALTER TABLE `Districts` DROP COLUMN IF EXISTS `state_id`;
-- ALTER TABLE `Votes` DROP COLUMN IF EXISTS `state_id`;
-- ALTER TABLE `Blog_Posts` DROP COLUMN IF EXISTS `state_id`;
-- DELETE FROM `States` WHERE `id` IN (1,2,3);
-- COMMIT;

-- Notes & next steps:
-- * Verify your MySQL version supports `IF NOT EXISTS` on ADD COLUMN and CREATE INDEX. If not,
--   change to conditionals using information_schema checks or run safe ALTERs.
-- * After this migration, update application queries to filter by `state_id` (default to 1).
-- * Consider adding foreign keys once you confirm data integrity:
--   ALTER TABLE `Blog_Posts` ADD CONSTRAINT `fk_blogposts_state` FOREIGN KEY (`state_id`) REFERENCES `States`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
-- Migration: Add Multi-State Support
-- Date: 2025-11-11
-- Purpose: Transform from Bihar-only to multi-state platform
-- Strategy: "Expand, Don't Replace" - Keep all Bihar data intact

-- ============================================
-- STEP 1: Create States Table
-- ============================================

CREATE TABLE IF NOT EXISTS States (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL COMMENT 'Full state name in English',
  name_hindi VARCHAR(100) COMMENT 'State name in Hindi',
  slug VARCHAR(100) UNIQUE NOT NULL COMMENT 'URL-friendly identifier (e.g., bihar, maharashtra)',
  capital VARCHAR(100) COMMENT 'State capital city',
  population BIGINT COMMENT 'Total population (2021 census)',
  total_seats INT COMMENT 'Total Vidhan Sabha seats',
  total_districts INT COMMENT 'Total number of districts',
  
  -- Election metadata
  election_type ENUM('vidhan_sabha', 'lok_sabha', 'civic') DEFAULT 'vidhan_sabha',
  next_election_date DATE COMMENT 'Scheduled election date',
  last_election_date DATE COMMENT 'Previous election date',
  
  -- Platform status
  active BOOLEAN DEFAULT FALSE COMMENT 'Is state live on platform?',
  coming_soon BOOLEAN DEFAULT TRUE COMMENT 'Show "Coming Soon" badge?',
  launch_date DATE COMMENT 'Platform launch date for this state',
  
  -- SEO & Content
  meta_title VARCHAR(200),
  meta_description TEXT,
  og_image_url VARCHAR(500),
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_slug (slug),
  INDEX idx_active (active),
  INDEX idx_election_date (next_election_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Indian states/UTs with election and platform metadata';

-- ============================================
-- STEP 2: Seed Initial States Data
-- ============================================

-- Bihar (Existing - Mark as Active)
INSERT INTO States (
  id, name, name_hindi, slug, capital, population, total_seats, total_districts,
  election_type, next_election_date, last_election_date, 
  active, coming_soon, launch_date,
  meta_title, meta_description
) VALUES (
  1, 
  'Bihar', 
  'बिहार', 
  'bihar', 
  'Patna', 
  104099452, 
  243, 
  38,
  'vidhan_sabha',
  '2025-11-20',
  '2020-11-10',
  TRUE,
  FALSE,
  '2025-10-01',
  'Bihar Opinion Poll 2025 - Live Results, Voting & Predictions',
  'Bihar Vidhan Sabha Election 2025 opinion poll. Vote for your favorite party, view real-time results across 243 constituencies in 38 districts.'
);

-- Maharashtra (Coming Soon - Launch Dec 1, 2025)
INSERT INTO States (
  id, name, name_hindi, slug, capital, population, total_seats, total_districts,
  election_type, next_election_date, last_election_date,
  active, coming_soon, launch_date,
  meta_title, meta_description
) VALUES (
  2,
  'Maharashtra',
  'महाराष्ट्र',
  'maharashtra',
  'Mumbai',
  112374333,
  288,
  36,
  'vidhan_sabha',
  '2024-11-20',
  '2019-10-21',
  FALSE,
  TRUE,
  '2025-12-01',
  'Maharashtra Opinion Poll 2025 - Live Results & Predictions',
  'Maharashtra Vidhan Sabha opinion poll. Vote and view results across 288 constituencies. Real-time analysis of political trends.'
);

-- Jharkhand (Coming Soon - Launch Dec 15, 2025)
INSERT INTO States (
  id, name, name_hindi, slug, capital, population, total_seats, total_districts,
  election_type, next_election_date, last_election_date,
  active, coming_soon, launch_date,
  meta_title, meta_description
) VALUES (
  3,
  'Jharkhand',
  'झारखंड',
  'jharkhand',
  'Ranchi',
  32988134,
  81,
  24,
  'vidhan_sabha',
  '2024-11-25',
  '2019-12-23',
  FALSE,
  TRUE,
  '2025-12-15',
  'Jharkhand Opinion Poll 2025 - Election Results & Voting',
  'Jharkhand Vidhan Sabha opinion poll. Participate in voting, view constituency-wise results for 81 seats.'
);

-- Delhi (Coming Soon - Launch Jan 1, 2026)
INSERT INTO States (
  id, name, name_hindi, slug, capital, population, total_seats, total_districts,
  election_type, next_election_date, last_election_date,
  active, coming_soon, launch_date,
  meta_title, meta_description
) VALUES (
  4,
  'Delhi',
  'दिल्ली',
  'delhi',
  'New Delhi',
  16787941,
  70,
  11,
  'vidhan_sabha',
  '2025-02-08',
  '2020-02-08',
  FALSE,
  TRUE,
  '2026-01-01',
  'Delhi Opinion Poll 2026 - Assembly Election Results',
  'Delhi Assembly election opinion poll. Vote for your preferred party across 70 constituencies. Real-time results and analysis.'
);

-- Uttar Pradesh (Future - Phase 3)
INSERT INTO States (
  id, name, name_hindi, slug, capital, population, total_seats, total_districts,
  election_type, active, coming_soon
) VALUES (
  5,
  'Uttar Pradesh',
  'उत्तर प्रदेश',
  'uttar-pradesh',
  'Lucknow',
  199812341,
  403,
  75,
  'vidhan_sabha',
  FALSE,
  TRUE
);

-- Punjab (Future - Phase 3)
INSERT INTO States (
  id, name, name_hindi, slug, capital, population, total_seats, total_districts,
  election_type, active, coming_soon
) VALUES (
  6,
  'Punjab',
  'पंजाब',
  'punjab',
  'Chandigarh',
  27743338,
  117,
  23,
  'vidhan_sabha',
  FALSE,
  TRUE
);

-- ============================================
-- STEP 3: Add state_id to Existing Tables
-- ============================================

-- Add state_id to Candidates table
ALTER TABLE Candidates 
ADD COLUMN state_id INT DEFAULT 1 COMMENT 'Foreign key to States table' AFTER id,
ADD INDEX idx_state_id (state_id),
ADD CONSTRAINT fk_candidates_state FOREIGN KEY (state_id) REFERENCES States(id) ON DELETE RESTRICT;

-- Add state_id to Constituencies table
ALTER TABLE Constituencies 
ADD COLUMN state_id INT DEFAULT 1 COMMENT 'Foreign key to States table' AFTER id,
ADD INDEX idx_state_id (state_id),
ADD CONSTRAINT fk_constituencies_state FOREIGN KEY (state_id) REFERENCES States(id) ON DELETE RESTRICT;

-- Add state_id to Districts table
ALTER TABLE Districts 
ADD COLUMN state_id INT DEFAULT 1 COMMENT 'Foreign key to States table' AFTER id,
ADD INDEX idx_state_id (state_id),
ADD CONSTRAINT fk_districts_state FOREIGN KEY (state_id) REFERENCES States(id) ON DELETE RESTRICT;

-- Add state_id to Votes table
ALTER TABLE Votes 
ADD COLUMN state_id INT DEFAULT 1 COMMENT 'Foreign key to States table' AFTER id,
ADD INDEX idx_state_id (state_id),
ADD CONSTRAINT fk_votes_state FOREIGN KEY (state_id) REFERENCES States(id) ON DELETE RESTRICT;

-- Add state_id to Blog_Posts table
ALTER TABLE Blog_Posts 
ADD COLUMN state_id INT DEFAULT 1 COMMENT 'Foreign key to States table (1=Bihar, NULL=generic)' AFTER id,
ADD INDEX idx_state_id (state_id),
ADD CONSTRAINT fk_blog_posts_state FOREIGN KEY (state_id) REFERENCES States(id) ON DELETE SET NULL;

-- Add state_id to Parties table (if exists)
-- ALTER TABLE Parties 
-- ADD COLUMN state_id INT DEFAULT 1 COMMENT 'State-level party branches' AFTER id,
-- ADD INDEX idx_state_id (state_id);

-- ============================================
-- STEP 4: Update All Existing Bihar Data
-- ============================================

-- Mark all existing candidates as Bihar (state_id = 1)
UPDATE Candidates SET state_id = 1 WHERE state_id IS NULL OR state_id = 0;

-- Mark all existing constituencies as Bihar
UPDATE Constituencies SET state_id = 1 WHERE state_id IS NULL OR state_id = 0;

-- Mark all existing districts as Bihar
UPDATE Districts SET state_id = 1 WHERE state_id IS NULL OR state_id = 0;

-- Mark all existing votes as Bihar
UPDATE Votes SET state_id = 1 WHERE state_id IS NULL OR state_id = 0;

-- Mark all existing blog posts as Bihar
UPDATE Blog_Posts SET state_id = 1 WHERE state_id IS NULL OR state_id = 0;

-- ============================================
-- STEP 5: Create Composite Indexes for Performance
-- ============================================

-- Votes by state and constituency (for results queries)
CREATE INDEX idx_votes_state_constituency ON Votes(state_id, constituency_id);

-- Votes by state and party (for overall state results)
CREATE INDEX idx_votes_state_party ON Votes(state_id, party_id);

-- Candidates by state and constituency (for ballot display)
CREATE INDEX idx_candidates_state_constituency ON Candidates(state_id, constituency_id);

-- Blog posts by state and published status
CREATE INDEX idx_blog_state_published ON Blog_Posts(state_id, is_published, published_at);

-- ============================================
-- STEP 6: Create Views for Multi-State Queries
-- ============================================

-- View: Active States (for homepage carousel)
CREATE OR REPLACE VIEW Active_States AS
SELECT 
  s.id,
  s.name,
  s.name_hindi,
  s.slug,
  s.capital,
  s.total_seats,
  s.next_election_date,
  s.active,
  s.coming_soon,
  COUNT(DISTINCT v.id) as total_votes,
  COUNT(DISTINCT c.id) as total_candidates
FROM States s
LEFT JOIN Votes v ON s.id = v.state_id
LEFT JOIN Candidates c ON s.id = c.state_id
WHERE s.active = TRUE OR s.coming_soon = TRUE
GROUP BY s.id
ORDER BY s.active DESC, s.launch_date ASC;

-- View: State Statistics (for state landing pages)
CREATE OR REPLACE VIEW State_Stats AS
SELECT 
  s.id,
  s.name,
  s.slug,
  COUNT(DISTINCT d.id) as total_districts,
  COUNT(DISTINCT co.id) as total_constituencies,
  COUNT(DISTINCT ca.id) as total_candidates,
  COUNT(DISTINCT v.id) as total_votes,
  COUNT(DISTINCT b.id) as total_blogs
FROM States s
LEFT JOIN Districts d ON s.id = d.state_id
LEFT JOIN Constituencies co ON s.id = co.state_id
LEFT JOIN Candidates ca ON s.id = ca.state_id
LEFT JOIN Votes v ON s.id = v.state_id
LEFT JOIN Blog_Posts b ON s.id = b.state_id
GROUP BY s.id;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check States table
-- SELECT * FROM States ORDER BY active DESC, launch_date ASC;

-- Check state_id columns added
-- SELECT TABLE_NAME, COLUMN_NAME, COLUMN_DEFAULT, IS_NULLABLE 
-- FROM INFORMATION_SCHEMA.COLUMNS 
-- WHERE TABLE_SCHEMA = DATABASE() 
-- AND COLUMN_NAME = 'state_id';

-- Check Bihar data integrity
-- SELECT 'Candidates' as table_name, COUNT(*) as bihar_records FROM Candidates WHERE state_id = 1
-- UNION ALL
-- SELECT 'Constituencies', COUNT(*) FROM Constituencies WHERE state_id = 1
-- UNION ALL
-- SELECT 'Districts', COUNT(*) FROM Districts WHERE state_id = 1
-- UNION ALL
-- SELECT 'Votes', COUNT(*) FROM Votes WHERE state_id = 1
-- UNION ALL
-- SELECT 'Blog_Posts', COUNT(*) FROM Blog_Posts WHERE state_id = 1;

-- Check active states view
-- SELECT * FROM Active_States;

-- ============================================
-- ROLLBACK SCRIPT (Use only if needed)
-- ============================================

/*
-- Drop views
DROP VIEW IF EXISTS Active_States;
DROP VIEW IF EXISTS State_Stats;

-- Drop indexes
DROP INDEX idx_votes_state_constituency ON Votes;
DROP INDEX idx_votes_state_party ON Votes;
DROP INDEX idx_candidates_state_constituency ON Candidates;
DROP INDEX idx_blog_state_published ON Blog_Posts;

-- Remove foreign keys
ALTER TABLE Candidates DROP FOREIGN KEY fk_candidates_state;
ALTER TABLE Constituencies DROP FOREIGN KEY fk_constituencies_state;
ALTER TABLE Districts DROP FOREIGN KEY fk_districts_state;
ALTER TABLE Votes DROP FOREIGN KEY fk_votes_state;
ALTER TABLE Blog_Posts DROP FOREIGN KEY fk_blog_posts_state;

-- Remove state_id columns
ALTER TABLE Candidates DROP COLUMN state_id;
ALTER TABLE Constituencies DROP COLUMN state_id;
ALTER TABLE Districts DROP COLUMN state_id;
ALTER TABLE Votes DROP COLUMN state_id;
ALTER TABLE Blog_Posts DROP COLUMN state_id;

-- Drop States table
DROP TABLE IF EXISTS States;
*/

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
-- Next Steps:
-- 1. Test all Bihar queries still work
-- 2. Update API routes to filter by state_id
-- 3. Create state selection page
-- 4. Update homepage for multi-state
-- 5. Add 301 redirects for Bihar URLs
-- ============================================
