-- System Settings Table for ECI Compliance Configuration
CREATE TABLE IF NOT EXISTS System_Settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value VARCHAR(255) NOT NULL,
  description TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by INT,
  FOREIGN KEY (updated_by) REFERENCES Admins(id) ON DELETE SET NULL
);

-- Insert default settings
INSERT INTO System_Settings (setting_key, setting_value, description) VALUES
  ('blackout_enforcement', 'true', '48-hour blackout period enforcement before result date'),
  ('duplicate_vote_prevention', 'true', 'Device fingerprinting to prevent duplicate votes'),
  ('anonymous_voting', 'true', 'Anonymous voting with no personal data storage')
ON DUPLICATE KEY UPDATE 
  setting_value = VALUES(setting_value);
