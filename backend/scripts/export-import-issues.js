const fs = require('fs');
const path = require('path');

function latestReport(dir) {
  const files = fs.readdirSync(dir).filter(f => f.startsWith('import-report-') && f.endsWith('.json')).sort();
  if (files.length === 0) return null;
  return path.join(dir, files[files.length - 1]);
}

function toCSV(rows) {
  const esc = v => '"' + String(v ?? '').replace(/"/g, '""') + '"';
  if (rows.length === 0) return '';
  const headers = Object.keys(rows[0]);
  const lines = [headers.map(esc).join(',')];
  for (const r of rows) lines.push(headers.map(h => esc(r[h])).join(','));
  return lines.join('\n');
}

function main() {
  const reportsDir = path.join(__dirname, 'reports');
  const reportPath = latestReport(reportsDir);
  if (!reportPath) {
    console.error('No report found in', reportsDir);
    process.exit(1);
  }
  const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  const per = report.perParty || {};

  // Aggregate spelling issues
  const spelling = [];
  for (const code of Object.keys(per)) {
    const v = per[code];
    (v.spellingIssues || []).forEach(it => {
      spelling.push({
        party: code,
        type: it.type,
        constituency: it.constituency,
        candidate_hindi: it.candidateHindi,
        candidate_english: it.candidateEnglish,
      });
    });
  }

  // Unmatched entries
  const unmatched = (report.unmatched || []).map(u => ({
    party: u.party,
    csv_constituency: u.constituencyRaw,
    cleaned: u.cleaned,
    candidate: u.candidate,
  }));

  const spellCSV = toCSV(spelling);
  const unmatchedCSV = toCSV(unmatched);

  const outSpell = path.join(reportsDir, 'spelling_issues.csv');
  const outUnmatched = path.join(reportsDir, 'unmatched.csv');
  fs.writeFileSync(outSpell, spellCSV, 'utf8');
  fs.writeFileSync(outUnmatched, unmatchedCSV, 'utf8');
  console.log('Wrote:', outSpell);
  console.log('Wrote:', outUnmatched);
  console.log('Spelling issues:', spelling.length, 'Unmatched:', unmatched.length);
}

if (require.main === module) {
  main();
}
