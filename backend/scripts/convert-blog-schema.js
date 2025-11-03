const fs = require('fs').promises;
const path = require('path');

/**
 * Convert blog JSON files from simple schema to bilingual schema
 * Converts: title → title_hindi/title_english
 *           content → content_hindi/content_english
 *           excerpt → excerpt_hindi/excerpt_english
 *           featured_image → featured_image_url
 */

async function convertBlogSchema(inputFile, outputFile) {
  try {
    console.log(`\n📄 Converting: ${path.basename(inputFile)}`);
    
    // Read original blog data
    const originalData = JSON.parse(await fs.readFile(inputFile, 'utf8'));
    
    // Convert to new schema
    const convertedData = {
      title_hindi: originalData.title,
      title_english: originalData.title, // Same for now
      slug: originalData.slug,
      content_hindi: originalData.content,
      content_english: null, // English content not available
      excerpt_hindi: originalData.excerpt,
      excerpt_english: originalData.excerpt, // Use same excerpt
      featured_image_url: originalData.featured_image,
      author_id: originalData.author_id,
      category: originalData.category,
      tags: Array.isArray(originalData.tags) ? originalData.tags.join(', ') : originalData.tags, // Convert array to comma-separated string
      status: originalData.status,
      meta_title: originalData.title, // Use title as meta_title
      meta_description: originalData.meta_description,
      meta_keywords: originalData.meta_keywords,
      published_at: originalData.published_at
    };
    
    // Write converted data
    await fs.writeFile(
      outputFile,
      JSON.stringify(convertedData, null, 2),
      'utf8'
    );
    
    console.log(`✅ Converted successfully`);
    console.log(`   Input:  ${inputFile}`);
    console.log(`   Output: ${outputFile}`);
    
    return convertedData;
  } catch (error) {
    console.error(`❌ Error converting ${inputFile}:`, error.message);
    throw error;
  }
}

async function main() {
  console.log('🔄 Converting Blog JSON Files to Match Database Schema');
  console.log('======================================================\n');
  
  const dataDir = path.join(__dirname, '../data');
  
  const blogs = [
    {
      input: path.join(dataDir, 'blog-01-bihar-38-districts.json'),
      output: path.join(dataDir, 'blog-01-bihar-38-districts-converted.json')
    },
    {
      input: path.join(dataDir, 'blog-02-243-seats.json'),
      output: path.join(dataDir, 'blog-02-243-seats-converted.json')
    },
    {
      input: path.join(dataDir, 'blog-03-bihar-cm.json'),
      output: path.join(dataDir, 'blog-03-bihar-cm-converted.json')
    }
  ];
  
  console.log('Converting 3 blog files...\n');
  
  for (const blog of blogs) {
    await convertBlogSchema(blog.input, blog.output);
  }
  
  console.log('\n======================================================');
  console.log('✅ All blogs converted successfully!');
  console.log('======================================================\n');
  
  console.log('📋 Converted Files:');
  console.log('  1. blog-01-bihar-38-districts-converted.json');
  console.log('  2. blog-02-243-seats-converted.json');
  console.log('  3. blog-03-bihar-cm-converted-converted.json');
  
  console.log('\n📝 Schema Mapping:');
  console.log('  Old Schema          →  New Schema');
  console.log('  ─────────────────────  ────────────────────────');
  console.log('  title               →  title_hindi + title_english');
  console.log('  content             →  content_hindi + content_english');
  console.log('  excerpt             →  excerpt_hindi + excerpt_english');
  console.log('  featured_image      →  featured_image_url');
  console.log('  (added meta_title)  →  meta_title');
  
  console.log('\n🚀 Next Steps:');
  console.log('  1. Review converted files in backend/data/');
  console.log('  2. Run deployment script again');
  console.log('  3. Blogs should insert successfully into database');
}

main().catch(error => {
  console.error('❌ Conversion failed:', error);
  process.exit(1);
});
