const fs = require('fs');
const path = require('path');

const csvFiles = [
    '/Users/rameshkumar/Downloads/Candidate List - AAP (59) (1).csv',
    '/Users/rameshkumar/Downloads/Candidate List - CPI(ML) (18).csv',
    '/Users/rameshkumar/Downloads/Candidate List - JJD (22).csv',
    '/Users/rameshkumar/Downloads/Candidate List - INC (48).csv',
    '/Users/rameshkumar/Downloads/Candidate List - RJD (37).csv',
    '/Users/rameshkumar/Downloads/Candidate List - Jan Suraj (116).csv',
    '/Users/rameshkumar/Downloads/Candidate List - HAM(S)(6).csv',
    '/Users/rameshkumar/Downloads/Candidate List - RLM(6).csv',
    '/Users/rameshkumar/Downloads/Candidate List - LJP(29).csv',
    '/Users/rameshkumar/Downloads/Candidate List - JDU (101).csv',
    '/Users/rameshkumar/Downloads/Candidate List - BJP (101) (2).csv'
];

let totalCandidates = 0;
const allCandidates = new Map();
const duplicates = [];
const partyCounts = {};

csvFiles.forEach(file => {
    if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        const lines = content.split('\n').filter(line => line.trim());
        const partyName = path.basename(file).split(' - ')[1].split(' (')[0];
        const count = lines.length - 1; // Subtract header

        partyCounts[partyName] = count;
        console.log(`${partyName}: ${count} candidates`);

        lines.slice(1).forEach((line, index) => {
            const parts = line.split(',');
            if (parts.length >= 2) {
                const constituency = parts[0].trim();
                const candidate = parts.slice(1).join(',').trim(); // Handle names with commas
                const key = `${partyName}|${constituency}|${candidate}`;

                if (allCandidates.has(key)) {
                    duplicates.push(`DUPLICATE: ${partyName} - ${constituency} - ${candidate}`);
                } else {
                    allCandidates.set(key, true);
                }
            }
        });

        totalCandidates += count;
    } else {
        console.log(`File not found: ${file}`);
    }
});

console.log(`\nTotal candidates across all files: ${totalCandidates}`);
console.log(`Unique candidate entries: ${allCandidates.size}`);

if (duplicates.length > 0) {
    console.log(`\nDUPLICATES FOUND (${duplicates.length}):`);
    duplicates.slice(0, 10).forEach(dup => console.log(dup));
    if (duplicates.length > 10) {
        console.log(`... and ${duplicates.length - 10} more`);
    }
} else {
    console.log(`\nNo duplicates found.`);
}

console.log('\nParty breakdown:');
Object.entries(partyCounts).sort((a, b) => b[1] - a[1]).forEach(([party, count]) => {
    console.log(`${party}: ${count}`);
});