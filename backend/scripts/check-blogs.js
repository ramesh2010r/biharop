const mysql = require('mysql2/promise');

async function checkBlogs() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: '15.206.160.149',
      user: 'opinion_poll_user',
      password: 'BiharPoll2025Secure',
      database: 'bihar_opinion_poll'
    });

    console.log('✅ Connected to database\n');

    const [rows] = await connection.execute(
      'SELECT id, title_hindi, slug, status, published_at FROM Blog_Posts ORDER BY id DESC LIMIT 10'
    );

    console.log('📊 Recent Blog Posts in Database:');
    console.log('═'.repeat(120));
    rows.forEach(row => {
      console.log(`ID: ${row.id} | ${row.title_hindi.substring(0, 50)}... | ${row.slug} | ${row.status}`);
    });
    console.log('═'.repeat(120));
    console.log(`\n✅ Total blogs found: ${rows.length}`);

    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (connection) await connection.end();
    process.exit(1);
  }
}

checkBlogs();
