-- Make fingerprint columns nullable to support anonymous voting
ALTER TABLE Opinions 
  MODIFY COLUMN fingerprint_hash VARCHAR(64) NULL,
  MODIFY COLUMN ip_address VARCHAR(45) NULL,
  MODIFY COLUMN user_agent TEXT NULL;
