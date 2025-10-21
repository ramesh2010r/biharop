-- Bihar Election Opinion Poll Database Schema
-- Optimized for High-Traffic Read/Write Operations with ECI Compliance

-- Set default engine to InnoDB for all tables
SET default_storage_engine=InnoDB;

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS Ad_Impressions;
DROP TABLE IF EXISTS Ads;
DROP TABLE IF EXISTS Election_Phases;
DROP TABLE IF EXISTS Admins;
DROP TABLE IF EXISTS Results_Summary;
DROP TABLE IF EXISTS Opinions;
DROP TABLE IF EXISTS Candidates;
DROP TABLE IF EXISTS Parties;
DROP TABLE IF EXISTS Constituencies;
DROP TABLE IF EXISTS Districts;

-- ELECTION & GEOGRAPHY DATA (Mostly Read-Heavy)
CREATE TABLE Districts (
    district_id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY (district_id),
    UNIQUE KEY uq_district_name (name)
) COMMENT='List of all districts';

CREATE TABLE Constituencies (
    constituency_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    district_id SMALLINT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY (constituency_id),
    KEY idx_district_id (district_id),
    FOREIGN KEY (district_id) REFERENCES Districts(district_id) ON DELETE RESTRICT
) COMMENT='List of all constituencies';

CREATE TABLE Parties (
    party_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    abbreviation VARCHAR(20) NOT NULL,
    symbol_url VARCHAR(255),
    PRIMARY KEY (party_id),
    UNIQUE KEY uq_party_name (name)
) COMMENT='List of political parties';

CREATE TABLE Candidates (
    candidate_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    constituency_id INT UNSIGNED NOT NULL,
    party_id INT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    photo_url VARCHAR(255),
    PRIMARY KEY (candidate_id),
    KEY idx_constituency_id (constituency_id),
    FOREIGN KEY (constituency_id) REFERENCES Constituencies(constituency_id) ON DELETE RESTRICT,
    FOREIGN KEY (party_id) REFERENCES Parties(party_id) ON DELETE RESTRICT
) COMMENT='List of candidates per constituency';


-- HIGH-TRAFFIC WRITE TABLE
CREATE TABLE Opinions (
    opinion_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    constituency_id INT UNSIGNED NOT NULL,
    candidate_id INT UNSIGNED NOT NULL,
    fingerprint_id VARCHAR(100) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (opinion_id),
    -- Indexes for preventing duplicates
    KEY idx_fingerprint (fingerprint_id),
    KEY idx_ip_address (ip_address),
    KEY idx_constituency (constituency_id)
) COMMENT='Logs every single unique opinion. WRITE HEAVY.';


-- HIGH-TRAFFIC READ TABLE (THE GAME CHANGER)
CREATE TABLE Results_Summary (
    constituency_id INT UNSIGNED NOT NULL,
    candidate_id INT UNSIGNED NOT NULL,
    total_votes INT UNSIGNED NOT NULL DEFAULT 0,
    PRIMARY KEY (constituency_id, candidate_id),
    FOREIGN KEY (constituency_id) REFERENCES Constituencies(constituency_id) ON DELETE CASCADE,
    FOREIGN KEY (candidate_id) REFERENCES Candidates(candidate_id) ON DELETE CASCADE
) COMMENT='Pre-aggregated results for EXTREMELY FAST reads. READ HEAVY.';


-- ADVERTISING SYSTEM
CREATE TABLE Ads (
    ad_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    advertiser_name VARCHAR(255) NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    target_url VARCHAR(2048) NOT NULL,
    start_date DATETIME NOT NULL,
    end_date DATETIME,
    max_impressions INT UNSIGNED,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (ad_id),
    KEY idx_active_dates (is_active, start_date, end_date)
) COMMENT='Ad creatives and campaign info';

CREATE TABLE Ad_Impressions (
    impression_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    ad_id INT UNSIGNED NOT NULL,
    district_id SMALLINT UNSIGNED,
    viewed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (impression_id),
    KEY idx_ad_id (ad_id)
) COMMENT='Logs every ad view. Can become very large.';


-- ADMIN & COMPLIANCE
CREATE TABLE Admins (
    admin_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('superadmin', 'manager') NOT NULL DEFAULT 'manager',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (admin_id),
    UNIQUE KEY uq_username (username)
) COMMENT='Admin user accounts';

CREATE TABLE Election_Phases (
    phase_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    phase_name VARCHAR(255) NOT NULL,
    poll_end_datetime DATETIME NOT NULL COMMENT 'The official time polling ends for this phase',
    blackout_start_datetime DATETIME GENERATED ALWAYS AS (poll_end_datetime - INTERVAL 48 HOUR) STORED,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (phase_id),
    KEY idx_blackout_dates (blackout_start_datetime, poll_end_datetime, is_active)
) COMMENT='Stores ECI phase data to calculate blackout periods';

-- Insert Sample Data

-- Sample Districts
INSERT INTO Districts (name) VALUES 
('पटना'), ('गया'), ('भागलपुर'), ('मुजफ्फरपुर'), 
('दरभंगा'), ('पूर्णिया'), ('आरा'), ('बेगूसराय');

-- Sample Parties
INSERT INTO Parties (name, abbreviation) VALUES 
('भारतीय जनता पार्टी', 'BJP'),
('राष्ट्रीय जनता दल', 'RJD'),
('जनता दल (यूनाइटेड)', 'JDU'),
('भारतीय राष्ट्रीय कांग्रेस', 'INC'),
('बहुजन समाज पार्टी', 'BSP'),
('निर्दलीय', 'IND');

-- Sample Constituencies for Patna
INSERT INTO Constituencies (district_id, name) VALUES 
(1, 'पटना साहिब'),
(1, 'बांकीपुर'),
(1, 'कुम्हरार'),
(1, 'दीघा'),
(1, 'फुलवारी');

-- Sample Candidates for Patna Sahib
INSERT INTO Candidates (constituency_id, party_id, name) VALUES 
(1, 1, 'राजेश कुमार'),
(1, 2, 'सुरेश प्रसाद'),
(1, 3, 'मनोज यादव'),
(1, 4, 'प्रिया सिंह');

-- Create default admin (password: admin123 - should be changed)
-- Password hash for 'admin123' using bcrypt
INSERT INTO Admins (username, password_hash, role) VALUES 
('admin', '$2a$10$ZB8BvT.k5XjD8oXY7pXkCeQJ4eTLPGcN8tH7M3fIrLxZ9JYwFpY0C', 'superadmin');
