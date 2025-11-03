// Insert Blog #1: बिहार में कितने जिले हैं?
// Target Keyword: bihar mein kitne jile hain (8,100 monthly searches)
// Publish Date: November 1, 2025 at 10:00 AM IST

const mysql = require('mysql2/promise');
require('dotenv').config();

const blogData = require('../data/blog-01-bihar-38-districts.json');

async function insertBlog01() {
  let connection;
  
  try {
    // Create database connection
    connection = await mysql.createConnection({
      host: '15.206.160.149',
      user: 'opinion_poll_user',
      password: 'BiharPoll2025Secure',
      database: 'bihar_opinion_poll'
    });

    console.log('✅ Database connected successfully');

    // Prepare the SQL query
    const query = `
      INSERT INTO Blog_Posts (
        title,
        slug,
        excerpt,
        content,
        featured_image,
        author_id,
        category,
        tags,
        meta_description,
        meta_keywords,
        read_time,
        status,
        published_at,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    // Prepare values
    const values = [
      blogData.title,
      blogData.slug,
      blogData.excerpt,
      blogData.content,
      blogData.featured_image,
      blogData.author_id, // NULL
      blogData.category,
      JSON.stringify(blogData.tags),
      blogData.meta_description,
      blogData.meta_keywords,
      blogData.read_time,
      blogData.status,
      blogData.published_at
    ];

    // Execute query
    const [result] = await connection.execute(query, values);

    console.log('📄 Blog Title:', blogData.title);
    console.log('🔗 Slug:', blogData.slug);
    console.log('✅ Blog inserted successfully!');
    console.log('📊 Insert ID:', result.insertId);
    console.log('📅 Publish Date:', blogData.published_at);
    console.log('🎯 Target Keyword: bihar mein kitne jile hain (8,100 searches/month)');
    console.log('📈 Expected: Page 1 ranking within 7-10 days');

    // Verify insertion
    const [rows] = await connection.execute(
      'SELECT id, title, slug, status, published_at FROM Blog_Posts WHERE slug = ?',
      [blogData.slug]
    );

    if (rows.length > 0) {
      console.log('\n✅ Verification successful:');
      console.log('   ID:', rows[0].id);
      console.log('   Title:', rows[0].title);
      console.log('   Status:', rows[0].status);
      console.log('   Published:', rows[0].published_at);
    }

    // Get total published blogs count
    const [countResult] = await connection.execute(
      "SELECT COUNT(*) as total FROM Blog_Posts WHERE status = 'published'"
    );
    console.log(`\n🎉 Total published blog posts: ${countResult[0].total}`);

  } catch (error) {
    console.error('❌ Error inserting blog:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔒 Database connection closed');
    }
  }
}

// Run the insertion
insertBlog01()
  .then(() => {
    console.log('\n✅ Blog #1 insertion complete!');
    console.log('📋 Next Steps:');
    console.log('   1. Upload featured image to /public/images/blog/');
    console.log('   2. Create visual assets (charts, maps)');
    console.log('   3. Test blog URL: https://opinionpoll.co.in/blog/bihar-mein-kitne-jile-hain-2025');
    console.log('   4. Submit URL to Google Search Console on Nov 1');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Failed to insert blog:', error);
    process.exit(1);
  });
