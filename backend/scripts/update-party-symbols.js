const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function updatePartySymbols() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log('✓ Connected to MySQL database');

    // Update party symbols with local file paths
    const partyUpdates = [
      {
        code: 'BJP',
        symbol: '/images/party-logos/bjp-lotus.svg',
        name: 'Bharatiya Janata Party - Lotus'
      },
      {
        code: 'RJD',
        symbol: '/images/party-logos/rjd-lamp.svg',
        name: 'Rashtriya Janata Dal - Hurricane Lamp'
      },
      {
        code: 'JDU',
        symbol: '/images/party-logos/jdu-arrow.svg',
        name: 'Janata Dal (United) - Arrow'
      },
      {
        code: 'INC',
        symbol: '/images/party-logos/inc-hand.svg',
        name: 'Indian National Congress - Hand'
      },
      {
        code: 'CPIM',
        symbol: '/images/party-logos/cpim-flag.svg',
        name: 'CPI(M) - Hammer, Sickle and Star'
      },
      {
        code: 'LJPRV',
        symbol: '/images/party-logos/ljp-bungalow.png',
        name: 'Lok Janshakti Party - Bungalow'
      },
      {
        code: 'IND',
        symbol: null, // Will show 'IND' text
        name: 'Independent'
      }
    ];

    console.log('\n🎨 Updating party symbols...\n');

    for (const party of partyUpdates) {
      await connection.query(
        'UPDATE Parties SET symbol_url = ? WHERE short_code = ?',
        [party.symbol, party.code]
      );
      console.log(`✓ Updated ${party.code.padEnd(6)} - ${party.name}`);
      if (party.symbol) {
        console.log(`  Symbol: ${party.symbol.substring(0, 70)}...`);
      }
    }

    console.log('\n✅ Party symbols updated successfully!');
    console.log('\n📝 Summary:');
    console.log('   - All 6 major parties now have LOCAL SVG/PNG logos');
    console.log('   - Logos stored in: public/images/party-logos/');
    console.log('   - Faster loading (no external requests)');
    console.log('   - Independent candidates will show "IND" text badge\n');

  } catch (error) {
    console.error('❌ Error updating party symbols:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

updatePartySymbols()
  .then(() => {
    console.log('✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
