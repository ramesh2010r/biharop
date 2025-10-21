# Real Candidate Data Import Guide

## 📋 Current Status
✅ **Backup Created**: Current dummy data backed up to `candidates-backup-2025-10-20.json`
✅ **Test Import**: Successfully imported 6 sample candidates (वैशाली और महुआ constituencies)
✅ **Database Ready**: All required parties added, schema validated

## 🎯 Next Steps to Complete Import

### Option 1: Using Google Sheets CSV Export (Recommended)

1. **Export your Google Sheets data:**
   - Open: https://docs.google.com/spreadsheets/d/1_Oh5UcBSfgOzJ28HTL0m5ETMnZLKULakwajibkzHjf8/edit
   - Go to `File` → `Download` → `Comma-separated values (.csv)`
   - Save as `bihar-candidates.csv`

2. **Convert CSV to JavaScript:**
   ```bash
   cd backend/scripts
   node csv-to-candidates.js bihar-candidates.csv
   ```

3. **Review and import:**
   - Check the generated `bihar-candidates-candidates.js` file
   - Copy the data array to `import-real-candidates.js`
   - Run: `node import-real-candidates.js`

### Option 2: Manual Data Entry

Edit the `REAL_CANDIDATES_DATA` array in `backend/scripts/import-real-candidates.js`:

```javascript
const REAL_CANDIDATES_DATA = [
  {
    constituency_name: "पटना साहिब",
    seat_no: 1,
    candidates: [
      {
        name_hindi: "उम्मीदवार का नाम",
        name_english: "Candidate Name",
        party_code: "BJP" // Must match existing party codes
      }
      // Add more candidates...
    ]
  }
  // Add more constituencies...
];
```

## 🏛️ Available Party Codes

```
BJP    - भारतीय जनता पार्टी
RJD    - राष्ट्रीय जनता दल  
JDU    - जनता दल (यूनाइटेड)
INC    - भारतीय राष्ट्रीय कांग्रेस
CPIM   - कम्युनिस्ट पार्टी ऑफ इंडिया (मार्क्सवादी)
LJPRV  - लोक जनशक्ति पार्टी (राम विलास)
VIP    - विकासशील इंसान पार्टी
AAP    - आम आदमी पार्टी
BSP    - बहुजन समाज पार्टी
AIMIM  - अल इंडिया मजलिस-ए-इत्तेहादुल मुस्लिमीन
HAMS   - हिन्दुस्तानी अवाम मोर्चा (सेकुलर)
IND    - निर्दलीय
```

## 🔧 Scripts Available

| Script | Purpose |
|--------|---------|
| `backup-current-data.js` | ✅ Backup existing data (DONE) |
| `csv-to-candidates.js` | Convert CSV to JavaScript format |
| `import-real-candidates.js` | Import real candidate data |

## 📊 Expected CSV Format

Your Google Sheets should have columns like:
- **Constituency** (Hindi): विधानसभा क्षेत्र
- **Seat Number**: सीट संख्या  
- **Candidate Name (Hindi)**: उम्मीदवार नाम
- **Candidate Name (English)**: English Name (optional)
- **Party**: पार्टी कोड (BJP, RJD, etc.)

## 🚀 Quick Import Commands

```bash
# Go to scripts directory
cd backend/scripts

# Option A: CSV Import
node csv-to-candidates.js your-exported-file.csv
# Then copy the generated data to import-real-candidates.js

# Option B: Direct Import (after manually adding data)
node import-real-candidates.js

# Verify import
node ../check-db.js
```

## 🛡️ Safety Features

- ✅ **Backup created** before any changes
- ✅ **Validation** of constituency and party names
- ✅ **Error reporting** for missing data
- ✅ **Rollback possible** using backup file

## 📈 Current Test Results

```
✅ Added 6 real candidates:
   - वैशाली: 3 candidates (RJD, BJP, JDU)
   - महुआ: 3 candidates (VIP, BJP, RJD)

⚠️ 237 constituencies still need candidate data
```

## 🎯 Action Required

1. **Share your Google Sheets data** in CSV format, OR
2. **Add more candidates** to the `REAL_CANDIDATES_DATA` array in `import-real-candidates.js`
3. **Run the import** script
4. **Test the website** to verify candidates appear correctly

---

Would you like me to help with any specific step or need the CSV conversion script customized for your data format?