# Party Logos Directory

This directory contains official election symbols for political parties participating in Bihar elections.

## Files

| File | Party | Symbol | Format | Size |
|------|-------|--------|--------|------|
| `bjp-lotus.svg` | Bharatiya Janata Party (BJP) | Lotus 🪷 | SVG | 98B |
| `rjd-lamp.svg` | Rashtriya Janata Dal (RJD) | Hurricane Lamp 🏮 | SVG | 96B |
| `jdu-arrow.svg` | Janata Dal (United) | Arrow ➡️ | SVG | 99B |
| `inc-hand.svg` | Indian National Congress (INC) | Hand ✋ | SVG | 79B |
| `cpim-flag.svg` | Communist Party of India (Marxist) | Hammer, Sickle & Star ⚒️🌟 | SVG | 86B |
| `ljp-bungalow.png` | Lok Janshakti Party (Ram Vilas) | Bungalow 🏠 | PNG | 2.1KB |

## Source

All logos are sourced from **Wikimedia Commons** and are in the public domain or under Creative Commons licenses.

## Usage

These logos are displayed on the voting page when users select candidates. The images are served from the local Next.js public directory for faster loading.

### In Database
```sql
-- Example
UPDATE Parties 
SET symbol_url = '/images/party-logos/bjp-lotus.svg' 
WHERE short_code = 'BJP';
```

### In React Component
```tsx
<img 
  src={candidate.party?.symbol_url} 
  alt={`${candidate.party.abbreviation} symbol`}
  className="w-14 h-14 object-contain"
/>
```

## File Formats

- **SVG (Scalable Vector Graphics)**: Preferred format for most logos. Scales perfectly at any size without loss of quality.
- **PNG (Portable Network Graphics)**: Used for LJP logo. Raster format at 200px resolution.

## License & Attribution

These images are used for educational and informational purposes in the context of an election opinion poll application. All logos are official election symbols registered with the Election Commission of India.

**Source Attribution:**
- Downloaded from: Wikimedia Commons (https://commons.wikimedia.org)
- License: Public Domain / Creative Commons
- Usage: Non-commercial, educational

## Updating Logos

To update or add new party logos:

1. Download official logo from Wikimedia Commons or ECI website
2. Save as SVG (preferred) or PNG in this directory
3. Use descriptive filename: `{party-code}-{symbol-name}.{ext}`
4. Update database using: `node backend/scripts/update-party-symbols.js`
5. Clear browser cache and refresh

## Image Optimization

All SVG files are already optimized and small (<100 bytes each). No further optimization needed.

For PNG files:
- Keep resolution at 200x200px or similar
- Use PNG-8 or PNG-24 with transparency
- Compress using tools like TinyPNG if needed

---

*Last Updated: October 8, 2025*  
*Total Files: 6 (5 SVG + 1 PNG)*
