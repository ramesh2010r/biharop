#!/bin/bash
# SEO Verification Script for opinionpoll.co.in

echo "🔍 SEO VERIFICATION SCRIPT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check robots.txt
echo "1️⃣  ROBOTS.TXT CHECK"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -s https://opinionpoll.co.in/robots.txt
echo ""
echo ""

# Check canonical tags on all pages
echo "2️⃣  CANONICAL TAGS CHECK"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

PAGES=(
  "https://opinionpoll.co.in"
  "https://opinionpoll.co.in/vote"
  "https://opinionpoll.co.in/results"
  "https://opinionpoll.co.in/about"
  "https://opinionpoll.co.in/contact"
  "https://opinionpoll.co.in/privacy-policy"
  "https://opinionpoll.co.in/terms-of-service"
)

for page in "${PAGES[@]}"; do
  echo "Checking: $page"
  canonical=$(curl -s "$page" | grep -o '<link rel="canonical" href="[^"]*"' | head -1)
  if [ -n "$canonical" ]; then
    echo "✅ Found: $canonical"
  else
    echo "❌ NOT FOUND"
  fi
  echo ""
done

echo ""
echo "3️⃣  ROBOTS META TAGS (Admin Pages)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Checking: https://opinionpoll.co.in/admin"
admin_robots=$(curl -s https://opinionpoll.co.in/admin | grep -o '<meta name="robots" content="[^"]*"' | head -1)
if [ -n "$admin_robots" ]; then
  echo "✅ Found: $admin_robots"
else
  echo "⚠️  NOT FOUND (check after deployment)"
fi
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Verification Complete!"
echo ""
echo "Next Steps:"
echo "1. Build and deploy: npm run build"
echo "2. Deploy .next folder to both servers"
echo "3. Deploy public/robots.txt to both servers"
echo "4. Restart PM2 frontend on both servers"
echo "5. Run this script again to verify live site"
echo "6. Submit to Google Search Console for re-indexing"
