// Debug blog.js loading issue
const path = require('path');

console.log('=== Testing Auth Middleware Import ===');
try {
  const { authenticateAdmin } = require('./middleware/auth');
  console.log('✅ Auth middleware imported successfully');
  console.log('Type:', typeof authenticateAdmin);
  console.log('Is function:', typeof authenticateAdmin === 'function');
} catch (err) {
  console.log('❌ Auth middleware import failed:', err.message);
}

console.log('\n=== Testing Blog Route Loading ===');
try {
  // Don't use require() as it will cache and fail
  // Instead, check if the file can be parsed
  const fs = require('fs');
  const blogContent = fs.readFileSync('./routes/blog.js', 'utf8');
  console.log('✅ blog.js file readable');
  console.log('File size:', blogContent.length, 'bytes');
  
  // Check for problematic patterns
  const lines = blogContent.split('\n');
  console.log('\nChecking line 150:');
  console.log('Line 149:', lines[148]);
  console.log('Line 150:', lines[149]);
  console.log('Line 151:', lines[150]);
  console.log('Line 152:', lines[151]);
  
} catch (err) {
  console.log('❌ blog.js read failed:', err.message);
}
