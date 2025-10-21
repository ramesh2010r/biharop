const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// CSV files to process
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

// Party mapping from filename to database party code
const PARTY_MAPPING = {
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
    'BJP': 'BJP'
};

async function importFromCSVs() {
    let connection;

    try {
        // Connect to database
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'bihar_election_poll'
        });

        console.log('🔗 Connected to database');

        let totalImported = 0;
        const partyStats = {};
        const duplicates = [];

        for (const csvFile of csvFiles) {
            if (!fs.existsSync(csvFile)) {
                console.log(`⚠️  File not found: ${csvFile}`);
                continue;
            }

            const filename = path.basename(csvFile);
            const partyName = filename.split(' - ')[1].split(' (')[0];
            const partyCode = PARTY_MAPPING[partyName];

            if (!partyCode) {
                console.log(`⚠️  Unknown party: ${partyName} in ${filename}`);
                continue;
            }

            console.log(`\n📄 Processing ${filename} (${partyName} -> ${partyCode})`);

            // Check if party exists
            const [parties] = await connection.execute(
                'SELECT id FROM parties WHERE short_code = ?',
                [partyCode]
            );

            if (parties.length === 0) {
                console.log(`⚠️  Party ${partyCode} not found in database, skipping`);
                continue;
            }

            const partyId = parties[0].id;

            // Read and parse CSV
            const content = fs.readFileSync(csvFile, 'utf8');
            const lines = content.split('\n').filter(line => line.trim());

            if (lines.length < 2) {
                console.log(`⚠️  No data in ${filename}`);
                continue;
            }

            let imported = 0;
            const seen = new Set();

            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;

                const parts = line.split(',');
                if (parts.length < 2) continue;

                // Extract constituency name (remove district in parentheses)
                const fullConstituency = parts[0].trim();
                const constituencyName = fullConstituency.split(' (')[0].trim(); // Remove (district) part
                const candidateName = parts.slice(1).join(',').trim();

                // Skip duplicates within this file
                const key = `${partyCode}|${constituencyName}|${candidateName}`;
                if (seen.has(key)) {
                    duplicates.push(`${partyName}: ${constituencyName} - ${candidateName}`);
                    continue;
                }
                seen.add(key);

                // Find constituency
                const [constituencies] = await connection.execute(
                    'SELECT id FROM constituencies WHERE name_hindi = ? OR name_english = ? OR name_hindi LIKE ?',
                    [constituencyName, constituencyName, `${constituencyName}%`]
                );

                if (constituencies.length === 0) {
                    console.log(`⚠️  Constituency not found: ${constituencyName} (from: ${fullConstituency})`);
                    continue;
                }

                const constituencyId = constituencies[0].id;

                // Check if candidate already exists
                const [existing] = await connection.execute(
                    'SELECT id FROM candidates WHERE constituency_id = ? AND party_id = ? AND name_hindi = ?',
                    [constituencyId, partyId, candidateName]
                );

                if (existing.length > 0) {
                    console.log(`⚠️  Candidate already exists: ${candidateName} (${partyName})`);
                    continue;
                }

                // Insert candidate
                await connection.execute(
                    'INSERT INTO candidates (name_hindi, name_english, constituency_id, party_id) VALUES (?, ?, ?, ?)',
                    [candidateName, '', constituencyId, partyId]
                );

                imported++;
                totalImported++;
            }

            partyStats[partyName] = (partyStats[partyName] || 0) + imported;
            console.log(`✓ Imported ${imported} candidates from ${partyName}`);
        }

        console.log(`\n🎉 Import completed!`);
        console.log(`✓ Total candidates imported: ${totalImported}`);

        console.log('\n📊 Candidates by party:');
        Object.entries(partyStats).sort((a, b) => b[1] - a[1]).forEach(([party, count]) => {
            console.log(`${party}: ${count}`);
        });

        if (duplicates.length > 0) {
            console.log(`\n⚠️  Duplicates found (${duplicates.length}):`);
            duplicates.slice(0, 5).forEach(dup => console.log(`  ${dup}`));
            if (duplicates.length > 5) {
                console.log(`  ... and ${duplicates.length - 5} more`);
            }
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

importFromCSVs();