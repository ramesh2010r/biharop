const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Database configuration
const dbConfig = {
  host: '15.206.160.149',
  user: 'opinion_poll_user',
  password: 'BiharPoll2025Secure',
  database: 'bihar_opinion_poll'
};

async function insertNewBlogs() {
  let connection;
  
  try {
    // Read the blog data
    const blogData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../data/new-2-blogs.json'), 'utf8')
    );
    
    console.log('📝 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Database connected\n');
    
    // Insert each blog post
    for (const blog of blogData) {
      console.log(`📄 Inserting: ${blog.title_hindi}`);
      
      const query = `
        INSERT INTO Blog_Posts (
          title_hindi, title_english, slug, content_hindi, content_english,
          excerpt_hindi, excerpt_english, featured_image_url, author_id,
          status, category, tags, meta_title, meta_description, meta_keywords,
          published_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, ?, ?, ?, ?, ?, NOW())
      `;
      
      const values = [
        blog.title_hindi,
        blog.title_english,
        blog.slug,
        blog.content_hindi,
        blog.content_english,
        blog.excerpt_hindi,
        blog.excerpt_english,
        blog.featured_image_url,
        blog.status,
        blog.category,
        blog.tags,
        blog.meta_title,
        blog.meta_description,
        blog.meta_keywords
      ];
      
      await connection.execute(query, values);
      console.log(`✅ Inserted successfully!\n`);
    }
    
    // Show total count
    const [rows] = await connection.execute('SELECT COUNT(*) as total FROM Blog_Posts WHERE status = "published"');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🎉 Total published blog posts: ${rows[0].total}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    // Show all blog titles
    const [allBlogs] = await connection.execute(
      'SELECT id, title_hindi, slug, published_at FROM Blog_Posts WHERE status = "published" ORDER BY published_at DESC'
    );
    
    console.log('📚 All Published Blogs:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    allBlogs.forEach((blog, index) => {
      console.log(`${index + 1}. ${blog.title_hindi}`);
      console.log(`   URL: https://opinionpoll.co.in/blog/${blog.slug}`);
      console.log(`   Published: ${blog.published_at.toISOString().split('T')[0]}\n`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('✅ Database connection closed');
    }
  }
}

// Run the script
insertNewBlogs();
