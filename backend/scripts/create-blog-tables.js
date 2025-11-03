const db = require('../config/database');
const fs = require('fs');
const path = require('path');

async function createBlogTables() {
  try {
    console.log('📊 Creating blog database tables...\n');
    
    // Read the schema file
    const schemaSQL = fs.readFileSync(
      path.join(__dirname, '../database/blog_schema.sql'),
      'utf8'
    );
    
    // Split into individual statements
    const statements = schemaSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    // Execute each statement
    for (const statement of statements) {
      try {
        await db.query(statement);
        // Get table name from CREATE TABLE or INSERT statement
        const match = statement.match(/CREATE TABLE[^(]+\(([^)]+)\)|INSERT INTO (\w+)/i);
        if (match) {
          if (statement.includes('CREATE TABLE')) {
            const tableName = statement.match(/CREATE TABLE[^`]*`?(\w+)`?/i)[1];
            console.log(`✓ Created table: ${tableName}`);
          } else if (statement.includes('INSERT INTO')) {
            console.log(`✓ Inserted sample data`);
          }
        }
      } catch (err) {
        if (err.code === 'ER_TABLE_EXISTS_ERR') {
          const tableName = err.message.match(/\'([^\']+)\'/)[1];
          console.log(`⚠ Table already exists: ${tableName}`);
        } else if (err.code === 'ER_DUP_ENTRY') {
          console.log(`⚠ Sample data already exists`);
        } else {
          throw err;
        }
      }
    }
    
    console.log('\n✅ Blog database tables created successfully!');
    console.log('\nNow you can run: node scripts/insert-blog-posts.js\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating blog tables:', error.message);
    process.exit(1);
  }
}

createBlogTables();
