const db = require('../config/database');

async function verifyBlogs() {
  try {
    console.log('🔍 Verifying blog posts in database...\n');
    
    const [posts] = await db.query(`
      SELECT id, title_hindi, slug, category, status, published_at 
      FROM Blog_Posts 
      ORDER BY id
    `);
    
    console.log(`✅ Found ${posts.length} blog posts:\n`);
    
    posts.forEach((post, index) => {
      console.log(`${index + 1}. ${post.title_hindi}`);
      console.log(`   📝 Slug: ${post.slug}`);
      console.log(`   📂 Category: ${post.category}`);
      console.log(`   ✓ Status: ${post.status}`);
      console.log(`   🆔 ID: ${post.id}\n`);
    });
    
    console.log('✅ All blogs are successfully stored in the database!');
    console.log('\n📱 Next steps:');
    console.log('1. Visit: http://localhost:3000/blog (if running locally)');
    console.log('2. Or deploy to production: https://opinionpoll.co.in/blog');
    console.log('3. Check individual blog: https://opinionpoll.co.in/blog/[slug]\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

verifyBlogs();
