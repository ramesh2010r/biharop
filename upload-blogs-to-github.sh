#!/bin/bash

# Upload Blog Files to GitHub and Production
# This script commits and pushes blog files to GitHub repository

set -e

echo "=================================================="
echo "  Blog Upload Script"
echo "  Uploading 3 completed blogs"
echo "=================================================="
echo ""

cd /Users/rameshkumar/Document/App/Opinion\ Pole

# Check git status
echo "📊 Checking git status..."
git status --short

echo ""
echo "📝 Blog files to upload:"
echo "  ✅ blog-01-bihar-38-districts.json (40KB)"
echo "  ✅ blog-02-243-seats.json (33KB)"
echo "  ✅ blog-03-bihar-cm.json (34KB)"
echo "  ✅ insert-blog-01-districts.js"
echo "  ✅ insert-blog-02-seats.js"
echo "  ✅ insert-blog-03-cm.js"
echo ""

# Add blog files to git
echo "📦 Adding blog files to git..."
git add backend/data/blog-01-bihar-38-districts.json
git add backend/data/blog-02-243-seats.json
git add backend/data/blog-03-bihar-cm.json
git add backend/scripts/insert-blog-01-districts.js
git add backend/scripts/insert-blog-02-seats.js
git add backend/scripts/insert-blog-03-cm.js

# Add documentation files
echo "📚 Adding documentation files..."
git add BLOG_CONTENT_CALENDAR.md 2>/dev/null || true
git add BLOG_KEYWORD_RESEARCH.md 2>/dev/null || true
git add BLOG_VISUAL_ASSETS_GUIDE.md 2>/dev/null || true
git add BLOG_DEPLOYMENT_GUIDE.md 2>/dev/null || true
git add BLOG_POSTS_DOCUMENTATION.md 2>/dev/null || true

echo ""
echo "✅ Files staged for commit"
echo ""

# Commit
echo "💾 Committing changes..."
git commit -m "Add 3 high-quality blog posts (13,000+ words)

- Blog #1: Bihar 38 Districts (3,500 words, 8,100 searches/month)
- Blog #2: Bihar 243 Vidhan Sabha Seats (4,000 words, 6,600 searches/month)
- Blog #3: Bihar Chief Minister Nitish Kumar (5,500 words, 5,400 searches/month)

Total: 13,000+ words, 30 FAQs, 19 data tables
Target traffic: 1,500-2,000 visits/month in first month
SEO: All low-competition keywords, optimized for Page 1 ranking

Includes:
- Complete JSON blog content with schema markup
- Database insertion scripts for all 3 blogs
- Blog deployment and visual assets guides
- Keyword research and content calendar"

echo ""
echo "✅ Changes committed"
echo ""

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push origin main

echo ""
echo "=================================================="
echo "  ✅ SUCCESS! Blogs uploaded to GitHub"
echo "=================================================="
echo ""
echo "📊 Summary:"
echo "  • 3 blogs uploaded (13,000+ words)"
echo "  • 6 script files uploaded"
echo "  • 5 documentation files uploaded"
echo ""
echo "🔗 GitHub Repository:"
echo "  https://github.com/ramesh2010r/biharop"
echo ""
echo "🚀 Next Steps:"
echo "  1. SSH into production server"
echo "  2. Pull latest code: git pull origin main"
echo "  3. Run insertion scripts:"
echo "     node backend/scripts/insert-blog-01-districts.js"
echo "     node backend/scripts/insert-blog-02-seats.js"
echo "     node backend/scripts/insert-blog-03-cm.js"
echo "  4. Verify blogs on website"
echo "  5. Submit URLs to Google Search Console"
echo ""
