const db = require('./config/database');

async function checkParties() {
  try {
    const [parties] = await db.query('SELECT party_id, abbreviation, name_hindi, symbol_url FROM parties ORDER BY party_id LIMIT 50');
    
    console.log('\n📋 PARTIES TABLE DATA:\n');
    console.log('Total parties:', parties.length);
    console.log('\nParty Details:');
    console.table(parties.map(p => ({
      ID: p.party_id,
      Abbreviation: p.abbreviation,
      Name: p.name_hindi?.substring(0, 30),
      Symbol: p.symbol_url || 'NULL'
    })));
    
    const withSymbols = parties.filter(p => p.symbol_url).length;
    const withoutSymbols = parties.filter(p => !p.symbol_url).length;
    
    console.log(`\n✅ With symbols: ${withSymbols}`);
    console.log(`❌ Without symbols: ${withoutSymbols}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkParties();
