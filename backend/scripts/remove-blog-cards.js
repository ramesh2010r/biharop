const mysql = require('mysql2/promise');
require('dotenv').config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || '15.206.160.149',
  user: process.env.DB_USER || 'opinon_poll',
  password: process.env.DB_PASSWORD || 'OpinionPoll@2024#Secure',
  database: process.env.DB_NAME || 'bihar_opinion_poll'
};

async function removeCardStyling() {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Database connected');

    // Get all blog posts
    const [posts] = await connection.execute(
      'SELECT id, title_hindi, content_hindi FROM Blog_Posts'
    );

    console.log(`\n📝 Found ${posts.length} blog posts to clean\n`);

    for (const post of posts) {
      let cleanContent = post.content_hindi;

      // Remove all card-related classes and wrapper divs
      cleanContent = cleanContent
        // Remove gradient backgrounds
        .replace(/bg-gradient-to-[a-z]+\s+from-[\w-]+\s+(?:via-[\w-]+\s+)?to-[\w-]+/g, '')
        // Remove solid backgrounds
        .replace(/bg-(white|gray|orange|green|blue|yellow|purple|red|pink|indigo)-\d+/g, '')
        // Remove padding
        .replace(/p-\d+/g, '')
        // Remove rounded corners
        .replace(/rounded-[a-z]+/g, '')
        // Remove shadows
        .replace(/shadow-[a-z]+/g, '')
        // Remove borders
        .replace(/border-[a-z]-\d+\s+border-[\w-]+/g, '')
        // Remove grid classes
        .replace(/grid\s+grid-cols-\d+\s+md:grid-cols-\d+\s+gap-\d+/g, '')
        // Clean up extra spaces
        .replace(/\s{2,}/g, ' ')
        .replace(/class='[\s]+'/g, "class=''")
        .replace(/class="[\s]+"/g, 'class=""');

      // Remove empty divs with only styling classes
      cleanContent = cleanContent.replace(/<div\s+class=['"]{2}>\s*<\/div>/g, '');

      // Wrap sections with proper semantic HTML instead of cards
      cleanContent = cleanContent
        .replace(/<div class='space-y-8'>/g, "<article class='blog-content space-y-8'>")
        .replace(/<\/div>$/g, '</article>');

      // Update in database
      await connection.execute(
        'UPDATE Blog_Posts SET content_hindi = ? WHERE id = ?',
        [cleanContent, post.id]
      );

      console.log(`✅ Cleaned: ${post.title_hindi}`);
    }

    console.log('\n✅ All blog posts cleaned successfully!');

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

removeCardStyling();
