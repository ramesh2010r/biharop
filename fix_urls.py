#!/usr/bin/env python3
import re

# Read the file
with open('src/components/admin/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# Pattern 1: fetch('http://localhost:5001/api/...'
content = re.sub(r"fetch\(getApiUrl\('(/api/[^']+)',\s*\{", r"fetch(getApiUrl('\1'), {", content)

# Pattern 2: fetch(`http://localhost:5001/api/...`
content = re.sub(r"fetch\(getApiUrl\(`(/api/[^`]+)`,\s*\{", r"fetch(getApiUrl(`\1`), {", content)

# Pattern 3: Just fetch(getApiUrl('/api/...', {  -> fetch(getApiUrl('/api/...'), {
content = re.sub(r"fetch\(getApiUrl\('(/api/[^']+)',", r"fetch(getApiUrl('\1'),", content)
content = re.sub(r"fetch\(getApiUrl\(`(/api/[^`]+)`,", r"fetch(getApiUrl(`\1`),", content)

# Write back
with open('src/components/admin/AdminDashboard.tsx', 'w') as f:
    f.write(content)

print("Fixed AdminDashboard.tsx")
