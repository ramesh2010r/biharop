/*
 Import candidates from provided CSV files, match with official constituencies,
 and sync candidates per party so that database reflects CSV as source of truth.
*/
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// CSV sources from attachments
const CSV_FILES = [
  ['/Users/rameshkumar/Downloads/Candidate List - AAP (59) (1).csv', 'AAP'],
  ['/Users/rameshkumar/Downloads/Candidate List - CPI(ML) (18).csv', 'CPI(ML)'],
  ['/Users/rameshkumar/Downloads/Candidate List - JJD (22).csv', 'JJD'],
  ['/Users/rameshkumar/Downloads/Candidate List - INC (48).csv', 'INC'],
  ['/Users/rameshkumar/Downloads/Candidate List - RJD (37).csv', 'RJD'],
  ['/Users/rameshkumar/Downloads/Candidate List - Jan Suraj (116).csv', 'Jan Suraj'],
  ['/Users/rameshkumar/Downloads/Candidate List - HAM(S)(6).csv', 'HAM(S)'],
  ['/Users/rameshkumar/Downloads/Candidate List - RLM(6).csv', 'RLM'],
  ['/Users/rameshkumar/Downloads/Candidate List - LJP(29).csv', 'LJP'],
  ['/Users/rameshkumar/Downloads/Candidate List - JDU (101).csv', 'JDU'],
  ['/Users/rameshkumar/Downloads/Candidate List - BJP (101) (2).csv', 'BJP']
];

// Map display names to DB short_code
const PARTY_CODE = {
  'AAP': 'AAP',
  'CPI(ML)': 'CPIM',
  'JJD': 'JJD',
  'INC': 'INC',
  'RJD': 'RJD',
  'Jan Suraj': 'JAN_SURAJ',
  'HAM(S)': 'HAMS',
  'RLM': 'RLM',
  'LJP': 'LJPRV',
  'JDU': 'JDU',
  'BJP': 'BJP',
};

// Known constituency name corrections (CSV -> Official DB Hindi name)
const CORRECTIONS = new Map([
  ['वाल्मीकि नगर', 'वाल्मीकिनगर'],
  ['वाल्मीकीनगर', 'वाल्मीकिनगर'],
  ['बिहार शरीफ', 'बिहारशरीफ'],
  ['हरनाखी', 'हरलाखी'],
  ['गौरा बुरम', 'गौरा-बौराम'],
  ['गौरा बौराम', 'गौरा-बौराम'],
  ['सुर्याग्रह', 'सूर्यागढ़ा'],
  ['सूर्याग्रह', 'सूर्यागढ़ा'],
  ['सीवान', 'सिवान'],
  ['सीवान सदर', 'सिवान'],
  ['गोविंदगंज', 'गोविन्दगंज'],
  ['मोहिउद्दीननगर', 'मोहिउद्दीन नगर'],
  ['रोसड़ा', 'रोसड़ा'],
  ['रधुनाथपुर', 'रघुनाथपुर'],
  ['बाहादुरगंज', 'बहादुरगंज'],
  ['कहलगाव', 'कहलगांव'],
  ['मनहारी', 'मनिहारी'],
  ['फोरबिसगंज', 'फारबिसगंज'],
  ['बायसी', 'बैसी'],
  ['छेरियाबरियापुर', 'चेरिया बरियारपुर'],
]);

// Optional explicit overrides mapping (CSV cleaned -> official constituency name)
let OVERRIDES = {};
try {
  const mapPath = path.join(__dirname, 'mappings', 'constituency_overrides.json');
  if (fs.existsSync(mapPath)) {
    OVERRIDES = JSON.parse(fs.readFileSync(mapPath, 'utf8')) || {};
    console.log(`↷ Loaded ${Object.keys(OVERRIDES).length} constituency overrides`);
  }
} catch (e) {
  console.warn('⚠️  Failed to load constituency overrides mapping:', e.message);
}

function cleanConstituency(raw) {
  if (!raw) return '';
  let s = String(raw).trim();
  // Remove content in parentheses — both Hindi/English
  s = s.replace(/\([^)]*\)/g, '').trim();
  // Remove reservation markers like -SC, -ST, (SC), (ST), अ.जा., अजा
  s = s
    .replace(/-\s*SC/gi, '')
    .replace(/-\s*ST/gi, '')
    .replace(/\bSC\b/gi, '')
    .replace(/\bST\b/gi, '')
    .replace(/अ\.जा\.|अजा|अजजा|अ\.ज\.जा\./g, '')
    .replace(/सुरक्षित/g, '')
    .replace(/[\s\u200B\u200C\u200D]+/g, ' ')
    .trim();
  // Apply corrections map
  if (CORRECTIONS.has(s)) return CORRECTIONS.get(s);
  // Remove any stray parentheses/symbol cleanup
  s = s.replace(/[()]/g, ' ').replace(/\s+/g, ' ').trim();
  return s;
}

function normalizeKey(s) {
  return (s || '')
    .toLowerCase()
    .replace(/\([^)]*\)/g, '')
    .replace(/[-–—]/g, ' ')
    .replace(/[.,]/g, '')
    .replace(/[\s\u200B\u200C\u200D]+/g, ' ')
    .trim();
}

// Simplify Devanagari (remove nukta variants) and normalize fully
function simplifyDevanagari(s) {
  if (!s) return '';
  return s
    .replace(/क़/g, 'क')
    .replace(/ख़/g, 'ख')
    .replace(/ग़/g, 'ग')
    .replace(/ज़/g, 'ज')
    .replace(/फ़/g, 'फ')
    .replace(/ड़/g, 'ड')
    .replace(/ढ़/g, 'ढ')
    .replace(/़/g, '');
}

function normAll(s) {
  return normalizeKey(simplifyDevanagari(cleanConstituency(s)));
}

// Levenshtein distance for fuzzy matching
function levenshtein(a, b) {
  if (a === b) return 0;
  if (!a) return b.length;
  if (!b) return a.length;
  const v0 = new Array(b.length + 1);
  const v1 = new Array(b.length + 1);
  for (let i = 0; i < v0.length; i++) v0[i] = i;
  for (let i = 0; i < a.length; i++) {
    v1[0] = i + 1;
    for (let j = 0; j < b.length; j++) {
      const cost = a[i] === b[j] ? 0 : 1;
      v1[j + 1] = Math.min(v1[j] + 1, v0[j + 1] + 1, v0[j] + cost);
    }
    for (let j = 0; j < v0.length; j++) v0[j] = v1[j];
  }
  return v1[b.length];
}

// Robust CSV parser that handles quoted fields and newlines
function parseCSV(content) {
  const rows = [];
  let field = '';
  let row = [];
  let inQuotes = false;
  for (let i = 0; i < content.length; i++) {
    const ch = content[i];
    if (inQuotes) {
      if (ch === '"') {
        const next = content[i + 1];
        if (next === '"') { // escaped quote
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        row.push(field);
        field = '';
      } else if (ch === '\n' || ch === '\r') {
        // End of row
        // Handle CRLF by skipping the \n after \r
        if (ch === '\r' && content[i + 1] === '\n') i++;
        row.push(field);
        // push row if it has any non-empty field
        if (row.some(x => String(x).trim().length > 0)) rows.push(row);
        row = [];
        field = '';
      } else {
        field += ch;
      }
    }
  }
  // push last row
  row.push(field);
  if (row.some(x => String(x).trim().length > 0)) rows.push(row);
  return rows;
}

// Split candidate name into Hindi and English if present in parentheses with A-Z
function splitCandidateName(raw) {
  const full = String(raw || '').trim();
  const m = full.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  if (m) {
    const inner = m[2].trim();
    if (/^[A-Z .'-]+$/.test(inner)) {
      return { hindi: m[1].trim(), english: inner.replace(/\s+/g, ' ').trim() };
    }
  }
  return { hindi: full, english: '' };
}

async function main() {
  const syncMode = process.argv.includes('--sync');
  const dryRun = process.argv.includes('--dry');

  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'bihar_election_poll',
    multipleStatements: true,
  });

  // Load official constituencies
  const [allConst] = await conn.execute(
    'SELECT id, name_hindi, name_english FROM constituencies'
  );
  const constByKey = new Map();
  for (const c of allConst) {
    constByKey.set(normalizeKey(c.name_hindi), c);
    constByKey.set(normalizeKey(c.name_english), c);
    constByKey.set(normalizeKey(cleanConstituency(c.name_hindi)), c);
  }

  // Load parties
  const [parties] = await conn.execute(
    'SELECT id, name_hindi, name_english, short_code FROM parties'
  );
  const partyIdByCode = new Map(parties.map(p => [p.short_code, p.id]));

  const report = {
    startedAt: new Date().toISOString(),
    syncMode,
    perParty: {},
    unmatched: [],
    totals: { rows: 0, inserted: 0, updated: 0, skipped: 0 },
  };

  // Optional: begin sync by clearing party candidates first
  if (syncMode) {
    const partyCodes = CSV_FILES.map(([, name]) => PARTY_CODE[name]).filter(Boolean);
    const uniqueCodes = [...new Set(partyCodes)];
    for (const code of uniqueCodes) {
      const pid = partyIdByCode.get(code);
      if (!pid) continue;
      await conn.execute('DELETE FROM candidates WHERE party_id = ?', [pid]);
      console.log(`✓ Cleared existing candidates for party ${code}`);
    }
  }

  for (const [filePath, partyName] of CSV_FILES) {
    const code = PARTY_CODE[partyName];
    if (!code) { console.log(`⚠️  Unknown party mapping for ${partyName}`); continue; }
    const partyId = partyIdByCode.get(code);
    if (!partyId) { console.log(`⚠️  Party not found in DB: ${code}`); continue; }

    if (!fs.existsSync(filePath)) { console.log(`⚠️  Missing CSV: ${filePath}`); continue; }
  const raw = fs.readFileSync(filePath, 'utf8');
  const table = parseCSV(raw);
  if (table.length <= 1) { console.log(`⚠️  No rows in ${path.basename(filePath)}`); continue; }
  const header = table[0].map(h => String(h || '').trim());
  const rows = table.slice(1);

    let inserted = 0, updated = 0, skipped = 0;
  const partyReport = { file: path.basename(filePath), code, total: rows.length, inserted: 0, updated: 0, skipped: 0, unmatched: [], spellingIssues: [] };

    for (const cols of rows) {
      if (!cols || cols.length < 2) { skipped++; continue; }
      const constituencyRaw = String(cols[0] || '').trim();
      const candidateRaw = cols.slice(1).join(',').trim();
      if (!constituencyRaw || !candidateRaw) { skipped++; continue; }
      const { hindi: candidateHindi, english: candidateEnglish } = splitCandidateName(candidateRaw);

      let cleaned = cleanConstituency(constituencyRaw);
      let key = normalizeKey(cleaned);

      let match = constByKey.get(key);

      // Apply explicit override if present
      if (!match && OVERRIDES[cleaned]) {
        const desired = String(OVERRIDES[cleaned]).trim();
        const desiredKey = normalizeKey(desired);
        match = constByKey.get(desiredKey);
        // If not direct key, try a contains/prefix on desired
        if (!match) {
          const candidates = allConst.filter(c => normalizeKey(c.name_hindi) === desiredKey || normalizeKey(c.name_english) === desiredKey || normalizeKey(cleanConstituency(c.name_hindi)) === desiredKey);
          if (candidates.length === 1) match = candidates[0];
        }
        if (!match) {
          const candidates = allConst.filter(c => normalizeKey(c.name_hindi).includes(desiredKey) || normalizeKey(c.name_english).includes(desiredKey));
          if (candidates.length === 1) match = candidates[0];
        }
        // If override used, also adjust key to desiredKey for downstream comparisons
        if (match) key = desiredKey;
      }

      // Fallback: try prefix match
      if (!match) {
        const candidates = allConst.filter(c => normalizeKey(c.name_hindi).startsWith(key) || normalizeKey(c.name_english).startsWith(key) || normAll(c.name_hindi).startsWith(normAll(cleaned)));
        if (candidates.length === 1) match = candidates[0];
      }
      // Fallback: try contains
      if (!match && key.length >= 3) {
        const candidates = allConst.filter(c => normalizeKey(c.name_hindi).includes(key) || normalizeKey(c.name_english).includes(key) || normAll(c.name_hindi).includes(normAll(cleaned)));
        if (candidates.length === 1) match = candidates[0];
      }
      // Fallback: Levenshtein best match within small distance
      if (!match && key.length >= 3) {
        let best = null;
        let bestDist = Infinity;
        for (const c of allConst) {
          const d = levenshtein(cleaned, c.name_hindi);
          if (d < bestDist) { bestDist = d; best = c; }
        }
        const threshold = Math.max(1, Math.floor(Math.min(cleaned.length, (best?.name_hindi || '').length) * 0.2));
        if (best && bestDist <= threshold) match = best;
      }

      if (!match) {
        partyReport.unmatched.push({ constituencyRaw, cleaned, candidate: candidateRaw });
        report.unmatched.push({ party: code, constituencyRaw, cleaned, candidate: candidateRaw });
        skipped++;
        continue;
      }

      report.totals.rows++;

      if (dryRun) { inserted++; continue; }

      // Since we cleared by party in sync mode, just insert
      const englishVal = candidateEnglish && candidateEnglish.trim() ? candidateEnglish.trim() : null;
      await conn.execute(
        'INSERT INTO candidates (name_hindi, name_english, constituency_id, party_id) VALUES (?, ?, ?, ?)',
        [candidateHindi, englishVal, match.id, partyId]
      );
      inserted++;

      // Spelling QA heuristics: Hindi should not contain Latin letters; English should
      if (/[A-Za-z]/.test(candidateHindi)) {
        partyReport.spellingIssues.push({ type: 'latin-in-hindi', candidateHindi, candidateEnglish, constituency: match.name_hindi });
      }
      if (candidateEnglish && /[^A-Za-z .'-]/.test(candidateEnglish)) {
        partyReport.spellingIssues.push({ type: 'nonlatin-in-english', candidateHindi, candidateEnglish, constituency: match.name_hindi });
      }
    }

    partyReport.inserted = inserted;
    partyReport.updated = updated;
    partyReport.skipped = skipped;
    report.perParty[code] = partyReport;
    report.totals.inserted += inserted;
    report.totals.updated += updated;
    report.totals.skipped += skipped;

    console.log(`✓ ${partyName} (${code}) — rows: ${rows.length}, inserted: ${inserted}, skipped: ${skipped}, unmatched: ${partyReport.unmatched.length}`);
  }

  // Write report
  const outDir = path.join(__dirname, 'reports');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `import-report-${Date.now()}.json`);
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2), 'utf8');
  console.log(`\n📄 Report written to: ${outPath}`);

  // Also write unmatched as CSV for quick manual mapping
  const unmatchedCsv = [
    'party,constituency_raw,cleaned,candidate_name',
    ...report.unmatched.map(u => [u.party, u.constituencyRaw, u.cleaned, u.candidate || ''].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
  ].join('\n');
  const unmatchedPath = path.join(outDir, `unmatched-${Date.now()}.csv`);
  fs.writeFileSync(unmatchedPath, unmatchedCsv, 'utf8');
  console.log(`📝 Unmatched CSV written to: ${unmatchedPath}`);

  // Quick DB stats
  const [tot] = await conn.execute('SELECT COUNT(*) as c FROM candidates');
  console.log(`\n🎯 Total candidates now in DB: ${tot[0].c}`);

  await conn.end();
}

if (require.main === module) {
  main().catch(err => { console.error('❌ Import failed:', err); process.exit(1); });
}
