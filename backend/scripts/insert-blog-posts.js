const db = require('../config/database');
const fs = require('fs');
const path = require('path');

// Load blog posts from JSON files
const blogPosts1 = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/blog-posts.json'), 'utf8'));
const blogPosts2 = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/blog-posts-part2.json'), 'utf8'));

// All 5 beautiful blog posts
const blogPosts = [
  {
    title_hindi: blogPosts1[0].title_hindi,
    title_english: blogPosts1[0].title_english,
    slug: blogPosts1[0].slug,
    category: blogPosts1[0].category,
    tags: blogPosts1[0].tags,
    excerpt_hindi: blogPosts1[0].excerpt_hindi,
    excerpt_english: blogPosts1[0].excerpt_english,
    content_hindi: blogPosts1[0].content_hindi,
    meta_title: blogPosts1[0].meta_title,
    meta_description: blogPosts1[0].meta_description,
    meta_keywords: blogPosts1[0].meta_keywords,
    status: 'published',
    author_id: null
  },
  {
    title_hindi: blogPosts1[1].title_hindi,
    title_english: blogPosts1[1].title_english,
    slug: blogPosts1[1].slug,
    category: blogPosts1[1].category,
    tags: blogPosts1[1].tags,
    excerpt_hindi: blogPosts1[1].excerpt_hindi,
    excerpt_english: blogPosts1[1].excerpt_english,
    content_hindi: blogPosts1[1].content_hindi,
    meta_title: blogPosts1[1].meta_title,
    meta_description: blogPosts1[1].meta_description,
    meta_keywords: blogPosts1[1].meta_keywords,
    status: 'published',
    author_id: null
  },
  {
    title_hindi: blogPosts2[0].title_hindi,
    title_english: blogPosts2[0].title_english,
    slug: blogPosts2[0].slug,
    category: blogPosts2[0].category,
    tags: blogPosts2[0].tags,
    excerpt_hindi: blogPosts2[0].excerpt_hindi,
    excerpt_english: blogPosts2[0].excerpt_english,
    content_hindi: blogPosts2[0].content_hindi,
    meta_title: blogPosts2[0].meta_title,
    meta_description: blogPosts2[0].meta_description,
    meta_keywords: blogPosts2[0].meta_keywords,
    status: 'published',
    author_id: null
  },
  {
    title_hindi: blogPosts2[1].title_hindi,
    title_english: blogPosts2[1].title_english,
    slug: blogPosts2[1].slug,
    category: blogPosts2[1].category,
    tags: blogPosts2[1].tags,
    excerpt_hindi: blogPosts2[1].excerpt_hindi,
    excerpt_english: blogPosts2[1].excerpt_english,
    content_hindi: blogPosts2[1].content_hindi,
    meta_title: blogPosts2[1].meta_title,
    meta_description: blogPosts2[1].meta_description,
    meta_keywords: blogPosts2[1].meta_keywords,
    status: 'published',
    author_id: null
  },
  {
    title_hindi: "ओपिनियन पोल कैसे काम करता है? जानें पूरी प्रक्रिया",
    title_english: "How Does Opinion Poll Work? Know the Complete Process",
    slug: "opinion-poll-kaise-kaam-karta-hai",
    category: "चुनाव समाचार",
    tags: "ओपिनियन पोल, सर्वे, मतदान पूर्वानुमान, चुनाव विश्लेषण",
    excerpt_hindi: "ओपिनियन पोल क्या है और यह कैसे काम करता है? समझें सर्वे की पूरी प्रक्रिया, विधियां और सटीकता की जानकारी।",
    excerpt_english: "What is Opinion Poll and how does it work? Understand the complete survey process, methods and accuracy information.",
    content_hindi: `<div class='space-y-8'>

<div class='bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl border-l-4 border-purple-500'>
<h2 class='text-2xl font-bold text-gray-900 mb-4'>📊 ओपिनियन पोल - लोकतंत्र का दर्पण</h2>
<p class='text-lg text-gray-700 leading-relaxed'>ओपिनियन पोल चुनाव से पहले मतदाताओं की राय जानने का एक वैज्ञानिक तरीका है। यह जनता की नब्ज टटोलने का महत्वपूर्ण माध्यम है।</p>
</div>

<div class='bg-white p-6 rounded-xl shadow-lg'>
<h3 class='text-2xl font-bold text-blue-600 mb-4'>🤔 ओपिनियन पोल क्या है?</h3>
<div class='space-y-4'>
<p class='text-gray-700 leading-relaxed'>ओपिनियन पोल एक सांख्यिकीय सर्वेक्षण है जो चुनाव से पहले मतदाताओं के विचारों और पसंद को समझने के लिए किया जाता है। इसमें एक नमूना समूह (Sample) से सवाल पूछे जाते हैं और उनकी राय के आधार पर पूरी जनसंख्या के रुझान का अनुमान लगाया जाता है।</p>

<div class='bg-blue-50 p-4 rounded-lg'>
<h4 class='font-bold text-gray-900 mb-2'>मुख्य उद्देश्य:</h4>
<ul class='space-y-2 text-gray-700'>
<li class='flex items-start gap-2'>
<span class='text-blue-500 font-bold'>•</span>
<span>मतदाताओं की वर्तमान राय जानना</span>
</li>
<li class='flex items-start gap-2'>
<span class='text-blue-500 font-bold'>•</span>
<span>चुनावी रुझान का अनुमान लगाना</span>
</li>
<li class='flex items-start gap-2'>
<span class='text-blue-500 font-bold'>•</span>
<span>प्रमुख मुद्दों की पहचान करना</span>
</li>
<li class='flex items-start gap-2'>
<span class='text-blue-500 font-bold'>•</span>
<span>राजनीतिक दलों को फीडबैक देना</span>
</li>
</ul>
</div>
</div>
</div>

<div class='bg-white p-6 rounded-xl shadow-lg'>
<h3 class='text-2xl font-bold text-green-600 mb-6 text-center'>🔬 ओपिनियन पोल की प्रक्रिया</h3>

<div class='space-y-6'>
<div class='relative pl-8 pb-8 border-l-2 border-green-300'>
<div class='absolute -left-4 top-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold'>1</div>
<div class='bg-green-50 p-4 rounded-lg'>
<h4 class='font-bold text-gray-900 mb-2'>नमूना चयन (Sampling)</h4>
<p class='text-gray-700'>पूरी आबादी में से एक प्रतिनिधि नमूना चुना जाता है। यह नमूना विभिन्न वर्गों - उम्र, लिंग, जाति, क्षेत्र को प्रतिनिधित्व करता है।</p>
<div class='mt-2 p-3 bg-white rounded-lg text-sm'>
<strong>उदाहरण:</strong> बिहार के 7.5 करोड़ मतदाताओं में से 10,000-50,000 लोगों का नमूना
</div>
</div>
</div>

<div class='relative pl-8 pb-8 border-l-2 border-blue-300'>
<div class='absolute -left-4 top-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold'>2</div>
<div class='bg-blue-50 p-4 rounded-lg'>
<h4 class='font-bold text-gray-900 mb-2'>प्रश्नावली तैयारी</h4>
<p class='text-gray-700'>सर्वेक्षण के लिए स्पष्ट, निष्पक्ष और प्रासंगिक प्रश्न तैयार किए जाते हैं। प्रश्नों में पक्षपात नहीं होना चाहिए।</p>
</div>
</div>

<div class='relative pl-8 pb-8 border-l-2 border-yellow-300'>
<div class='absolute -left-4 top-0 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold'>3</div>
<div class='bg-yellow-50 p-4 rounded-lg'>
<h4 class='font-bold text-gray-900 mb-2'>डेटा संग्रह (Data Collection)</h4>
<p class='text-gray-700'>विभिन्न माध्यमों से डेटा एकत्र किया जाता है:</p>
<ul class='mt-2 space-y-1 text-sm text-gray-700'>
<li>• फोन सर्वे (Telephonic)</li>
<li>• घर-घर जाकर (Door-to-door)</li>
<li>• ऑनलाइन सर्वे</li>
<li>• SMS/WhatsApp सर्वे</li>
</ul>
</div>
</div>

<div class='relative pl-8 pb-8 border-l-2 border-purple-300'>
<div class='absolute -left-4 top-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold'>4</div>
<div class='bg-purple-50 p-4 rounded-lg'>
<h4 class='font-bold text-gray-900 mb-2'>डेटा विश्लेषण (Analysis)</h4>
<p class='text-gray-700'>एकत्रित डेटा को सांख्यिकीय विधियों से analyze किया जाता है। वेटेज और एडजस्टमेंट के बाद परिणाम निकाले जाते हैं।</p>
</div>
</div>

<div class='relative pl-8'>
<div class='absolute -left-4 top-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold'>5</div>
<div class='bg-red-50 p-4 rounded-lg'>
<h4 class='font-bold text-gray-900 mb-2'>परिणाम प्रकाशन</h4>
<p class='text-gray-700'>अंतिम परिणाम margin of error के साथ प्रकाशित किए जाते हैं। ECI नियमों के अनुसार मतदान से 48 घंटे पहले प्रकाशन बंद।</p>
</div>
</div>
</div>
</div>

<div class='bg-gradient-to-br from-orange-50 to-yellow-50 p-6 rounded-xl'>
<h3 class='text-xl font-bold text-gray-900 mb-4'>📈 सांख्यिकीय अवधारणाएं</h3>
<div class='grid grid-cols-1 md:grid-cols-2 gap-4'>
<div class='bg-white p-4 rounded-lg'>
<h4 class='font-bold text-orange-600 mb-2'>Sample Size (नमूना आकार)</h4>
<p class='text-sm text-gray-700'>जितना बड़ा नमूना, उतना अधिक सटीक परिणाम। आमतौर पर 10,000-50,000 लोगों का नमूना लिया जाता है।</p>
<div class='mt-2 p-2 bg-orange-50 rounded text-xs'>
<strong>फॉर्मूला:</strong> n = (Z² × p × q) / E²
</div>
</div>

<div class='bg-white p-4 rounded-lg'>
<h4 class='font-bold text-green-600 mb-2'>Margin of Error</h4>
<p class='text-sm text-gray-700'>परिणाम में संभावित त्रुटि का प्रतिशत। आमतौर पर ±3% से ±5% होता है।</p>
<div class='mt-2 p-2 bg-green-50 rounded text-xs'>
<strong>उदाहरण:</strong> BJP 35% ±3% = 32-38%
</div>
</div>

<div class='bg-white p-4 rounded-lg'>
<h4 class='font-bold text-blue-600 mb-2'>Confidence Level</h4>
<p class='text-sm text-gray-700'>परिणाम की विश्वसनीयता का स्तर। आमतौर पर 95% confidence level उपयोग होता है।</p>
</div>

<div class='bg-white p-4 rounded-lg'>
<h4 class='font-bold text-purple-600 mb-2'>Stratified Sampling</h4>
<p class='text-sm text-gray-700'>जनसंख्या को विभिन्न वर्गों में बांटकर प्रत्येक से नमूना लेना।</p>
</div>
</div>
</div>

<div class='bg-white p-6 rounded-xl shadow-lg'>
<h3 class='text-xl font-bold text-gray-900 mb-4'>✅ सटीक ओपिनियन पोल की विशेषताएं</h3>
<div class='space-y-3'>
<div class='bg-green-50 p-4 rounded-lg flex items-start gap-3'>
<span class='text-2xl'>✓</span>
<div>
<div class='font-bold text-gray-900'>प्रतिनिधि नमूना</div>
<div class='text-sm text-gray-600'>सभी वर्गों का उचित प्रतिनिधित्व</div>
</div>
</div>

<div class='bg-green-50 p-4 rounded-lg flex items-start gap-3'>
<span class='text-2xl'>✓</span>
<div>
<div class='font-bold text-gray-900'>निष्पक्ष प्रश्न</div>
<div class='text-sm text-gray-600'>किसी पार्टी की तरफ झुकाव नहीं</div>
</div>
</div>

<div class='bg-green-50 p-4 rounded-lg flex items-start gap-3'>
<span class='text-2xl'>✓</span>
<div>
<div class='font-bold text-gray-900'>पर्याप्त नमूना आकार</div>
<div class='text-sm text-gray-600'>कम से कम 10,000 respondents</div>
</div>
</div>

<div class='bg-green-50 p-4 rounded-lg flex items-start gap-3'>
<span class='text-2xl'>✓</span>
<div>
<div class='font-bold text-gray-900'>वैज्ञानिक विधि</div>
<div class='text-sm text-gray-600'>सांख्यिकीय सिद्धांतों का पालन</div>
</div>
</div>

<div class='bg-green-50 p-4 rounded-lg flex items-start gap-3'>
<span class='text-2xl'>✓</span>
<div>
<div class='font-bold text-gray-900'>पारदर्शिता</div>
<div class='text-sm text-gray-600'>विधि और नमूना की जानकारी सार्वजनिक</div>
</div>
</div>
</div>
</div>

<div class='bg-white p-6 rounded-xl shadow-lg'>
<h3 class='text-xl font-bold text-gray-900 mb-4'>⚠️ ओपिनियन पोल की सीमाएं</h3>
<div class='space-y-3'>
<div class='bg-red-50 p-4 rounded-lg'>
<h4 class='font-semibold text-gray-900 mb-1'>1. सैंपलिंग एरर</h4>
<p class='text-sm text-gray-700'>नमूना पूरी आबादी का पूर्ण प्रतिनिधित्व नहीं कर सकता।</p>
</div>

<div class='bg-yellow-50 p-4 rounded-lg'>
<h4 class='font-semibold text-gray-900 mb-1'>2. नॉन-रिस्पॉन्स बायस</h4>
<p class='text-sm text-gray-700'>कुछ लोग जवाब नहीं देते, जो परिणाम को प्रभावित कर सकता है।</p>
</div>

<div class='bg-orange-50 p-4 rounded-lg'>
<h4 class='font-semibold text-gray-900 mb-1'>3. सामाजिक वांछनीयता</h4>
<p class='text-sm text-gray-700'>लोग अपनी असली राय छुपा सकते हैं।</p>
</div>

<div class='bg-purple-50 p-4 rounded-lg'>
<h4 class='font-semibold text-gray-900 mb-1'>4. टाइमिंग का प्रभाव</h4>
<p class='text-sm text-gray-700'>मतदाता की राय समय के साथ बदल सकती है।</p>
</div>
</div>
</div>

<div class='bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-xl border-l-4 border-blue-500'>
<h3 class='text-xl font-bold text-gray-900 mb-3'>🎯 ओपिनियन पोल बनाम एग्जिट पोल</h3>
<div class='overflow-x-auto'>
<table class='w-full text-sm'>
<thead class='bg-gray-100'>
<tr>
<th class='p-3 text-left font-bold'>विशेषता</th>
<th class='p-3 text-left font-bold'>ओपिनियन पोल</th>
<th class='p-3 text-left font-bold'>एग्जिट पोल</th>
</tr>
</thead>
<tbody class='divide-y'>
<tr class='bg-white'>
<td class='p-3 font-semibold'>समय</td>
<td class='p-3'>मतदान से पहले</td>
<td class='p-3'>मतदान के दौरान/बाद</td>
</tr>
<tr class='bg-gray-50'>
<td class='p-3 font-semibold'>उद्देश्य</td>
<td class='p-3'>रुझान जानना</td>
<td class='p-3'>वास्तविक वोटिंग पैटर्न</td>
</tr>
<tr class='bg-white'>
<td class='p-3 font-semibold'>सटीकता</td>
<td class='p-3'>कम (राय बदल सकती है)</td>
<td class='p-3'>अधिक (वोट के बाद)</td>
</tr>
<tr class='bg-gray-50'>
<td class='p-3 font-semibold'>ECI नियम</td>
<td class='p-3'>48 घंटे पहले बंद</td>
<td class='p-3'>सभी चरण समाप्ति तक बंद</td>
</tr>
</tbody>
</table>
</div>
</div>

<div class='bg-white p-6 rounded-xl shadow-lg'>
<h3 class='text-xl font-bold text-gray-900 mb-4'>💡 मतदाताओं के लिए सुझाव</h3>
<div class='space-y-3'>
<div class='bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg'>
<p class='font-semibold text-gray-900'>✓ ओपिनियन पोल को reference के रूप में देखें</p>
<p class='text-sm text-gray-600'>यह केवल एक अनुमान है, निश्चित परिणाम नहीं</p>
</div>

<div class='bg-gradient-to-r from-green-50 to-yellow-50 p-4 rounded-lg'>
<p class='font-semibold text-gray-900'>✓ विभिन्न स्रोतों की तुलना करें</p>
<p class='text-sm text-gray-600'>एक ही सर्वे पर depend न करें</p>
</div>

<div class='bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg'>
<p class='font-semibold text-gray-900'>✓ पोल की methodology जांचें</p>
<p class='text-sm text-gray-600'>नमूना आकार, margin of error देखें</p>
</div>

<div class='bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg'>
<p class='font-semibold text-gray-900'>✓ स्वतंत्र रूप से निर्णय लें</p>
<p class='text-sm text-gray-600'>पोल से प्रभावित होकर वोट न दें</p>
</div>
</div>
</div>

<div class='bg-gradient-to-r from-green-100 to-blue-100 p-6 rounded-xl border-l-4 border-green-500'>
<h3 class='text-xl font-bold text-gray-900 mb-3'>📢 ECI नियम</h3>
<p class='text-gray-700 leading-relaxed'>निर्वाचन आयोग के अनुसार, मतदान से 48 घंटे पहले किसी भी प्रकार का ओपिनियन पोल या सर्वे परिणाम प्रकाशित करना प्रतिबंधित है। यह नियम सुनिश्चित करता है कि मतदाता स्वतंत्र रूप से अपना निर्णय ले सकें।</p>
</div>

<div class='bg-blue-600 text-white p-8 rounded-xl text-center'>
<h3 class='text-2xl font-bold mb-4'>📊 जागरूक मतदाता बनें</h3>
<p class='text-lg leading-relaxed'>ओपिनियन पोल को समझें, लेकिन अपनी सोच से वोट करें।<br/>हर वोट मायने रखता है!</p>
</div>

</div>`,
    meta_title: "ओपिनियन पोल कैसे काम करता है? | पूरी प्रक्रिया और सटीकता",
    meta_description: "ओपिनियन पोल क्या है और कैसे काम करता है? सर्वे की विधि, सैंपलिंग, margin of error और सटीकता की पूरी जानकारी। ECI नियम और एग्जिट पोल से तुलना।",
    meta_keywords: "ओपिनियन पोल, सर्वे, election survey, margin of error, exit poll, sampling, चुनाव पूर्वानुमान",
    status: 'published',
    author_id: null
  }
];

async function insertBlogPosts() {
  try {
    console.log('Starting blog posts insertion...');
    
    for (const post of blogPosts) {
      // Check if post already exists
      const [existing] = await db.query(
        'SELECT id FROM Blog_Posts WHERE slug = ?',
        [post.slug]
      );
      
      if (existing.length > 0) {
        console.log(`Post with slug "${post.slug}" already exists. Skipping...`);
        continue;
      }
      
      // Insert the blog post
      const [result] = await db.query(
        `INSERT INTO Blog_Posts (
          title_hindi, title_english, slug, content_hindi, 
          excerpt_hindi, excerpt_english, category, tags,
          meta_title, meta_description, meta_keywords,
          status, author_id, published_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          post.title_hindi,
          post.title_english,
          post.slug,
          post.content_hindi,
          post.excerpt_hindi,
          post.excerpt_english,
          post.category,
          post.tags,
          post.meta_title,
          post.meta_description,
          post.meta_keywords,
          post.status,
          post.author_id
        ]
      );
      
      console.log(`✓ Inserted: ${post.title_hindi} (ID: ${result.insertId})`);
    }
    
    console.log('\n✓ All blog posts inserted successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error inserting blog posts:', error);
    process.exit(1);
  }
}

// Run the insertion
insertBlogPosts();
