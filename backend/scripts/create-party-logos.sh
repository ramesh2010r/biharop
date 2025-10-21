#!/bin/bash

# Create party logo SVG files

LOGO_DIR="/Users/rameshkumar/Document/App/Opinion Pole/public/images/party-logos"

# BJP Lotus
cat > "$LOGO_DIR/bjp-lotus.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="48" fill="#FF9933"/>
  <g fill="#fff">
    <ellipse cx="50" cy="55" rx="12" ry="20"/>
    <ellipse cx="35" cy="48" rx="8" ry="16" transform="rotate(-30 35 48)"/>
    <ellipse cx="65" cy="48" rx="8" ry="16" transform="rotate(30 65 48)"/>
    <ellipse cx="30" cy="60" rx="6" ry="12" transform="rotate(-60 30 60)"/>
    <ellipse cx="70" cy="60" rx="6" ry="12" transform="rotate(60 70 60)"/>
    <circle cx="50" cy="35" r="8"/>
  </g>
</svg>
EOF

# RJD Lamp
cat > "$LOGO_DIR/rjd-lamp.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="48" fill="#006400"/>
  <g fill="#FFD700" stroke="#333" stroke-width="1.5">
    <rect x="40" y="30" width="20" height="25" rx="2"/>
    <rect x="35" y="55" width="30" height="3"/>
    <rect x="43" y="58" width="14" height="20" rx="1"/>
    <circle cx="50" cy="38" r="3" fill="#FFA500"/>
  </g>
</svg>
EOF

# JDU Arrow
cat > "$LOGO_DIR/jdu-arrow.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="48" fill="#006400"/>
  <g fill="#fff">
    <polygon points="30,50 60,50 60,35 80,50 60,65 60,50"/>
    <rect x="30" y="45" width="35" height="10"/>
  </g>
</svg>
EOF

# INC Hand
cat > "$LOGO_DIR/inc-hand.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="48" fill="#19AAED"/>
  <g fill="#fff">
    <rect x="35" y="50" width="8" height="25" rx="2"/>
    <rect x="43" y="45" width="8" height="30" rx="2"/>
    <rect x="51" y="40" width="8" height="35" rx="2"/>
    <rect x="59" y="45" width="8" height="30" rx="2"/>
    <ellipse cx="51" cy="40" rx="16" ry="8"/>
  </g>
</svg>
EOF

# CPIM Flag
cat > "$LOGO_DIR/cpim-flag.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="48" fill="#DC143C"/>
  <g fill="#FFD700" stroke="#333" stroke-width="0.5">
    <rect x="42" y="35" width="3" height="15" transform="rotate(45 43.5 42.5)"/>
    <path d="M 48,38 Q 53,35 58,38 L 56,42 Q 53,40 50,42 Z"/>
    <polygon points="60,35 65,40 60,45 55,42 55,38"/>
    <polygon points="50,25 52,30 57,30 53,33 55,38 50,35 45,38 47,33 43,30 48,30" fill="#FFD700"/>
  </g>
</svg>
EOF

echo "✅ All party logos created successfully!"
ls -lh "$LOGO_DIR"/*.svg
