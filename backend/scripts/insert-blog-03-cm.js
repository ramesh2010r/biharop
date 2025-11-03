const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

async function insertBlog() {
  let connection;
  
  try {
    // Create database connection
    connection = await mysql.createConnection({
      host: '15.206.160.149',
      user: 'opinion_poll_user',
      password: 'BiharPoll2025Secure',
      database: 'bihar_opinion_poll'
    });

    console.log('✅ Connected to database');

    // Read blog data from JSON file
    const blogDataPath = path.join(__dirname, '../data/blog-03-bihar-cm.json');
    const blogData = JSON.parse(await fs.readFile(blogDataPath, 'utf8'));

    console.log(`📝 Inserting blog: ${blogData.title}`);

    // Insert blog into Blog_Posts table
    const insertQuery = `
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
        published_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      blogData.title,
      blogData.slug,
      blogData.excerpt,
      blogData.content,
      blogData.featured_image,
      blogData.author_id,
      blogData.category,
      blogData.tags,
      blogData.meta_description,
      blogData.meta_keywords,
      blogData.read_time,
      blogData.status,
      blogData.published_at
    ];

    const [result] = await connection.execute(insertQuery, values);
    
    console.log(`✅ Blog inserted successfully! ID: ${result.insertId}`);

    // Verify insertion
    const [rows] = await connection.execute(
      'SELECT post_id, title, slug, status, published_at FROM Blog_Posts WHERE post_id = ?',
      [result.insertId]
    );

    console.log('\n📊 Inserted Blog Details:');
    console.log('─'.repeat(80));
    console.log(`ID: ${rows[0].post_id}`);
    console.log(`Title: ${rows[0].title}`);
    console.log(`Slug: ${rows[0].slug}`);
    console.log(`Status: ${rows[0].status}`);
    console.log(`Published: ${rows[0].published_at}`);
    console.log('─'.repeat(80));

    // Count total published blogs
    const [countRows] = await connection.execute(
      'SELECT COUNT(*) as total FROM Blog_Posts WHERE status = "published"'
    );

    console.log(`\n📈 Total Published Blogs: ${countRows[0].total}`);

    // Show blog URL
    console.log(`\n🔗 Blog URL: https://opinionpoll.co.in/blog/${blogData.slug}`);
    console.log(`\n✅ Ready to view on website!`);

  } catch (error) {
    console.error('❌ Error inserting blog:', error.message);
    if (error.code === 'ER_DUP_ENTRY') {
      console.error('   This blog slug already exists in the database.');
    }
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n✅ Database connection closed');
    }
  }
}

// Run the insertion
insertBlog();
