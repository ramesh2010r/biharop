// Test if blog.js can be loaded
console.log('=== Attempting to load blog.js ===');

try {
  const blogRouter = require('./routes/blog');
  console.log('✅ blog.js loaded successfully!');
  console.log('Router type:', typeof blogRouter);
  console.log('Router stack length:', blogRouter.stack ? blogRouter.stack.length : 'N/A');
} catch (err) {
  console.log('❌ blog.js loading failed!');
  console.log('Error:', err.message);
  console.log('Stack:', err.stack);
}
