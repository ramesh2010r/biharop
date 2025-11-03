// Test auth middleware import
const { authenticateAdmin } = require('./middleware/auth');

console.log('authenticateAdmin type:', typeof authenticateAdmin);
console.log('authenticateAdmin is function:', typeof authenticateAdmin === 'function');
console.log('authenticateAdmin:', authenticateAdmin);

if (typeof authenticateAdmin === 'function') {
  console.log('✅ AUTH MIDDLEWARE IS CORRECTLY EXPORTED AS FUNCTION');
} else {
  console.log('❌ AUTH MIDDLEWARE IS NOT A FUNCTION:', authenticateAdmin);
}
