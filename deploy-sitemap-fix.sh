#!/bin/bash

echo "🚀 Deploying Sitemap Fix to Production"
echo "========================================"
echo ""

# Since the sitemap.ts fetches from API dynamically but is cached at build time,
# and the backend API is not on Server 3, we need a different approach.

echo "📋 Creating manual sitemap with blog URLs..."
echo ""

# SSH into Server 3 and create a complete sitemap
ssh -i ~/Downloads/key2.pem ec2-user@65.2.142.131 << 'ENDSSH'
cd ~/opinion-poll

echo "Fetching blog posts from API..."
BLOG_POSTS=$(curl -s http://localhost:5001/api/blog?limit=100)

echo "Generating sitemap.xml with blog URLs..."

cat > public/sitemap-manual.xml << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url>
<loc>https://opinionpoll.co.in</loc>
<lastmod>$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")</lastmod>
<changefreq>daily</changefreq>
<priority>1</priority>
</url>
<url>
<loc>https://opinionpoll.co.in/vote</loc>
<lastmod>$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")</lastmod>
<changefreq>daily</changefreq>
<priority>0.9</priority>
</url>
<url>
<loc>https://opinionpoll.co.in/results</loc>
<lastmod>$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")</lastmod>
<changefreq>hourly</changefreq>
<priority>0.9</priority>
</url>
<url>
<loc>https://opinionpoll.co.in/blog</loc>
<lastmod>$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")</lastmod>
<changefreq>daily</changefreq>
<priority>0.8</priority>
</url>
<url>
<loc>https://opinionpoll.co.in/confirmation</loc>
<lastmod>$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")</lastmod>
<changefreq>weekly</changefreq>
<priority>0.5</priority>
</url>
<url>
<loc>https://opinionpoll.co.in/disclaimer</loc>
<lastmod>$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")</lastmod>
<changefreq>monthly</changefreq>
<priority>0.3</priority>
</url>
<url>
<loc>https://opinionpoll.co.in/about</loc>
<lastmod>$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")</lastmod>
<changefreq>monthly</changefreq>
<priority>0.7</priority>
</url>
<url>
<loc>https://opinionpoll.co.in/privacy-policy</loc>
<lastmod>$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")</lastmod>
<changefreq>monthly</changefreq>
<priority>0.6</priority>
</url>
<url>
<loc>https://opinionpoll.co.in/terms-of-service</loc>
<lastmod>$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")</lastmod>
<changefreq>monthly</changefreq>
<priority>0.6</priority>
</url>
<url>
<loc>https://opinionpoll.co.in/contact</loc>
<lastmod>$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")</lastmod>
<changefreq>monthly</changefreq>
<priority>0.7</priority>
</url>
<!-- Blog Posts -->
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

echo "✅ Manual sitemap created: public/sitemap-manual.xml"
echo ""
echo "📋 Sitemap contains:"
grep -c '<url>' public/sitemap-manual.xml
echo "URLs total"
echo ""
grep '<loc>' public/sitemap-manual.xml | grep blog | wc -l
echo "Blog URLs"
echo ""

# Copy to .next/static for Next.js to serve
echo "Copying to Next.js public folder..."
cp public/sitemap-manual.xml public/sitemap.xml

echo "✅ Deployment complete!"
echo ""
echo "Verify with:"
echo "curl https://opinionpoll.co.in/sitemap.xml | grep -c blog"
ENDSSH

echo ""
echo "========================================"
echo "✅ Sitemap deployed successfully!"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Wait 2-3 minutes for Cloudflare cache to clear"
echo "2. Verify: curl https://opinionpoll.co.in/sitemap.xml | grep blog"
echo "3. Submit to Google Search Console"
echo "4. Request indexing for all blog URLs"
echo ""
