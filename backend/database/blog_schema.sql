-- Blog Posts Table
CREATE TABLE IF NOT EXISTS Blog_Posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title_hindi VARCHAR(255) NOT NULL,
  title_english VARCHAR(255),
  slug VARCHAR(255) UNIQUE NOT NULL,
  content_hindi TEXT NOT NULL,
  content_english TEXT,
  excerpt_hindi VARCHAR(500),
  excerpt_english VARCHAR(500),
  featured_image_url VARCHAR(255),
  author_id INT,
  category VARCHAR(100),
  tags VARCHAR(255),
  status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
  views INT DEFAULT 0,
  published_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  meta_title VARCHAR(255),
  meta_description VARCHAR(500),
  meta_keywords VARCHAR(255),
  FOREIGN KEY (author_id) REFERENCES Admins(id) ON DELETE SET NULL,
  INDEX idx_slug (slug),
  INDEX idx_status (status),
  INDEX idx_published_at (published_at),
  INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Blog Categories Table
CREATE TABLE IF NOT EXISTS Blog_Categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name_hindi VARCHAR(100) NOT NULL,
  name_english VARCHAR(100),
  slug VARCHAR(100) UNIQUE NOT NULL,
  description_hindi TEXT,
  description_english TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Blog Comments Table (Optional - for user engagement)
CREATE TABLE IF NOT EXISTS Blog_Comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  author_name VARCHAR(100) NOT NULL,
  author_email VARCHAR(100),
  comment_text TEXT NOT NULL,
  status ENUM('pending', 'approved', 'spam', 'trash') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES Blog_Posts(id) ON DELETE CASCADE,
  INDEX idx_post_id (post_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample categories
INSERT INTO Blog_Categories (name_hindi, name_english, slug, description_hindi, description_english) VALUES
('चुनाव समाचार', 'Election News', 'election-news', 'बिहार विधानसभा चुनाव से संबंधित ताजा समाचार', 'Latest news related to Bihar Assembly Elections'),
('राजनीतिक विश्लेषण', 'Political Analysis', 'political-analysis', 'चुनाव और राजनीतिक घटनाओं का गहन विश्लेषण', 'In-depth analysis of elections and political events'),
('निर्वाचन आयोग', 'Election Commission', 'election-commission', 'ईसीआई अपडेट और दिशानिर्देश', 'ECI updates and guidelines'),
('उम्मीदवार प्रोफाइल', 'Candidate Profiles', 'candidate-profiles', 'विधानसभा उम्मीदवारों की प्रोफाइल', 'Profiles of assembly candidates'),
('मतदाता जागरूकता', 'Voter Awareness', 'voter-awareness', 'मतदाताओं के लिए जानकारी और दिशानिर्देश', 'Information and guidelines for voters')
ON DUPLICATE KEY UPDATE name_hindi=VALUES(name_hindi);
