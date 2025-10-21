const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticateAdmin } = require('../middleware/auth');

// Ensure upload directories exist
const uploadsDir = path.join(__dirname, '../public/uploads');
const partySymbolsDir = path.join(uploadsDir, 'party-symbols');
const candidatePhotosDir = path.join(uploadsDir, 'candidate-photos');

[uploadsDir, partySymbolsDir, candidatePhotosDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure multer storage for party symbols
const partySymbolStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, partySymbolsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: party-symbol-timestamp-random.ext
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'party-symbol-' + uniqueSuffix + ext);
  }
});

// Configure multer storage for candidate photos
const candidatePhotoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, candidatePhotosDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: candidate-photo-timestamp-random.ext
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'candidate-photo-' + uniqueSuffix + ext);
  }
});

// File filter - only allow images
const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|svg|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('केवल छवि फ़ाइलें (JPG, PNG, GIF, SVG, WEBP) अपलोड करें'));
  }
};

// Multer upload instances
const uploadPartySymbol = multer({
  storage: partySymbolStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: imageFilter
}).single('symbol');

const uploadCandidatePhoto = multer({
  storage: candidatePhotoStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: imageFilter
}).single('photo');

/**
 * POST /api/upload/party-symbol
 * Upload a party symbol image
 */
router.post('/party-symbol', authenticateAdmin, (req, res) => {
  uploadPartySymbol(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Multer error
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'फ़ाइल का आकार 2MB से अधिक नहीं होना चाहिए' });
      }
      return res.status(400).json({ error: 'फ़ाइल अपलोड त्रुटि: ' + err.message });
    } else if (err) {
      // Other errors
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'कोई फ़ाइल अपलोड नहीं की गई' });
    }

    // Return the URL to access the uploaded file
    const fileUrl = `/uploads/party-symbols/${req.file.filename}`;
    
    res.json({
      success: true,
      message: 'पार्टी प्रतीक सफलतापूर्वक अपलोड किया गया',
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
  });
});

/**
 * POST /api/upload/candidate-photo
 * Upload a candidate photo
 */
router.post('/candidate-photo', authenticateAdmin, (req, res) => {
  uploadCandidatePhoto(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Multer error
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'फ़ाइल का आकार 5MB से अधिक नहीं होना चाहिए' });
      }
      return res.status(400).json({ error: 'फ़ाइल अपलोड त्रुटि: ' + err.message });
    } else if (err) {
      // Other errors
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'कोई फ़ाइल अपलोड नहीं की गई' });
    }

    // Return the URL to access the uploaded file
    const fileUrl = `/uploads/candidate-photos/${req.file.filename}`;
    
    res.json({
      success: true,
      message: 'उम्मीदवार की तस्वीर सफलतापूर्वक अपलोड की गई',
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
  });
});

/**
 * DELETE /api/upload/party-symbol/:filename
 * Delete a party symbol image
 */
router.delete('/party-symbol/:filename', authenticateAdmin, (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(partySymbolsDir, filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'फ़ाइल नहीं मिली' });
    }

    // Delete the file
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      message: 'पार्टी प्रतीक सफलतापूर्वक हटाया गया'
    });
  } catch (error) {
    console.error('Error deleting party symbol:', error);
    res.status(500).json({ error: 'फ़ाइल हटाने में त्रुटि' });
  }
});

/**
 * DELETE /api/upload/candidate-photo/:filename
 * Delete a candidate photo
 */
router.delete('/candidate-photo/:filename', authenticateAdmin, (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(candidatePhotosDir, filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'फ़ाइल नहीं मिली' });
    }

    // Delete the file
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      message: 'उम्मीदवार की तस्वीर सफलतापूर्वक हटाई गई'
    });
  } catch (error) {
    console.error('Error deleting candidate photo:', error);
    res.status(500).json({ error: 'फ़ाइल हटाने में त्रुटि' });
  }
});

/**
 * GET /api/upload/info
 * Get upload configuration info
 */
router.get('/info', authenticateAdmin, (req, res) => {
  res.json({
    partySymbol: {
      maxSize: '2MB',
      allowedTypes: ['JPEG', 'JPG', 'PNG', 'GIF', 'SVG', 'WEBP'],
      path: '/uploads/party-symbols/'
    },
    candidatePhoto: {
      maxSize: '5MB',
      allowedTypes: ['JPEG', 'JPG', 'PNG', 'GIF', 'WEBP'],
      path: '/uploads/candidate-photos/'
    }
  });
});

module.exports = router;
