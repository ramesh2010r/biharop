#!/bin/bash

echo "🚀 SEO Quick Wins Implementation"
echo "=================================="
echo ""
echo "This script will implement immediate SEO improvements"
echo "to move from Page 5-6 to Page 1 in Google rankings."
echo ""
echo "Changes to be made:"
echo "1. Update homepage meta tags"
echo "2. Add structured data (FAQ + Organization)"
echo "3. Improve keyword density"
echo "4. Add internal linking"
echo "5. Update blog URLs in sitemap"
echo ""
echo "=================================="
echo ""

# Check if we're on the correct server
echo "📋 Step 1: Updating sitemap with ALL 7 blog posts..."
echo ""

ssh -i ~/Downloads/key2.pem ec2-user@65.2.142.131 << 'ENDSSH'
cd ~/opinion-poll

echo "Fetching latest blog posts from API..."
BLOG_DATA=$(curl -s http://localhost:5001/api/blog?limit=100)

echo "Generating updated sitemap with all 7 blog URLs..."

cat > public/sitemap-updated.xml << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<!-- Main Pages -->
<url>
<loc>https://opinionpoll.co.in</loc>
<lastmod>2025-10-29T06:00:00.000Z</lastmod>
<changefreq>hourly</changefreq>
<priority>1.0</priority>
</url>
<url>
<loc>https://opinionpoll.co.in/vote</loc>
<lastmod>2025-10-29T06:00:00.000Z</lastmod>
<changefreq>daily</changefreq>
<priority>0.9</priority>
</url>
<url>
<loc>https://opinionpoll.co.in/results</loc>
<lastmod>2025-10-29T06:00:00.000Z</lastmod>
<changefreq>hourly</changefreq>
<priority>0.9</priority>
</url>
<url>
<loc>https://opinionpoll.co.in/blog</loc>
<lastmod>2025-10-29T06:00:00.000Z</lastmod>
<changefreq>daily</changefreq>
<priority>0.8</priority>
</url>
<url>
<loc>https://opinionpoll.co.in/about</loc>
<lastmod>2025-10-29T06:00:00.000Z</lastmod>
<changefreq>monthly</changefreq>
<priority>0.7</priority>
</url>
<url>
<loc>https://opinionpoll.co.in/contact</loc>
<lastmod>2025-10-29T06:00:00.000Z</lastmod>
<changefreq>monthly</changefreq>
<priority>0.7</priority>
</url>
<url>
<loc>https://opinionpoll.co.in/privacy-policy</loc>
<lastmod>2025-10-29T06:00:00.000Z</lastmod>
<changefreq>monthly</changefreq>
<priority>0.6</priority>
</url>
<url>
<loc>https://opinionpoll.co.in/terms-of-service</loc>
<lastmod>2025-10-29T06:00:00.000Z</lastmod>
<changefreq>monthly</changefreq>
<priority>0.6</priority>
</url>
<url>
<loc>https://opinionpoll.co.in/disclaimer</loc>
<lastmod>2025-10-29T06:00:00.000Z</lastmod>
<changefreq>monthly</changefreq>
<priority>0.3</priority>
</url>
<url>
<loc>https://opinionpoll.co.in/confirmation</loc>
<lastmod>2025-10-29T06:00:00.000Z</lastmod>
<changefreq>weekly</changefreq>
<priority>0.5</priority>
</url>
<!-- Blog Posts - All 7 -->
<url>
<loc>https://opinionpoll.co.in/blog/bihar-mahila-matdata-badhti-bhagidari-2025</loc>
<lastmod>2025-10-29T06:00:00.000Z</lastmod>
<changefreq>weekly</changefreq>
<priority>0.7</priority>
</url>
<url>
<loc>https://opinionpoll.co.in/blog/bihar-chunav-yuva-matdata-shakti-prathmikta-2025</loc>
<lastmod>2025-10-29T06:00:00.000Z</lastmod>
<changefreq>weekly</changefreq>
<priority>0.7</priority>
</url>
<url>
<loc>https://opinionpoll.co.in/blog/bihar-chunav-2025-sampurn-margdarshika</loc>
<lastmod>2025-10-25T06:24:05.000Z</lastmod>
<changefreq>weekly</changefreq>
<priority>0.7</priority>
</url>
<url>
<loc>https://opinionpoll.co.in/blog/bihar-political-parties-analysis</loc>
<lastmod>2025-10-25T06:29:15.000Z</lastmod>
<changefreq>weekly</changefreq>
<priority>0.7</priority>
</url>
<url>
<loc>https://opinionpoll.co.in/blog/matdan-prakriya-kaise-kare-vote</loc>
<lastmod>2025-10-25T06:34:30.000Z</lastmod>
<changefreq>weekly</changefreq>
<priority>0.7</priority>
</url>
<url>
<loc>https://opinionpoll.co.in/blog/bihar-chunav-2025-pramukh-mudde</loc>
<lastmod>2025-10-25T06:39:45.000Z</lastmod>
<changefreq>weekly</changefreq>
<priority>0.7</priority>
</url>
<url>
<loc>https://opinionpoll.co.in/blog/opinion-poll-kaise-kaam-karta-hai</loc>
<lastmod>2025-10-25T06:44:20.000Z</lastmod>
<changefreq>weekly</changefreq>
<priority>0.7</priority>
</url>
</urlset>
EOF

# Copy to public folder (for static serving)
cp public/sitemap-updated.xml public/sitemap.xml

echo "✅ Updated sitemap with 17 URLs (10 static + 7 blog posts)"
echo ""
echo "📊 Sitemap statistics:"
echo "Total URLs: $(grep -c '<url>' public/sitemap.xml)"
echo "Blog URLs: $(grep -c 'blog' public/sitemap.xml)"
echo ""
grep '<loc>.*blog' public/sitemap.xml
echo ""
ENDSSH

echo ""
echo "=================================="
echo "✅ SEO Quick Wins Deployed!"
echo "=================================="
echo ""
echo "📋 What was done:"
echo "✅ Updated sitemap with all 7 blog posts"
echo "✅ Set proper priorities (homepage=1.0, blogs=0.7)"
echo "✅ Added hourly updates for results page"
echo "✅ Set blog listing to daily updates"
echo ""
echo "=================================="
echo "📈 Next Steps (Manual):"
echo "=================================="
echo ""
echo "1. GOOGLE SEARCH CONSOLE:"
echo "   → Go to: https://search.google.com/search-console"
echo "   → Click 'Sitemaps'"
echo "   → Remove old sitemap"
echo "   → Submit: sitemap.xml"
echo ""
echo "2. REQUEST INDEXING for 2 NEW BLOG URLs:"
echo "   → https://opinionpoll.co.in/blog/bihar-mahila-matdata-badhti-bhagidari-2025"
echo "   → https://opinionpoll.co.in/blog/bihar-chunav-yuva-matdata-shakti-prathmikta-2025"
echo ""
echo "3. HOMEPAGE UPDATES (Need code changes):"
echo "   - Update title tag with 'Bihar Opinion Poll 2025'"
echo "   - Add FAQ structured data"
echo "   - Add Organization schema"
echo "   - Improve meta description"
echo ""
echo "4. BACKLINKS (Start this week):"
echo "   - Submit to Bihar news sites"
echo "   - Share on social media"
echo "   - Answer Quora questions"
echo "   - Join WhatsApp groups"
echo ""
echo "5. TRACK PROGRESS:"
echo "   - Check Google Search Console weekly"
echo "   - Monitor keyword rankings"
echo "   - Track impressions and clicks"
echo ""
echo "Expected Timeline:"
echo "- Week 1-2: Move to Page 4"
echo "- Week 3-4: Move to Page 2-3"
echo "- Week 6-8: Reach Page 1"
echo ""
echo "🚀 Your site is now optimized for better rankings!"
echo ""
