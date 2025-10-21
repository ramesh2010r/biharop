# Constituency Overrides Mapping

This folder contains explicit constituency name overrides used by the CSV importer to resolve names that don't directly match the official Constituencies table.

- File: `constituency_overrides.json`
  - Format: `{ "<cleaned CSV name>": "<official constituency name in Hindi (exact as DB)>" }`
  - Keys should match the "cleaned" value emitted in the unmatched CSV report (parentheses, SC/ST, and extra words removed).
  - Values must be exactly the official Hindi constituency name as stored in the database.

How it's used:
- The importer (`../import-csv-validated-sync.js`) loads this mapping (if present) and applies it before fuzzy matching.
- If a mapping exists and matches a single official constituency, the row is inserted accordingly.

Workflow to fix new unmatched entries:
1. Run the importer with `--sync` to generate the latest unmatched CSV under `../reports/`.
2. Open the unmatched file and copy the `cleaned` column values that need mapping.
3. Add entries into `constituency_overrides.json` mapping each cleaned label to the official DB name.
4. Re-run the importer with `--sync` and confirm unmatched count is 0.

Notes:
- Keep keys unique; do not duplicate the same key.
- When in doubt, verify the official constituency names directly from the database.
