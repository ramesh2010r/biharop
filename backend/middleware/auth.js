const jwt = require('jsonwebtoken');

/**
 * Middleware to verify JWT token for admin routes
 */
function authenticateAdmin(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'प्रमाणीकरण आवश्यक है' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'अमान्य या समाप्त टोकन' });
  }
}

/**
 * Middleware to check if user is superadmin
 */
function requireSuperAdmin(req, res, next) {
  if (req.admin.role !== 'Super Admin') {
    return res.status(403).json({ error: 'सुपर एडमिन पहुंच आवश्यक है' });
  }
  next();
}

module.exports = { authenticateAdmin, requireSuperAdmin };
